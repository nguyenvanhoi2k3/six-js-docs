/**
 * Đồng bộ tick checklist giữa mọi người qua Firebase Realtime Database (xem src/lib/realtime-db.ts).
 *
 * Dữ liệu nằm ở node `six-js-checklist`, dạng { "<item-id>": true } — mỗi mục được ghi/xóa
 * riêng, nên hai người tick hai mục cùng lúc không ghi đè lên nhau.
 */
import { dbRequest, subscribe, type SyncStatus } from "../../lib/realtime-db";

const NODE = "six-js-checklist";

export interface ChecklistSync {
  setItem(id: string, done: boolean): void;
  clearAll(): void;
}

interface SyncHandlers {
  /** Trạng thái tick mới nhất từ server (toàn bộ danh sách). */
  onRemote(ids: Set<string>): void;
  onStatus(status: SyncStatus): void;
}

export function connectChecklistSync(handlers: SyncHandlers): ChecklistSync | null {
  let remote = new Set<string>();
  const emit = () => handlers.onRemote(new Set(remote));

  const subscription = subscribe<Record<string, boolean>>(NODE, {
    onValue(value) {
      remote = new Set(Object.keys(value ?? {}).filter((id) => value![id]));
      emit();
    },
    onStatus: handlers.onStatus,
  });
  if (!subscription) return null;

  // Ghi thất bại → trả UI về đúng trạng thái trên server.
  const send = (path: string, method: "PUT" | "DELETE", body?: unknown) => dbRequest(path, method, body).catch(emit);

  return {
    setItem(id, done) {
      send(`${NODE}/${encodeURIComponent(id)}`, done ? "PUT" : "DELETE", done ? true : undefined);
    },
    clearAll() {
      send(NODE, "DELETE");
    },
  };
}
