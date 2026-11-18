/**
 * Firebase Realtime Database dùng chung cho các tool của docs (checklist, notes…) — gọi thẳng REST
 * + streaming (EventSource), không cần SDK. Mỗi tool dùng một node riêng; quyền đọc/ghi của từng
 * node khai báo trong Rules trên Firebase Console.
 */
export const DB_URL: string = "https://six-js-default-rtdb.asia-southeast1.firebasedatabase.app";

export type SyncStatus = "local" | "connecting" | "online" | "offline" | "denied";

/** Giá trị đặc biệt: Firebase tự điền thời gian của server (ms) khi ghi. */
export const SERVER_TIMESTAMP = { ".sv": "timestamp" } as const;

export const STATUS_TEXT: Record<SyncStatus, string> = {
  local: "Local only",
  connecting: "Connecting…",
  online: "Synced",
  offline: "Offline, retrying…",
  denied: "No access",
};

type Tree = unknown;

function segmentsOf(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/** Ghi `value` vào `root` tại `segments` (null = xóa), bỏ nhánh rỗng giống cách Firebase lưu. */
function setAt(root: Tree, segments: string[], value: Tree): Tree {
  if (!segments.length) return value;
  const [key, ...rest] = segments;
  const obj: Record<string, Tree> = root && typeof root === "object" ? { ...(root as Record<string, Tree>) } : {};
  const child = setAt(obj[key], rest, value);
  if (child === null || child === undefined) delete obj[key];
  else obj[key] = child;
  return Object.keys(obj).length ? obj : null;
}

export interface Subscription {
  close(): void;
}

/**
 * Theo dõi realtime một node: gọi onValue với toàn bộ giá trị mới nhất mỗi khi có thay đổi.
 * Mất mạng thì EventSource tự kết nối lại và Firebase gửi lại toàn bộ dữ liệu.
 */
export function subscribe<T>(path: string, handlers: { onValue(value: T | null): void; onStatus(status: SyncStatus): void }): Subscription | null {
  if (!DB_URL) {
    handlers.onStatus("local");
    return null;
  }

  let root: Tree = null;
  const apply = (raw: string, merge: boolean) => {
    const { path: at, data } = JSON.parse(raw) as { path: string; data: Tree };
    const segments = segmentsOf(at);
    if (merge && data && typeof data === "object") {
      for (const [key, value] of Object.entries(data)) root = setAt(root, [...segments, key], value);
    } else {
      root = setAt(root, segments, data);
    }
    handlers.onValue(root as T | null);
  };

  handlers.onStatus("connecting");
  const stream = new EventSource(`${DB_URL}/${path}.json`);
  stream.addEventListener("put", (e) => {
    handlers.onStatus("online");
    apply((e as MessageEvent<string>).data, false);
  });
  stream.addEventListener("patch", (e) => apply((e as MessageEvent<string>).data, true));
  // Mất mạng → EventSource tự thử lại (CONNECTING). Server từ chối hẳn (vd. Rules không cho đọc,
  // trả 401) → EventSource đóng luôn (CLOSED), không thử lại nữa.
  stream.addEventListener("error", () => handlers.onStatus(stream.readyState === EventSource.CLOSED ? "denied" : "offline"));
  // "cancel": Rules bị đổi khi đang kết nối, không còn quyền đọc node này.
  stream.addEventListener("cancel", () => {
    stream.close();
    handlers.onStatus("denied");
  });

  return { close: () => stream.close() };
}

/** Ghi dữ liệu qua REST. Lỗi (mất mạng, bị Rules chặn…) sẽ reject. */
export async function dbRequest<T = unknown>(path: string, method: "PUT" | "PATCH" | "POST" | "DELETE", body?: unknown): Promise<T> {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Realtime DB ${method} ${path}: ${res.status}`);
  return (await res.json()) as T;
}
