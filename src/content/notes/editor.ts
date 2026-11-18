/**
 * Thao tác soạn thảo trên <textarea> markdown: bọc chữ đang chọn, thêm/bỏ tiền tố dòng, tự nối
 * list khi Enter, Tab thụt lề. Dùng execCommand("insertText") để Ctrl+Z vẫn hoàn tác được; trình
 * duyệt không hỗ trợ thì dùng setRangeText (mất undo nhưng vẫn đúng nội dung).
 */

function replaceRange(ta: HTMLTextAreaElement, start: number, end: number, text: string, selectStart: number, selectEnd: number): void {
  ta.focus();
  ta.setSelectionRange(start, end);
  const ok = document.execCommand?.("insertText", false, text);
  if (!ok) {
    ta.setRangeText(text, start, end, "end");
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }
  ta.setSelectionRange(selectStart, selectEnd);
}

/** Bọc phần đang chọn bằng `before`/`after` (vd. ** **); chưa chọn gì thì chèn placeholder và chọn nó. */
export function wrapSelection(ta: HTMLTextAreaElement, before: string, after: string, placeholder: string): void {
  const { selectionStart: start, selectionEnd: end, value } = ta;
  const selected = value.slice(start, end);

  // Đã được bọc sẵn → bỏ bọc.
  if (selected && value.slice(start - before.length, start) === before && value.slice(end, end + after.length) === after) {
    replaceRange(ta, start - before.length, end + after.length, selected, start - before.length, end - before.length);
    return;
  }

  const inner = selected || placeholder;
  const innerStart = start + before.length;
  replaceRange(ta, start, end, before + inner + after, innerStart, innerStart + inner.length);
}

/** Chèn link markdown; chữ đang chọn thành nội dung link. */
export function insertLink(ta: HTMLTextAreaElement): void {
  const { selectionStart: start, selectionEnd: end, value } = ta;
  const label = value.slice(start, end) || "link";
  const text = `[${label}](https://)`;
  const urlStart = start + label.length + 3;
  replaceRange(ta, start, end, text, urlStart, urlStart + "https://".length);
}

const LINE_PREFIX = /^(\s*)(#{1,3}\s+|[-*+]\s+\[[ xX]\]\s+|[-*+]\s+|\d+[.)]\s+|>\s?)?/;

function selectedLineRange(ta: HTMLTextAreaElement): [number, number] {
  const { selectionStart, selectionEnd, value } = ta;
  const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
  let end = value.indexOf("\n", selectionEnd === selectionStart ? selectionEnd : selectionEnd - 1);
  if (end === -1) end = value.length;
  return [start, end];
}

/**
 * Đặt kiểu cho các dòng đang chọn (heading, bullet, todo, quote…). Nếu mọi dòng đã đúng kiểu đó
 * thì bỏ kiểu (về đoạn văn thường). `prefix` có thể là hàm để đánh số 1. 2. 3.
 */
export type LinePrefix = string | ((index: number) => string);

/** Bản thuần (không đụng DOM) của setLineStyle — dùng chung cho editor và định dạng nhanh khi bôi đen. */
export function styleLines(lines: string[], prefix: LinePrefix, matcher: RegExp): string[] {
  const allMatch = lines.every((line) => !line.trim() || matcher.test(line.trimStart()));
  return lines.map((line, index) => {
    const [, indent, existing = ""] = line.match(LINE_PREFIX)!;
    const body = line.slice(indent.length + existing.length);
    if (allMatch) return indent + body;
    return indent + (typeof prefix === "function" ? prefix(index) : prefix) + body;
  });
}

export function setLineStyle(ta: HTMLTextAreaElement, prefix: LinePrefix, matcher: RegExp): void {
  const [start, end] = selectedLineRange(ta);
  const text = styleLines(ta.value.slice(start, end).split("\n"), prefix, matcher).join("\n");
  replaceRange(ta, start, end, text, start + text.length, start + text.length);
}

/** Enter trong list: tự thêm ký hiệu cho dòng mới; Enter ở mục rỗng thì thoát list. Trả về true nếu đã xử lý. */
export function continueList(ta: HTMLTextAreaElement): boolean {
  const { selectionStart, selectionEnd, value } = ta;
  if (selectionStart !== selectionEnd) return false;

  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const line = value.slice(lineStart, selectionStart);
  const m = line.match(/^(\s*)([-*+]\s+\[[ xX]\]\s+|[-*+]\s+|(\d+)([.)])\s+|>\s?)/);
  if (!m) return false;

  // Mục rỗng (chỉ có ký hiệu) → xóa ký hiệu, kết thúc list.
  if (line.trim() === m[0].trim() && value.slice(selectionStart).split("\n")[0].trim() === "") {
    replaceRange(ta, lineStart, selectionStart, "", lineStart, lineStart);
    return true;
  }

  let marker = m[2];
  if (m[3]) marker = `${Number(m[3]) + 1}${m[4]} `;
  else if (/\[[ xX]\]/.test(marker)) marker = marker.replace(/\[[xX]\]/, "[ ]");
  const insert = `\n${m[1]}${marker}`;
  replaceRange(ta, selectionStart, selectionEnd, insert, selectionStart + insert.length, selectionStart + insert.length);
  return true;
}

/** Tab / Shift+Tab: thụt / bỏ thụt 2 dấu cách cho các dòng đang chọn. */
export function indentLines(ta: HTMLTextAreaElement, outdent: boolean): void {
  const [start, end] = selectedLineRange(ta);
  const caret = ta.selectionStart;
  const lines = ta.value.slice(start, end).split("\n");
  let firstDelta = 0;
  const next = lines.map((line, index) => {
    if (!outdent) {
      if (index === 0) firstDelta = 2;
      return `  ${line}`;
    }
    const removed = line.match(/^ {1,2}/)?.[0].length ?? 0;
    if (index === 0) firstDelta = -removed;
    return line.slice(removed);
  });
  const text = next.join("\n");
  const multi = lines.length > 1;
  replaceRange(ta, start, end, text, multi ? start : Math.max(start, caret + firstDelta), multi ? start + text.length : Math.max(start, caret + firstDelta));
}

/** Đặt con trỏ ở cuối dòng thứ `line` (0-based). */
export function caretToLine(ta: HTMLTextAreaElement, line: number): void {
  const lines = ta.value.split("\n");
  let offset = 0;
  for (let i = 0; i < Math.min(line, lines.length - 1); i++) offset += lines[i].length + 1;
  offset += lines[Math.min(line, lines.length - 1)]?.length ?? 0;
  ta.focus();
  ta.setSelectionRange(offset, offset);
}

export function autoGrow(ta: HTMLTextAreaElement): void {
  ta.style.height = "auto";
  ta.style.height = `${ta.scrollHeight}px`;
}
