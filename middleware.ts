/**
 * Vercel Routing Middleware — chặn toàn bộ docs (trang, JS, CSS, ảnh, demo trong public/) bằng
 * mật khẩu, kiểm tra phía server trước khi Vercel trả file. Chỉ chạy trên bản deploy Vercel.
 *
 * Mật khẩu lấy từ biến môi trường DOCS_PASSWORD (Vercel → Project → Settings → Environment
 * Variables). Đổi mật khẩu = sửa biến đó rồi redeploy; mọi phiên đăng nhập cũ tự hết hiệu lực
 * vì cookie được ký bằng chính mật khẩu.
 */
import { next } from "@vercel/functions/middleware";

declare const process: { env: Record<string, string | undefined> };

const COOKIE_NAME = "six_docs_auth";
const LOGIN_TTL_SECONDS = 30 * 24 * 60 * 60; // nhập lại mật khẩu mỗi 30 ngày
const LOGIN_PATH = "/__login";
/** File được phép tải khi chưa đăng nhập (logo trên màn hình đăng nhập). */
const PUBLIC_PATHS = new Set(["/sixjs_logo_fav_56x56.svg"]);

const encoder = new TextEncoder();

async function sign(password: string, expires: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`six-docs:${expires}`));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

async function hasValidSession(request: Request, password: string): Promise<boolean> {
  const [expiresRaw, signature] = (readCookie(request, COOKIE_NAME) ?? "").split(".");
  const expires = Number(expiresRaw);
  if (!signature || !Number.isFinite(expires) || expires * 1000 < Date.now()) return false;
  return safeEqual(signature, await sign(password, expires));
}

/** Chỉ cho redirect về đường dẫn nội bộ, tránh bị lợi dụng để chuyển hướng sang site khác. */
function safeRedirectPath(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith(LOGIN_PATH) ? value : "/";
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function loginPage(redirectPath: string, wrongPassword: boolean): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex" />
<title>SixJS Docs</title>
<link rel="icon" type="image/svg+xml" href="/sixjs_logo_fav_56x56.svg" />
<script>
  try {
    var t = localStorage.getItem("six-js-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
</script>
<style>
  :root { color-scheme: dark; --bg: #080616; --surface: #161420; --primary: #7c5cff; --accent: #ff6b4a; --text: #f5f3ff; --muted: #9a94b3; --border: #c6c1da; }
  :root[data-theme="light"] { color-scheme: light; --bg: #ffffff; --surface: #f5f4f9; --primary: #6428e0; --accent: #e2572f; --text: #16141f; --muted: #615c78; --border: #e2e0ea; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px; background: var(--bg); color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  form { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: min(100%, 360px); padding: 2rem 1.75rem;
    border: 1px solid var(--border); border-radius: 12px; background: var(--surface); text-align: center; }
  form.is-shake { animation: shake 0.35s ease; }
  img { width: 48px; height: 48px; }
  h1 { margin: 0.25rem 0 0; font-size: 1.25rem; }
  p { margin: 0; font-size: 0.9rem; }
  .hint { margin-bottom: 0.5rem; color: var(--muted); }
  .error { min-height: 1.2em; color: var(--accent); }
  input { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); font: inherit; }
  input:focus { outline: 2px solid var(--primary); outline-offset: 1px; border-color: transparent; }
  button { width: 100%; padding: 0.75rem 1.5rem; border: 0; border-radius: 12px; background: var(--primary); color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  button:hover { filter: brightness(1.1); }
  @keyframes shake { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
  @media (prefers-reduced-motion: reduce) { form.is-shake { animation: none; } }
</style>
</head>
<body>
<form method="post" action="${LOGIN_PATH}"${wrongPassword ? ' class="is-shake"' : ""}>
  <img src="/sixjs_logo_fav_56x56.svg" alt="" width="48" height="48" />
  <h1>SixJS Docs</h1>
  <p class="hint">Enter the password to continue.</p>
  <input type="hidden" name="next" value="${escapeHtml(redirectPath)}" />
  <input type="password" name="password" autocomplete="current-password" placeholder="Password" aria-label="Password" required autofocus />
  <p class="error" role="alert">${wrongPassword ? "Wrong password." : ""}</p>
  <button type="submit">Unlock</button>
</form>
</body>
</html>`;

  return new Response(html, {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export default async function middleware(request: Request): Promise<Response> {
  const password = process.env.DOCS_PASSWORD;
  // Chưa cấu hình mật khẩu thì khóa hẳn, không để lộ docs.
  if (!password) {
    return new Response("DOCS_PASSWORD is not configured.", { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const url = new URL(request.url);
  if (PUBLIC_PATHS.has(url.pathname)) return next();

  if (url.pathname === LOGIN_PATH && request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const redirectPath = safeRedirectPath(form?.get("next"));
    const input = form?.get("password");

    if (typeof input !== "string" || !safeEqual(input, password)) return loginPage(redirectPath, true);

    const expires = Math.floor(Date.now() / 1000) + LOGIN_TTL_SECONDS;
    const cookie = `${COOKIE_NAME}=${expires}.${await sign(password, expires)}; Path=/; Max-Age=${LOGIN_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
    return new Response(null, { status: 303, headers: { Location: redirectPath, "Set-Cookie": cookie, "Cache-Control": "no-store" } });
  }

  if (await hasValidSession(request, password)) return next();

  return loginPage(url.pathname === LOGIN_PATH ? "/" : url.pathname + url.search, false);
}
