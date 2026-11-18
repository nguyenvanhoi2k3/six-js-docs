import "./index.scss";
import { dbRequest, SERVER_TIMESTAMP, STATUS_TEXT, subscribe } from "../../lib/realtime-db";
import { autoGrow, continueList, indentLines, insertLink, setLineStyle, wrapSelection } from "./editor";
import { escapeHtml, plainText } from "./markdown";
import { createWysiwyg, type BlockType, type InlineCommand, type WysiwygEditor } from "./wysiwyg";
import { h, Fragment } from "../../jsx";

/** Node trên Firebase: { "<id tự sinh>": Note }. Giới hạn khớp với database.rules.json. */
const NODE = "six-js-notes";
const MAX_TITLE = 200;
const MAX_AUTHOR = 40;
const SAVE_DELAY = 700;
const AUTHOR_KEY = "six-js-notes-author";
const SORT_KEY = "six-js-notes-sort";
const COLLAPSED_KEY = "six-js-notes-collapsed";
/** Bật = sửa dạng markdown thô (textarea); tắt = soạn trực tiếp kiểu Notion (mặc định). */
const RAW_KEY = "six-js-notes-raw";
const DEFAULT_ICON = "📝";

interface Note {
  title?: string;
  icon?: string;
  content?: string;
  author?: string;
  updatedBy?: string;
  createdAt?: number;
  updatedAt?: number;
  pinned?: boolean;
}

interface SortOption {
  value: string;
  label: string;
  group: string;
  /** Giá trị dùng để so sánh — số (sắp giảm/tăng theo `desc`) hoặc chuỗi. */
  key: (note: Note) => number | string;
  desc?: boolean;
}

/** Các kiểu sắp xếp danh sách trang (nhóm theo `group` trong ô chọn). */
const SORTS: SortOption[] = [
  { value: "updated", label: "Latest edit", group: "Date", key: (n) => n.updatedAt ?? n.createdAt ?? 0, desc: true },
  { value: "updated-asc", label: "Earliest edit", group: "Date", key: (n) => n.updatedAt ?? n.createdAt ?? 0 },
  { value: "created", label: "Newest", group: "Date", key: (n) => n.createdAt ?? 0, desc: true },
  { value: "created-asc", label: "Oldest", group: "Date", key: (n) => n.createdAt ?? 0 },
  { value: "title", label: "A → Z", group: "Name", key: (n) => titleOf(n) },
  { value: "title-desc", label: "Z → A", group: "Name", key: (n) => titleOf(n), desc: true },
  { value: "author", label: "Creator", group: "Name", key: (n) => n.author ?? "" },
  { value: "editor", label: "Last editor", group: "Name", key: (n) => n.updatedBy ?? n.author ?? "" },
  { value: "longest", label: "Longest", group: "Content", key: (n) => countWords(contentOf(n)), desc: true },
  { value: "shortest", label: "Shortest", group: "Content", key: (n) => countWords(contentOf(n)) },
  { value: "todos", label: "Open to-dos", group: "Content", key: (n) => openTodos(contentOf(n)), desc: true },
];

const EMOJIS = [
  "📝", "📌", "💡", "✅", "📋", "📚", "🗂️", "🗒️", "📅", "🎯",
  "🚀", "🐞", "🔥", "⭐", "⚠️", "❓", "💬", "📣", "🔗", "🔒",
  "🧪", "🧩", "📦", "🛠️", "⚙️", "💻", "📱", "🌐", "🎨", "🖼️",
  "🎬", "🛒", "💰", "📈", "🏷️", "🧠", "👀", "🤔", "😀", "❤️",
];

const ICON = {
  back: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>',
  pin: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 2.5h5M8.5 2.5v5L5.5 11h9l-3-3.5v-5M10 11v6.5"/></svg>',
  link: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1"/><path d="M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1"/></svg>',
  copy: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13H7"/></svg>',
  trash: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5.5h13M8 5.5V3.5h4v2M5.5 5.5l.8 11h7.4l.8-11"/></svg>',
  plus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 4v12M4 10h12"/></svg>',
};

/** Nút trên thanh định dạng: [nhãn, tooltip, lệnh]; lệnh rỗng = vạch ngăn cách. */
/** Thanh định dạng nổi khi bôi đen chữ ở chế độ xem: [nhãn, tooltip, lệnh]; lệnh rỗng = vạch ngăn. */
const BUBBLE: [label: string, title: string, command: string][] = [
  ["<b>B</b>", "Bold (Ctrl+B)", "bold"],
  ["<i>I</i>", "Italic (Ctrl+I)", "italic"],
  ["<s>S</s>", "Strikethrough", "strike"],
  ["&lt;/&gt;", "Code (Ctrl+E)", "code"],
  ["Link", "Link (Ctrl+K)", "link"],
  ["", "", ""],
  ["H1", "Heading 1", "h1"],
  ["H2", "Heading 2", "h2"],
  ["H3", "Heading 3", "h3"],
  ["•", "Bulleted list", "bullet"],
  ["1.", "Numbered list", "numbered"],
  ["☐", "To-do", "todo"],
  ["❝", "Quote", "quote"],
];

const TOOLBAR: [label: string, title: string, command: string][] = [
  ["H1", "Heading 1", "h1"],
  ["H2", "Heading 2", "h2"],
  ["H3", "Heading 3", "h3"],
  ["", "", ""],
  ["<b>B</b>", "Bold (Ctrl+B)", "bold"],
  ["<i>I</i>", "Italic (Ctrl+I)", "italic"],
  ["<s>S</s>", "Strikethrough", "strike"],
  ["&lt;/&gt;", "Inline code (Ctrl+E)", "code"],
  ["Link", "Link (Ctrl+K)", "link"],
  ["", "", ""],
  ["• List", "Bulleted list", "bullet"],
  ["1. List", "Numbered list", "numbered"],
  ["☐ To-do", "To-do list", "todo"],
  ["❝ Quote", "Quote", "quote"],
  ["{ } Code", "Code block", "codeblock"],
  ["—", "Divider", "divider"],
];

const dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" });
const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(ms: number | undefined): string {
  if (!ms) return "";
  const seconds = Math.round((ms - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  if (abs < 3600) return relativeFormat.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return relativeFormat.format(Math.round(seconds / 3600), "hour");
  if (abs < 7 * 86400) return relativeFormat.format(Math.round(seconds / 86400), "day");
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(ms);
}

/** Bỏ dấu + chữ thường để tìm "ghi chu" vẫn ra "Ghi chú". */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
}

function contentOf(note: Note): string {
  return note.content ?? "";
}

function titleOf(note: Note): string {
  return note.title?.trim() || "Untitled";
}

/** Số to-do chưa tick (`- [ ]`). */
function openTodos(markdown: string): number {
  return markdown.match(/^\s*[-*+]\s+\[ \]/gm)?.length ?? 0;
}

function countWords(markdown: string): number {
  const text = plainText(markdown).trim();
  return text ? text.split(/\s+/).length : 0;
}

function storageGet(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage bị chặn — chỉ mất phần ghi nhớ */
  }
}

export function renderNotes(): string {
  return (
    <div class="np" data-notes>
      <aside class="np-sidebar">
        <div class="np-sidebar__top">
          <button type="button" class="np-new" data-new>
            {ICON.plus}
            New page
          </button>
          <input type="search" class="np-field" placeholder="Search pages" aria-label="Search pages" data-search />
          <div class="np-sort-row">
            <button type="button" class="np-link-btn" data-select-mode title="Select multiple pages (or Ctrl/Shift + click a page)">
              Select
            </button>
            <label class="np-sort">
              <span>Sort by</span>
              <select data-sort aria-label="Sort pages">
                {[...new Set(SORTS.map((o) => o.group))].map((group) => (
                  <optgroup label={group}>
                    {SORTS.filter((o) => o.group === group).map((o) => (
                      <option value={o.value}>{o.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div class="np-selectbar" data-selectbar hidden>
          <label class="np-selectbar__all">
            <input type="checkbox" data-select-all aria-label="Select all visible pages" />
            <span data-select-count>0 selected</span>
          </label>
          <button type="button" class="np-link-btn" data-bulk="pin" disabled>
            Pin
          </button>
          <button type="button" class="np-link-btn np-link-btn--danger" data-bulk="delete" disabled>
            Delete
          </button>
          <button type="button" class="np-link-btn" data-bulk="exit" title="Exit selection (Esc)">
            Exit
          </button>
        </div>
        <nav class="np-list" data-list aria-label="Pages" />
        <div class="np-sidebar__foot">
          <label class="np-name">
            <span>Your name</span>
            <input class="np-field" maxlength={MAX_AUTHOR} placeholder="Anonymous" data-author />
          </label>
          <span class="sync-status" data-sync-status="local" />
        </div>
      </aside>
      <main class="np-main" data-main />
      <div class="np-bubble" data-bubble hidden role="toolbar" aria-label="Format selection">
        {BUBBLE.map(([label, title, command]) =>
          command ? (
            <button type="button" data-quick={command} title={title}>
              {label}
            </button>
          ) : (
            <span class="np-bubble__sep" />
          ),
        )}
      </div>
    </div>
  );
}

function renderPage(note: Note): string {
  return (
    <article class="np-page">
      <div class="np-topbar">
        <button type="button" class="np-tool np-back" data-back aria-label="Back to pages">
          {ICON.back}
        </button>
        <span class="np-crumb" data-crumb />
        <span class="np-topbar__meta">
          <span class="np-save" data-save />
          <span class="np-edited" data-edited />
        </span>
        <button type="button" class="np-tool np-tool--text" data-act="markdown" title="Edit as Markdown" aria-pressed="false">
          MD
        </button>
        <button type="button" class="np-tool" data-act="pin" title="Pin to top">
          {ICON.pin}
        </button>
        <button type="button" class="np-tool" data-act="link" title="Copy link">
          {ICON.link}
        </button>
        <button type="button" class="np-tool" data-act="duplicate" title="Duplicate">
          {ICON.copy}
        </button>
        <button type="button" class="np-tool np-tool--danger" data-act="delete" title="Delete">
          {ICON.trash}
        </button>
      </div>

      <div class="np-doc">
        <div class="np-icon-row">
          <button type="button" class="np-page-icon" data-icon-btn />
          <div class="np-emoji" data-emoji hidden>
            {EMOJIS.map((emoji) => (
              <button type="button" data-emoji-pick={emoji}>
                {emoji}
              </button>
            ))}
            <button type="button" class="np-emoji__remove" data-emoji-pick="">
              Remove icon
            </button>
          </div>
        </div>

        <textarea class="np-title" data-title rows="1" maxlength={MAX_TITLE} placeholder="Untitled" aria-label="Page title">
          {escapeHtml(note.title ?? "")}
        </textarea>
        <div class="np-props" data-props />

        <div class="np-toolbar" data-toolbar>
          {TOOLBAR.map(([label, title, command]) =>
            command ? (
              <button type="button" data-fmt={command} title={title}>
                {label}
              </button>
            ) : (
              <span class="np-toolbar__sep" />
            ),
          )}
        </div>
        <div class="np-wysiwyg md" data-wysiwyg contenteditable="true" spellcheck="true" aria-label="Page content" />
        <textarea class="np-editor" data-editor hidden aria-label="Page content (Markdown)" placeholder="Write in Markdown…" />

      </div>
    </article>
  );
}

export function initNotes(root: HTMLElement): void {
  const layout = root.querySelector<HTMLElement>("[data-notes]")!;
  const listEl = root.querySelector<HTMLElement>("[data-list]")!;
  const mainEl = root.querySelector<HTMLElement>("[data-main]")!;
  const searchEl = root.querySelector<HTMLInputElement>("[data-search]")!;
  const sortEl = root.querySelector<HTMLSelectElement>("[data-sort]")!;
  const authorEl = root.querySelector<HTMLInputElement>("[data-author]")!;
  const statusEl = root.querySelector<HTMLElement>("[data-sync-status]")!;
  const mobile = matchMedia("(max-width: 860px)");

  let notes: Record<string, Note> = {};
  let loaded = false;
  let selectedId: string | null = null;
  let rawMode = storageGet(RAW_KEY) === "1";
  let editor: WysiwygEditor | null = null;
  /** Nội dung đang hiển thị/soạn của trang đang mở (có thể mới hơn bản trên server). */
  let localContent = "";
  let pending: { id: string; fields: Partial<Note> } | null = null;
  let saveTimer = 0;
  /** Chế độ chọn nhiều trang (để xóa / ghim hàng loạt). */
  let selecting = false;
  const picked = new Set<string>();
  /** Trang click gần nhất — mốc cho Shift+click chọn cả khoảng. */
  let pickAnchor: string | null = null;

  authorEl.value = storageGet(AUTHOR_KEY);
  const savedSort = storageGet(SORT_KEY);
  sortEl.value = SORTS.some((o) => o.value === savedSort) ? savedSort : SORTS[0].value;

  const author = () => authorEl.value.trim().slice(0, MAX_AUTHOR) || "Anonymous";
  const page = <T extends Element = HTMLElement>(selector: string) => mainEl.querySelector<T>(selector);

  // ---------- Danh sách trang (sidebar) ----------

  function sortedIds(): string[] {
    const sort = SORTS.find((o) => o.value === sortEl.value) ?? SORTS[0];
    // Tính key một lần cho mỗi trang (đếm từ trên nội dung dài khá tốn nếu làm trong mỗi lần so sánh).
    const keys = new Map(Object.keys(notes).map((id) => [id, sort.key(notes[id])]));
    const recent = (id: string) => notes[id].updatedAt ?? notes[id].createdAt ?? 0;
    return [...keys.keys()].sort((a, b) => {
      const ka = keys.get(a)!;
      const kb = keys.get(b)!;
      const diff = typeof ka === "string" ? ka.localeCompare(kb as string, "vi", { sensitivity: "base" }) : ka - (kb as number);
      // Bằng nhau thì trang sửa gần nhất lên trước.
      return (sort.desc ? -diff : diff) || recent(b) - recent(a);
    });
  }

  /** Đoạn trích quanh chỗ khớp từ khóa, hiện dưới tên trang khi đang tìm. */
  function snippet(note: Note, query: string): string {
    if (!query) return "";
    const text = plainText(contentOf(note)).replace(/\s+/g, " ").trim();
    const at = normalize(text).indexOf(query);
    if (at < 0) return "";
    const start = Math.max(0, at - 24);
    return `${start ? "…" : ""}${text.slice(start, at + query.length + 40)}…`;
  }

  function renderItem(id: string, query: string): string {
    const note = notes[id];
    const match = snippet(note, query);
    const sub = match || [timeAgo(note.updatedAt ?? note.createdAt), note.updatedBy ?? note.author].filter(Boolean).join(" · ");
    return (
      <a class={`np-item${id === selectedId && !selecting ? " is-active" : ""}${picked.has(id) ? " is-picked" : ""}`} href={`#${id}`} data-id={id}>
        {selecting ? <span class="np-item__check" aria-hidden="true" /> : ""}
        <span class="np-item__icon">{note.icon ? escapeHtml(note.icon) : "📄"}</span>
        <span class="np-item__body">
          <span class={`np-item__title${note.title?.trim() ? "" : " is-untitled"}`}>{escapeHtml(titleOf(note))}</span>
          <span class="np-item__sub">{escapeHtml(sub)}</span>
        </span>
      </a>
    );
  }

  let visibleIds: string[] = [];

  /** Nhóm đang thu gọn (Pinned / Pages) — nhớ cho lần sau. */
  const collapsed = new Set<string>(storageGet(COLLAPSED_KEY).split(",").filter(Boolean));

  function renderGroup(key: string, label: string, ids: string[], query: string): string {
    // Đang tìm kiếm thì luôn mở để thấy kết quả.
    const isCollapsed = collapsed.has(key) && !query;
    return (
      <div class={`np-group${isCollapsed ? " is-collapsed" : ""}`}>
        <button type="button" class="np-group__label" data-toggle-group={key} aria-expanded={String(!isCollapsed)}>
          <span class="np-group__chevron" aria-hidden="true" />
          {label} <span class="np-group__count">{ids.length}</span>
        </button>
        {isCollapsed ? "" : ids.map((id) => renderItem(id, query))}
      </div>
    );
  }

  function updateSelectBar(): void {
    layout.classList.toggle("is-selecting", selecting);
    const bar = root.querySelector<HTMLElement>("[data-selectbar]")!;
    bar.hidden = !selecting;
    root.querySelector<HTMLButtonElement>("[data-select-mode]")!.hidden = selecting;
    if (!selecting) return;

    const count = picked.size;
    root.querySelector("[data-select-count]")!.textContent = `${count} selected`;
    const all = root.querySelector<HTMLInputElement>("[data-select-all]")!;
    const pickedVisible = visibleIds.filter((id) => picked.has(id)).length;
    all.checked = visibleIds.length > 0 && pickedVisible === visibleIds.length;
    all.indeterminate = pickedVisible > 0 && pickedVisible < visibleIds.length;

    const pinBtn = root.querySelector<HTMLButtonElement>('[data-bulk="pin"]')!;
    const allPinned = count > 0 && [...picked].every((id) => notes[id]?.pinned);
    pinBtn.textContent = allPinned ? "Unpin" : "Pin";
    pinBtn.disabled = count === 0;
    root.querySelector<HTMLButtonElement>('[data-bulk="delete"]')!.disabled = count === 0;
  }

  function setSelecting(on: boolean): void {
    selecting = on;
    if (!on) {
      picked.clear();
      pickAnchor = null;
    }
    renderList();
  }

  /** Chọn / bỏ chọn một trang; `range` = Shift+click: chọn cả khoảng từ trang click trước đó. */
  function togglePick(id: string, range: boolean): void {
    if (!selecting) selecting = true;
    if (range && pickAnchor && visibleIds.includes(pickAnchor)) {
      const [from, to] = [visibleIds.indexOf(pickAnchor), visibleIds.indexOf(id)].sort((a, b) => a - b);
      visibleIds.slice(from, to + 1).forEach((x) => picked.add(x));
    } else if (picked.has(id)) {
      picked.delete(id);
    } else {
      picked.add(id);
    }
    pickAnchor = id;
    renderList();
  }

  async function bulkDelete(): Promise<void> {
    const ids = [...picked];
    if (!ids.length || !confirm(`Delete ${ids.length} page${ids.length > 1 ? "s" : ""} for everyone?`)) return;
    if (pending && ids.includes(pending.id)) {
      window.clearTimeout(saveTimer);
      pending = null;
    }
    try {
      // Một request, xóa tất cả cùng lúc (multi-path update: { "<id>": null, ... }).
      await dbRequest(NODE, "PATCH", Object.fromEntries(ids.map((id) => [id, null])));
      ids.forEach((id) => delete notes[id]);
      setSelecting(false);
      if (selectedId && ids.includes(selectedId)) {
        const next = !mobile.matches ? (sortedIds()[0] ?? null) : null;
        history.replaceState(null, "", next ? `#${next}` : location.pathname + location.search);
        select(next);
      }
    } catch {
      alert("Couldn't delete the pages. Check your connection and try again.");
    }
  }

  async function bulkPin(): Promise<void> {
    const ids = [...picked];
    if (!ids.length) return;
    const pin = !ids.every((id) => notes[id]?.pinned);
    const me = author();
    const update: Record<string, unknown> = {};
    for (const id of ids) {
      update[`${id}/pinned`] = pin;
      update[`${id}/updatedAt`] = SERVER_TIMESTAMP;
      update[`${id}/updatedBy`] = me;
      notes[id] = { ...notes[id], pinned: pin };
    }
    renderList();
    syncPageMeta();
    try {
      await dbRequest(NODE, "PATCH", update);
    } catch {
      alert("Couldn't update the pages. Check your connection and try again.");
    }
  }

  function renderList(): void {
    if (!loaded) {
      listEl.innerHTML = <p class="np-list__empty">Loading…</p>;
      return;
    }
    const query = normalize(searchEl.value.trim());
    const ids = sortedIds().filter((id) => !query || normalize(`${titleOf(notes[id])} ${contentOf(notes[id])}`).includes(query));
    const pinned = ids.filter((id) => notes[id].pinned);
    const others = ids.filter((id) => !notes[id].pinned);
    // Thứ tự đúng như đang hiện trên màn hình — dùng cho Shift+click và "Select all".
    visibleIds = [...(collapsed.has("pinned") && !query ? [] : pinned), ...(collapsed.has("pages") && !query ? [] : others)];
    picked.forEach((id) => {
      if (!notes[id]) picked.delete(id);
    });
    updateSelectBar();

    if (!ids.length) {
      listEl.innerHTML = <p class="np-list__empty">{query ? "No pages match your search." : "No pages yet."}</p>;
      return;
    }
    listEl.innerHTML = (
      <>
        {pinned.length ? renderGroup("pinned", "Pinned", pinned, query) : ""}
        {others.length ? renderGroup("pages", "Pages", others, query) : ""}
      </>
    );
  }

  // ---------- Lưu tự động (gộp các thay đổi liên tiếp thành 1 lần ghi) ----------

  function setSaveStatus(text: string, isError = false): void {
    const el = page("[data-save]");
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("is-error", isError);
  }

  function queueSave(fields: Partial<Note>, immediate = false): void {
    if (!selectedId) return;
    if (pending && pending.id !== selectedId) void flush();
    pending = { id: selectedId, fields: { ...pending?.fields, ...fields } };
    notes[selectedId] = { ...notes[selectedId], ...fields };
    setSaveStatus("Saving…");
    window.clearTimeout(saveTimer);
    if (immediate) void flush();
    else saveTimer = window.setTimeout(() => void flush(), SAVE_DELAY);
  }

  async function flush(): Promise<void> {
    window.clearTimeout(saveTimer);
    if (!pending) return;
    const { id, fields } = pending;
    pending = null;
    try {
      await dbRequest(`${NODE}/${id}`, "PATCH", { ...fields, updatedAt: SERVER_TIMESTAMP, updatedBy: author() });
      if (id === selectedId && !pending) setSaveStatus("Saved");
    } catch {
      if (id === selectedId) setSaveStatus("Couldn't save — check your connection", true);
    }
  }

  // ---------- Trang đang mở ----------

  /** Hiện editor WYSIWYG hoặc ô markdown thô tùy chế độ. */
  function applyMode(): void {
    const surface = page("[data-wysiwyg]");
    const textarea = page<HTMLTextAreaElement>("[data-editor]");
    if (!surface || !textarea) return;
    surface.hidden = rawMode;
    textarea.hidden = !rawMode;
    if (rawMode) {
      textarea.value = localContent;
      autoGrow(textarea);
    } else {
      editor?.load(localContent);
    }
    const toggle = page<HTMLButtonElement>('[data-act="markdown"]');
    toggle?.classList.toggle("is-on", rawMode);
    toggle?.setAttribute("aria-pressed", String(rawMode));
    if (toggle) toggle.title = rawMode ? "Back to rich editing" : "Edit as Markdown";
  }

  /** Cập nhật các phần phụ của trang (không đụng ô đang gõ). */
  function syncPageMeta(): void {
    if (!selectedId || !notes[selectedId]) return;
    const note = notes[selectedId];

    const crumb = page("[data-crumb]");
    if (crumb) crumb.innerHTML = `${note.icon ? `${escapeHtml(note.icon)} ` : ""}${escapeHtml(titleOf(note))}`;

    const edited = page("[data-edited]");
    if (edited) {
      const when = timeAgo(note.updatedAt ?? note.createdAt);
      edited.textContent = when ? `Edited ${when}${note.updatedBy ? ` by ${note.updatedBy}` : ""}` : "";
      if (note.updatedAt) edited.title = dateFormat.format(note.updatedAt);
    }

    const props = page("[data-props]");
    if (props) {
      const created = note.createdAt ? ` · <time>${escapeHtml(dateFormat.format(note.createdAt))}</time>` : "";
      props.innerHTML = `Created by <strong>${escapeHtml(note.author ?? "Anonymous")}</strong>${created}`;
    }

    const pin = page<HTMLButtonElement>('[data-act="pin"]');
    if (pin) {
      pin.classList.toggle("is-on", !!note.pinned);
      pin.title = note.pinned ? "Unpin" : "Pin to top";
      pin.setAttribute("aria-pressed", String(!!note.pinned));
    }

    const iconBtn = page<HTMLButtonElement>("[data-icon-btn]");
    if (iconBtn) {
      iconBtn.innerHTML = note.icon ? escapeHtml(note.icon) : "☺ Add icon";
      iconBtn.classList.toggle("is-empty", !note.icon);
      iconBtn.title = note.icon ? "Change icon" : "Add icon";
    }
    document.title = `${titleOf(note)} · Notes`;
  }

  function renderMain(): void {
    editor = null;
    layout.classList.toggle("is-detail", !!selectedId);

    if (!selectedId || !notes[selectedId]) {
      document.title = "SixJS - Notes";
      const deleted = !!selectedId && loaded;
      const hasNotes = Object.keys(notes).length > 0;
      mainEl.innerHTML = (
        <div class="np-empty">
          <p class="np-empty__icon">{deleted ? "🗑️" : "🗒️"}</p>
          <h2>{deleted ? "This page was deleted" : hasNotes ? "Select a page" : "No pages yet"}</h2>
          <p>{deleted ? "Someone removed it. Pick another page from the list." : "Shared notes for everyone with access to the docs — edits sync instantly."}</p>
          <button type="button" class="btn btn--primary btn--sm" data-new>
            New page
          </button>
        </div>
      );
      return;
    }

    const note = notes[selectedId];
    localContent = contentOf(note);
    mainEl.innerHTML = renderPage(note);
    autoGrow(page<HTMLTextAreaElement>("[data-title]")!);
    editor = createWysiwyg(page("[data-wysiwyg]")!, (markdown) => {
      localContent = markdown;
      queueSave({ content: markdown });
    });
    applyMode();
    syncPageMeta();
  }

  function select(id: string | null): void {
    void flush();
    selectedId = id;
    renderList();
    renderMain();
    if (mobile.matches) window.scrollTo({ top: 0 });
  }

  /** Dữ liệu mới từ server khi đang mở trang: chỉ cập nhật những gì người dùng không đang sửa. */
  function applyRemoteToPage(): void {
    if (!selectedId) return;
    const note = notes[selectedId];
    const title = page<HTMLTextAreaElement>("[data-title]");
    if (!note || !title) {
      renderMain();
      return;
    }
    if (document.activeElement !== title && pending?.fields.title === undefined && title.value !== (note.title ?? "")) {
      title.value = note.title ?? "";
      autoGrow(title);
    }
    // Nội dung người khác vừa sửa: chỉ cập nhật khi mình không đang gõ trong trang này.
    if (pending?.fields.content === undefined && localContent !== contentOf(note)) {
      const surface = page("[data-wysiwyg]");
      const textarea = page<HTMLTextAreaElement>("[data-editor]");
      const typing = surface?.contains(document.activeElement) || document.activeElement === textarea;
      if (!typing) {
        localContent = contentOf(note);
        applyMode();
      }
    }
    syncPageMeta();
  }

  // ---------- Soạn nội dung ----------

  const BLOCK_COMMANDS: Record<string, BlockType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    bullet: "bullet",
    numbered: "numbered",
    todo: "todo",
    quote: "quote",
    codeblock: "code",
    divider: "hr",
  };

  function applyFormat(command: string): void {
    if (!rawMode) {
      if (!editor) return;
      if (command in BLOCK_COMMANDS) editor.block(BLOCK_COMMANDS[command]);
      else editor.inline(command as InlineCommand);
      scheduleBubble();
      return;
    }
    const textarea = page<HTMLTextAreaElement>("[data-editor]");
    if (!textarea) return;
    switch (command) {
      case "h1":
        return setLineStyle(textarea, "# ", /^#\s/);
      case "h2":
        return setLineStyle(textarea, "## ", /^##\s/);
      case "h3":
        return setLineStyle(textarea, "### ", /^###\s/);
      case "bullet":
        return setLineStyle(textarea, "- ", /^[-*+]\s(?!\s*\[[ xX]\])/);
      case "numbered":
        return setLineStyle(textarea, (i) => `${i + 1}. `, /^\d+[.)]\s/);
      case "todo":
        return setLineStyle(textarea, "- [ ] ", /^[-*+]\s+\[[ xX]\]/);
      case "quote":
        return setLineStyle(textarea, "> ", /^>/);
      case "bold":
        return wrapSelection(textarea, "**", "**", "bold text");
      case "italic":
        return wrapSelection(textarea, "*", "*", "italic text");
      case "strike":
        return wrapSelection(textarea, "~~", "~~", "text");
      case "code":
        return wrapSelection(textarea, "`", "`", "code");
      case "link":
        return insertLink(textarea);
      case "codeblock":
        return wrapSelection(textarea, "```\n", "\n```", "code");
      case "divider":
        return wrapSelection(textarea, "\n---\n", "", "");
    }
  }

  // ---------- Tạo / nhân bản / xóa ----------

  async function createPage(base?: Note): Promise<void> {
    storageSet(AUTHOR_KEY, authorEl.value.trim());
    const me = author();
    const draft = {
      title: base ? `${titleOf(base)} (copy)`.slice(0, MAX_TITLE) : "",
      icon: base?.icon ?? DEFAULT_ICON,
      content: base ? contentOf(base) : "",
      author: me,
      updatedBy: me,
      pinned: false,
    };
    try {
      const { name } = await dbRequest<{ name: string }>(NODE, "POST", { ...draft, createdAt: SERVER_TIMESTAMP, updatedAt: SERVER_TIMESTAMP });
      notes[name] ??= { ...draft, createdAt: Date.now(), updatedAt: Date.now() };
      history.pushState(null, "", `#${name}`);
      select(name);
      page<HTMLTextAreaElement>("[data-title]")?.focus();
    } catch {
      alert("Couldn't create the page. Check your connection and try again.");
    }
  }

  async function deletePage(id: string): Promise<void> {
    if (!confirm(`Delete "${titleOf(notes[id])}" for everyone?`)) return;
    const ids = sortedIds();
    const index = ids.indexOf(id);
    const next = ids[index + 1] ?? ids[index - 1] ?? null;
    if (pending?.id === id) {
      window.clearTimeout(saveTimer);
      pending = null;
    }
    try {
      await dbRequest(`${NODE}/${id}`, "DELETE");
      delete notes[id];
      const target = next && !mobile.matches ? next : null;
      history.replaceState(null, "", target ? `#${target}` : location.pathname + location.search);
      select(target);
    } catch {
      alert("Couldn't delete the page. Check your connection and try again.");
    }
  }

  // ---------- Sự kiện ----------

  // ---------- Định dạng nhanh khi bôi đen (không cần mở editor) ----------

  const bubble = root.querySelector<HTMLElement>("[data-bubble]")!;
  let bubbleFrame = 0;

  function updateBubble(): void {
    const range = !rawMode ? editor?.selectionRange() : null;
    if (!range) {
      bubble.hidden = true;
      return;
    }
    bubble.hidden = false;
    const rect = range.getBoundingClientRect();
    const headerBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    let top = rect.top - bubble.offsetHeight - 8;
    if (top < headerBottom + 8) top = rect.bottom + 8; // không đủ chỗ phía trên → hiện bên dưới
    const left = Math.min(Math.max(8, rect.left + rect.width / 2 - bubble.offsetWidth / 2), window.innerWidth - bubble.offsetWidth - 8);
    bubble.style.top = `${top}px`;
    bubble.style.left = `${left}px`;
  }

  function scheduleBubble(): void {
    cancelAnimationFrame(bubbleFrame);
    bubbleFrame = requestAnimationFrame(updateBubble);
  }
  document.addEventListener("selectionchange", scheduleBubble);
  window.addEventListener("scroll", scheduleBubble, { passive: true });
  window.addEventListener("resize", scheduleBubble);

  // Giữ nguyên vùng bôi đen khi bấm nút trên thanh nổi.
  bubble.addEventListener("mousedown", (e) => e.preventDefault());
  bubble.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-quick]");
    if (btn) applyFormat(btn.dataset.quick!);
  });

  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Chọn nhiều: đang ở chế độ chọn, hoặc Ctrl/Cmd/Shift + click một trang trong danh sách.
    const item = target.closest<HTMLAnchorElement>(".np-item");
    if (item && (selecting || e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault();
      togglePick(item.dataset.id!, e.shiftKey);
      return;
    }
    const groupToggle = target.closest<HTMLElement>("[data-toggle-group]");
    if (groupToggle) {
      const key = groupToggle.dataset.toggleGroup!;
      if (collapsed.has(key)) collapsed.delete(key);
      else collapsed.add(key);
      storageSet(COLLAPSED_KEY, [...collapsed].join(","));
      renderList();
      return;
    }
    if (target.closest("[data-select-mode]")) {
      setSelecting(true);
      return;
    }
    const bulk = target.closest<HTMLElement>("[data-bulk]")?.dataset.bulk;
    if (bulk === "exit") setSelecting(false);
    if (bulk === "delete") void bulkDelete();
    if (bulk === "pin") void bulkPin();
    if (bulk) return;

    if (target.closest("[data-new]")) {
      void createPage();
      return;
    }
    if (target.closest("[data-back]")) {
      history.pushState(null, "", location.pathname + location.search);
      select(null);
      return;
    }

    const act = target.closest<HTMLElement>("[data-act]")?.dataset.act;
    if (act && selectedId) {
      const id = selectedId;
      if (act === "markdown") {
        rawMode = !rawMode;
        storageSet(RAW_KEY, rawMode ? "1" : "0");
        applyMode();
        scheduleBubble();
      } else if (act === "pin") {
        queueSave({ pinned: !notes[id].pinned }, true);
        syncPageMeta();
        renderList();
      } else if (act === "duplicate") {
        void createPage(notes[id]);
      } else if (act === "delete") {
        void deletePage(id);
      } else if (act === "link") {
        void navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${id}`).then(() => {
          setSaveStatus("Link copied");
          window.setTimeout(() => setSaveStatus(""), 1500);
        });
      }
      return;
    }

    const emojiPanel = page("[data-emoji]");
    if (emojiPanel) {
      if (target.closest("[data-icon-btn]")) {
        emojiPanel.hidden = !emojiPanel.hidden;
        return;
      }
      const pick = target.closest<HTMLElement>("[data-emoji-pick]");
      if (pick) {
        emojiPanel.hidden = true;
        queueSave({ icon: pick.dataset.emojiPick! }, true);
        syncPageMeta();
        renderList();
        return;
      }
      if (!target.closest("[data-emoji]")) emojiPanel.hidden = true;
    }

    const fmt = target.closest<HTMLElement>("[data-fmt]");
    if (fmt) applyFormat(fmt.dataset.fmt!);
  });

  // Giữ focus trong editor khi bấm nút định dạng.
  root.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).closest("[data-fmt]")) e.preventDefault();
  });

  root.addEventListener("input", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches("[data-title]")) {
      const title = target as HTMLTextAreaElement;
      if (title.value.includes("\n")) title.value = title.value.replace(/\n/g, " ");
      autoGrow(title);
      queueSave({ title: title.value });
      syncPageMeta();
      renderList();
    } else if (target.matches("[data-editor]")) {
      const textarea = target as HTMLTextAreaElement;
      const scrollY = window.scrollY;
      autoGrow(textarea);
      window.scrollTo({ top: scrollY });
      localContent = textarea.value;
      queueSave({ content: localContent });
    } else if (target.matches("[data-search]")) {
      renderList();
    } else if (target.matches("[data-author]")) {
      storageSet(AUTHOR_KEY, authorEl.value.trim());
    }
  });

  root.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    const mod = e.ctrlKey || e.metaKey;

    if (target.matches("[data-title]") && e.key === "Enter") {
      e.preventDefault();
      if (rawMode) page<HTMLTextAreaElement>("[data-editor]")?.focus();
      else editor?.focusStart();
      return;
    }
    if (!target.matches("[data-editor]")) return;

    const textarea = target as HTMLTextAreaElement;
    if (e.key === "Escape") {
      e.preventDefault();
      textarea.blur();
    } else if (e.key === "Tab") {
      e.preventDefault();
      indentLines(textarea, e.shiftKey);
    } else if (e.key === "Enter" && !e.shiftKey && !mod && !e.isComposing) {
      if (continueList(textarea)) e.preventDefault();
    } else if (mod && !e.altKey) {
      const command = ({ b: "bold", i: "italic", k: "link", e: "code" } as Record<string, string>)[e.key.toLowerCase()];
      if (command) {
        e.preventDefault();
        applyFormat(command);
      }
    }
  });

  root.addEventListener("focusout", (e) => {
    const target = e.target as HTMLElement;
    // Rời ô tiêu đề / ô soạn → lưu ngay phần còn chờ.
    if (target.matches("[data-title], [data-editor], [data-wysiwyg]")) {
      const next = (e as FocusEvent).relatedTarget as HTMLElement | null;
      if (!next?.closest("[data-toolbar]")) void flush();
    }
  });

  root.querySelector<HTMLInputElement>("[data-select-all]")!.addEventListener("change", (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    visibleIds.forEach((id) => (checked ? picked.add(id) : picked.delete(id)));
    renderList();
  });

  // Esc thoát chế độ chọn (trừ khi đang gõ trong ô nhập).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !selecting) return;
    if ((e.target as HTMLElement).closest("input, textarea, select")) return;
    setSelecting(false);
  });

  sortEl.addEventListener("change", () => {
    storageSet(SORT_KEY, sortEl.value);
    renderList();
  });

  // Bấm link trong sidebar bắn cả popstate lẫn hashchange — chỉ xử lý một lần.
  const route = () => {
    const id = location.hash.slice(1) || null;
    if (id !== selectedId) select(id);
  };
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  // Rời trang / chuyển tab → lưu ngay phần còn chờ.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });

  // Cập nhật "Edited 5 minutes ago" theo thời gian.
  window.setInterval(() => {
    renderList();
    syncPageMeta();
  }, 60_000);

  // ---------- Realtime ----------

  subscribe<Record<string, Note>>(NODE, {
    onValue(value) {
      const first = !loaded;
      notes = {};
      for (const [id, note] of Object.entries(value ?? {})) if (note && typeof note === "object") notes[id] = note;
      loaded = true;
      // Giữ thay đổi chưa kịp lưu để bản cũ trên server không đè lên giao diện.
      if (pending && notes[pending.id]) notes[pending.id] = { ...notes[pending.id], ...pending.fields };

      if (first) {
        const fromHash = location.hash.slice(1);
        const initial = notes[fromHash] ? fromHash : mobile.matches ? null : (sortedIds()[0] ?? null);
        if (initial !== (fromHash || null)) history.replaceState(null, "", initial ? `#${initial}` : location.pathname + location.search);
        select(initial);
        return;
      }
      renderList();
      applyRemoteToPage();
    },
    onStatus(status) {
      statusEl.dataset.syncStatus = status;
      statusEl.textContent = STATUS_TEXT[status];
      if (status === "denied" && !loaded) listEl.innerHTML = <p class="np-list__empty">No access to notes. Check the Firebase rules.</p>;
    },
  });

  renderList();
  renderMain();
}
