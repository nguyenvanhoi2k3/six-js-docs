/**
 * Màn hình nhập mật khẩu cho toàn bộ docs. Import đầu tiên trong mọi page entry: nếu chưa đăng
 * nhập (hoặc đã quá hạn LOGIN_TTL_MS / mật khẩu đã đổi) thì che trang lại cho tới khi nhập đúng.
 *
 * Đây là lớp chặn phía trình duyệt cho người xem bình thường — site vẫn là file tĩnh, nên
 * người rành kỹ thuật có thể đọc thẳng file JS. Không đặt thông tin bí mật thật trong docs.
 */
import "./gate.css";
import { LOGIN_TTL_MS, PASSWORD_HASH, PASSWORD_SALT } from "./config";
import { sha256 } from "./sha256";

const STORAGE_KEY = "six-js-auth";

interface SavedLogin {
  hash: string;
  expires: number;
}

function isLoggedIn(): boolean {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as SavedLogin | null;
    return saved?.hash === PASSWORD_HASH && typeof saved.expires === "number" && Date.now() < saved.expires;
  } catch {
    return false;
  }
}

function saveLogin(): void {
  try {
    const login: SavedLogin = { hash: PASSWORD_HASH, expires: Date.now() + LOGIN_TTL_MS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(login));
  } catch {
    /* storage bị chặn — vẫn vào được, chỉ là lần sau phải nhập lại */
  }
}

function lock(): void {
  const root = document.documentElement;
  root.setAttribute("data-locked", "");

  const gate = document.createElement("div");
  gate.className = "auth-gate";
  gate.innerHTML = `
    <form class="auth-gate__card" autocomplete="on">
      <img class="auth-gate__logo" src="sixjs_logo_fav_56x56.svg" alt="" width="48" height="48" />
      <h1 class="auth-gate__title">SixJS Docs</h1>
      <p class="auth-gate__hint">Enter the password to continue.</p>
      <input class="auth-gate__input" type="password" name="password" autocomplete="current-password" placeholder="Password" aria-label="Password" required />
      <p class="auth-gate__error" role="alert" aria-live="polite"></p>
      <button type="submit" class="btn btn--primary auth-gate__submit">Unlock</button>
    </form>
  `;
  document.body.appendChild(gate);

  const form = gate.querySelector<HTMLFormElement>("form")!;
  const input = gate.querySelector<HTMLInputElement>("input")!;
  const error = gate.querySelector<HTMLElement>(".auth-gate__error")!;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (sha256(PASSWORD_SALT + input.value) === PASSWORD_HASH) {
      saveLogin();
      root.removeAttribute("data-locked");
      gate.remove();
      return;
    }
    error.textContent = "Wrong password.";
    form.classList.remove("is-shake");
    void form.offsetWidth; // khởi động lại animation khi nhập sai liên tiếp
    form.classList.add("is-shake");
    input.select();
  });

  input.addEventListener("input", () => (error.textContent = ""));
  input.focus();
}

if (__CLIENT_GATE__ && !isLoggedIn()) lock();
