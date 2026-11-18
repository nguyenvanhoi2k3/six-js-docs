/**
 * Editor WYSIWYG (kiểu Notion) cho Notes: gõ và định dạng trực tiếp trên trang, không thấy ký hiệu
 * markdown. Nội dung vẫn lưu dạng markdown: render markdown → các block contenteditable, mỗi lần
 * sửa thì đọc ngược DOM → markdown (serialize).
 *
 * Mỗi block là con trực tiếp của vùng soạn, có data-type: p | h1 | h2 | h3 | bullet | numbered |
 * todo | quote | code | hr (list có thêm data-indent, todo có data-checked).
 * Gõ tắt như Notion: "# " heading, "- " list, "1. " list số, "[] " to-do, "> " trích dẫn,
 * "```" + Enter khối code, "---" + Enter đường kẻ.
 */
import Prism from "prismjs";
import { CODE_LANGS, escapeHtml, renderInline } from "./markdown";
import { copyOriginal, displayUrl, downloadOriginal, uploadImage } from "../../lib/cloudinary";

export type BlockType = "p" | "h1" | "h2" | "h3" | "bullet" | "numbered" | "todo" | "quote" | "code" | "hr" | "image" | "gallery";
export type InlineCommand = "bold" | "italic" | "strike" | "code" | "link";

const TAG: Record<BlockType, string> = {
  p: "p",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  bullet: "div",
  numbered: "div",
  todo: "div",
  quote: "blockquote",
  code: "pre",
  hr: "hr",
  image: "figure",
  gallery: "div",
};

/**
 * Ảnh trong markdown (giống Notion):
 * - `![alt](url)` hoặc `![alt](url "62%")` trên 1 dòng: 1 ảnh, rộng 62% trang, canh giữa (kéo mép ảnh để đổi).
 * - Nhiều ảnh trên cùng 1 dòng `![](a) ![](b)`: 1 hàng ảnh nằm cạnh nhau, chia đều (kéo ảnh sang mép
 *   ảnh khác để tạo hàng — như cột của Notion).
 */
const IMAGE_TOKEN = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]*)")?\)/g;
const IMAGE_ONLY_LINE = /^(?:!\[[^\]]*\]\(https?:\/\/[^\s)]+(?:\s+"[^"]*")?\)\s*)+$/;
/** Kích thước kiểu cũ (bản trước) → % chiều rộng. */
const LEGACY_WIDTH: Record<string, number> = { small: 33, medium: 50, large: 75, full: 100 };
const MIN_IMAGE_WIDTH = 15;
/** Tối đa số ảnh trong 1 hàng. */
const MAX_ROW = 4;

function parseWidth(title: string | undefined): number {
  if (!title) return 100;
  if (title in LEGACY_WIDTH) return LEGACY_WIDTH[title];
  const value = parseFloat(title);
  return Number.isFinite(value) ? Math.min(100, Math.max(MIN_IMAGE_WIDTH, Math.round(value))) : 100;
}

const escapeAttr = (text: string) => escapeHtml(text).replace(/"/g, "&quot;");

/** Icon nét mảnh (stroke 1.5) cho các nút trên ảnh. */
const svg = (paths: string) =>
  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const IMG_ICON = {
  copy: svg('<rect x="7" y="7" width="9.5" height="9.5" rx="2"/><path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v6a1.5 1.5 0 0 0 1.5 1.5H7"/>'),
  download: svg('<path d="M10 3.5v9M6.25 9 10 12.75 13.75 9M4 15.75h12"/>'),
  remove: svg('<path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/>'),
  drag: svg('<circle cx="7.5" cy="5" r=".9" fill="currentColor"/><circle cx="12.5" cy="5" r=".9" fill="currentColor"/><circle cx="7.5" cy="10" r=".9" fill="currentColor"/><circle cx="12.5" cy="10" r=".9" fill="currentColor"/><circle cx="7.5" cy="15" r=".9" fill="currentColor"/><circle cx="12.5" cy="15" r=".9" fill="currentColor"/>'),
  done: svg('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
  failed: svg('<path d="M10 6v4.5M10 13.75v.01"/><circle cx="10" cy="10" r="7"/>'),
  busy: svg('<path d="M10 3a7 7 0 1 1-7 7" class="np-img__spin"/>'),
};

/** Khối ảnh: ảnh + tay cầm kéo đổi kích thước (2 mép) + nút kéo / Copy / Download / xóa. */
function imageHtml(src: string, alt: string, opts: { uploading?: boolean; width?: number } = {}): string {
  const { uploading = false, width = 100 } = opts;
  return (
    `<figure data-type="image" data-src="${uploading ? "" : escapeAttr(src)}" data-alt="${escapeAttr(alt)}" data-width="${width}" style="--np-img-w:${width}%"${uploading ? " data-uploading" : ""} contenteditable="false" draggable="true" class="np-img">` +
    // Hiển thị bản đã tối ưu cho nhẹ; Copy / Download / mở ảnh gốc đều lấy ảnh gốc 100%.
    `<img src="${escapeAttr(uploading ? src : displayUrl(src))}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async" draggable="false" title="View image" />` +
    `<span class="np-img__handle np-img__handle--left" data-img-resize="left" title="Drag to resize"></span>` +
    `<span class="np-img__handle np-img__handle--right" data-img-resize="right" title="Drag to resize"></span>` +
    `<span class="np-img__actions">` +
    `<span class="np-img__grip" title="Drag to move — drop on the side of another image to place them side by side">${IMG_ICON.drag}</span>` +
    `<span class="np-img__divider" aria-hidden="true"></span>` +
    `<button type="button" data-img-action="copy" title="Copy original image" aria-label="Copy original image">${IMG_ICON.copy}</button>` +
    `<button type="button" data-img-action="download" title="Download original image" aria-label="Download original image">${IMG_ICON.download}</button>` +
    `<span class="np-img__divider" aria-hidden="true"></span>` +
    `<button type="button" data-img-action="remove" class="np-img__remove" title="Remove image" aria-label="Remove image">${IMG_ICON.remove}</button>` +
    `</span>` +
    (uploading ? `<span class="np-img__progress" data-img-progress>Uploading…</span>` : "") +
    `</figure>`
  );
}

/** 1 dòng chỉ chứa ảnh → 1 ảnh, hoặc 1 hàng ảnh nếu có nhiều ảnh. */
function imageLineHtml(line: string): string {
  const images = Array.from(line.matchAll(IMAGE_TOKEN));
  if (images.length === 1) return imageHtml(images[0][2], images[0][1], { width: parseWidth(images[0][3]) });
  return `<div data-type="gallery" class="np-gallery" contenteditable="false">${images.map((m) => imageHtml(m[2], m[1])).join("")}</div>`;
}

/** Kiểu block được thụt lề / nối tiếp khi Enter. */
const LIST_TYPES = new Set<BlockType>(["bullet", "numbered", "todo"]);
const MAX_INDENT = 6;

// ---------- Markdown → HTML các block ----------

function highlight(code: string, lang: string): string {
  const grammarName = lang in CODE_LANGS ? CODE_LANGS[lang] : lang || "javascript";
  const grammar = grammarName ? Prism.languages[grammarName] : undefined;
  return grammar ? Prism.highlight(code, grammar, grammarName) : escapeHtml(code);
}

function blockHtml(type: BlockType, inner: string, opts: { indent?: number; checked?: boolean; lang?: string } = {}): string {
  const indent = opts.indent ?? 0;
  const indentAttrs = indent ? ` data-indent="${indent}" style="--indent:${indent}"` : "";
  if (type === "hr") return `<hr data-type="hr" contenteditable="false" />`;
  if (type === "code") {
    const lang = opts.lang ?? "";
    // "\n" cuối để dòng trống cuối cùng vẫn đặt được con trỏ.
    return `<pre data-type="code" data-lang="${escapeHtml(lang)}" class="code-block" spellcheck="false"><code>${inner}\n</code></pre>`;
  }
  const checked = type === "todo" ? ` data-checked="${opts.checked ? "true" : "false"}"` : "";
  return `<${TAG[type]} data-type="${type}"${indentAttrs}${checked}>${inner || "<br>"}</${TAG[type]}>`;
}

export function renderBlocks(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let out = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const text = line.trim();

    if (text.startsWith("![") && IMAGE_ONLY_LINE.test(text)) {
      out += imageLineHtml(text);
      continue;
    }

    if (text.startsWith("```")) {
      const lang = text.slice(3).trim().toLowerCase();
      const code: string[] = [];
      while (++i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i]);
      out += blockHtml("code", highlight(code.join("\n"), lang), { lang });
      continue;
    }

    const indent = Math.min(Math.floor(line.match(/^\s*/)![0].replace(/\t/g, "  ").length / 2), MAX_INDENT);
    let m: RegExpMatchArray | null;
    if (!text) out += blockHtml("p", "");
    else if ((m = text.match(/^(#{1,3})\s+(.*)$/))) out += blockHtml(`h${m[1].length}` as BlockType, renderInline(m[2]));
    else if (/^(-{3,}|\*{3,}|_{3,})$/.test(text)) out += blockHtml("hr", "");
    else if ((m = text.match(/^[-*+]\s+\[( |x|X)\]\s?(.*)$/))) out += blockHtml("todo", renderInline(m[2]), { indent, checked: m[1] !== " " });
    else if ((m = text.match(/^[-*+]\s+(.*)$/))) out += blockHtml("bullet", renderInline(m[1]), { indent });
    else if ((m = text.match(/^\d+[.)]\s+(.*)$/))) out += blockHtml("numbered", renderInline(m[1]), { indent });
    else if ((m = text.match(/^>\s?(.*)$/))) out += blockHtml("quote", renderInline(m[1]));
    else out += blockHtml("p", renderInline(text), { indent });
  }
  return out || blockHtml("p", "");
}

// ---------- DOM → markdown ----------

function wrapInline(inner: string, mark: string): string {
  if (!inner.trim()) return inner;
  // Khoảng trắng ở hai đầu phải nằm ngoài ký hiệu: "** chữ**" không phải markdown hợp lệ.
  const [, lead, core, trail] = inner.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return `${lead}${mark}${core}${mark}${trail}`;
}

function inlineMarkdown(node: Node): string {
  let out = "";
  node.childNodes.forEach((child, index) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += (child.textContent ?? "").replace(/ /g, " ");
      return;
    }
    if (!(child instanceof HTMLElement)) return;
    const tag = child.tagName;
    if (tag === "BR") {
      // <br> cuối block chỉ để giữ chiều cao dòng trống.
      if (index < node.childNodes.length - 1) out += "\n";
      return;
    }
    if (tag === "INPUT") return;
    if (tag === "CODE") {
      const text = child.textContent ?? "";
      out += text ? `\`${text}\`` : "";
      return;
    }
    const inner = inlineMarkdown(child);
    const weight = child.style.fontWeight;
    if (tag === "B" || tag === "STRONG" || weight === "bold" || Number(weight) >= 600) out += wrapInline(inner, "**");
    else if (tag === "I" || tag === "EM" || child.style.fontStyle === "italic") out += wrapInline(inner, "*");
    else if (tag === "S" || tag === "STRIKE" || tag === "DEL") out += wrapInline(inner, "~~");
    else if (tag === "A") {
      const href = child.getAttribute("href") ?? "";
      out += /^https?:\/\//.test(href) && inner.trim() ? (inner === href ? href : `[${inner}](${href})`) : inner;
    } else out += inner;
  });
  return out;
}

function typeOf(el: Element): BlockType {
  const type = (el as HTMLElement).dataset?.type as BlockType | undefined;
  if (type && type in TAG) return type;
  // Phần tử trình duyệt tự tạo khi gõ/dán.
  const tag = el.tagName;
  if (tag === "H1" || tag === "H2" || tag === "H3") return tag.toLowerCase() as BlockType;
  if (tag === "BLOCKQUOTE") return "quote";
  if (tag === "PRE") return "code";
  if (tag === "HR") return "hr";
  if (tag === "FIGURE") return "image";
  if (tag === "LI") return "bullet";
  return "p";
}

function indentOf(el: Element): number {
  return Math.min(Number((el as HTMLElement).dataset?.indent) || 0, MAX_INDENT);
}

/** Ảnh cũ chỉ được dùng lại khi cùng URL + độ rộng + alt (khác thì phải vẽ theo dữ liệu mới). */
function figureKey(figure: HTMLElement): string {
  return `${figure.dataset.src ?? ""}|${figure.dataset.width ?? ""}|${figure.dataset.alt ?? ""}`;
}

/** `![alt](url "62%")` — ảnh đang upload (chưa có URL thật) thì bỏ qua. Ảnh trong hàng không lưu độ rộng. */
function imageMarkdown(figure: HTMLElement, withWidth: boolean): string {
  if (figure.hasAttribute("data-uploading") || !figure.dataset.src) return "";
  const alt = (figure.dataset.alt ?? "").replace(/[[\]\n]/g, " ").trim();
  const width = Number(figure.dataset.width) || 100;
  return `![${alt}](${figure.dataset.src}${withWidth && width < 100 ? ` "${width}%"` : ""})`;
}

export function serialize(root: HTMLElement): string {
  const lines: string[] = [];
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? "").replace(/ /g, " ");
      if (text.trim()) lines.push(text);
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    const type = typeOf(node);
    const pad = "  ".repeat(indentOf(node));

    if (type === "hr") return void lines.push("---");
    if (type === "image") {
      const image = imageMarkdown(node, true);
      if (image) lines.push(image);
      return;
    }
    if (type === "gallery") {
      const images = Array.from(node.querySelectorAll<HTMLElement>("figure[data-type='image']"))
        .map((figure) => imageMarkdown(figure, false))
        .filter(Boolean);
      if (images.length) lines.push(images.join(" "));
      return;
    }
    if (type === "code") {
      const code = (node.textContent ?? "").replace(/\n$/, "");
      return void lines.push(`\`\`\`${node.dataset.lang ?? ""}`, code, "```");
    }

    const text = inlineMarkdown(node);
    const parts = text.split("\n");
    switch (type) {
      case "h1":
      case "h2":
      case "h3":
        lines.push(`${"#".repeat(Number(type[1]))} ${parts.join(" ").trim()}`);
        break;
      case "bullet":
        lines.push(`${pad}- ${parts.join(" ")}`);
        break;
      case "numbered":
        lines.push(`${pad}${node.dataset.number ?? "1"}. ${parts.join(" ")}`);
        break;
      case "todo":
        lines.push(`${pad}- [${node.dataset.checked === "true" ? "x" : " "}] ${parts.join(" ")}`);
        break;
      case "quote":
        parts.forEach((part) => lines.push(`> ${part}`));
        break;
      default:
        parts.forEach((part) => lines.push(part ? pad + part : ""));
    }
  });
  // Bỏ các dòng trống thừa ở cuối.
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines.join("\n");
}

// ---------- Editor ----------

export interface WysiwygEditor {
  /** Render lại từ markdown (dùng khi nội dung đổi từ bên ngoài). */
  load(markdown: string): void;
  inline(command: InlineCommand): void;
  block(type: BlockType): void;
  focusStart(): void;
  /** Mở hộp chọn file ảnh rồi upload, chèn tại vị trí con trỏ. */
  pickImages(): void;
  /** Vùng chọn (không rỗng) trong editor, ngoài khối code — để hiện thanh định dạng nổi. */
  selectionRange(): Range | null;
}

/** Thanh nhỏ ở góc dưới trái hiện địa chỉ link đang rê chuột (dùng chung cho mọi editor trên trang). */
function linkStatusBar(): { show(url: string): void; hide(): void } {
  let bar = document.querySelector<HTMLElement>(".np-link-status");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "np-link-status";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = `<span class="np-link-status__url"></span><span class="np-link-status__hint">${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} + click to open</span>`;
    document.body.appendChild(bar);
  }
  const el = bar;
  return {
    show(url) {
      el.querySelector(".np-link-status__url")!.textContent = url;
      el.classList.add("is-visible");
    },
    hide() {
      el.classList.remove("is-visible");
    },
  };
}

export interface WysiwygOptions {
  /** Bấm vào ảnh: danh sách URL ảnh gốc trong trang + vị trí ảnh vừa bấm (để mở trình xem ảnh). */
  onOpenImage?(urls: string[], index: number): void;
}

export function createWysiwyg(root: HTMLElement, onChange: (markdown: string) => void, options: WysiwygOptions = {}): WysiwygEditor {
  document.execCommand("styleWithCSS", false, "false");

  const selection = () => window.getSelection();

  function blockOf(node: Node | null): HTMLElement | null {
    let current: Node | null = node;
    while (current && current.parentNode !== root) current = current.parentNode;
    return current instanceof HTMLElement ? current : null;
  }

  function currentBlock(): HTMLElement | null {
    const sel = selection();
    return sel?.rangeCount ? blockOf(sel.anchorNode) : null;
  }

  function selectedBlocks(): HTMLElement[] {
    const sel = selection();
    if (!sel?.rangeCount) return [];
    const range = sel.getRangeAt(0);
    const first = blockOf(range.startContainer);
    const last = blockOf(range.endContainer);
    if (!first || !last) return [];
    const blocks: HTMLElement[] = [];
    for (let el: Element | null = first; el; el = el.nextElementSibling) {
      blocks.push(el as HTMLElement);
      if (el === last) break;
    }
    return blocks;
  }

  function placeCaret(node: Node, atEnd: boolean): void {
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(!atEnd);
    const sel = selection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function caretAtStart(block: HTMLElement): boolean {
    const sel = selection();
    if (!sel?.rangeCount || !sel.isCollapsed) return false;
    const range = document.createRange();
    range.setStart(block, 0);
    range.setEnd(sel.anchorNode!, sel.anchorOffset);
    return range.toString() === "";
  }

  function isEmpty(block: HTMLElement): boolean {
    return !(block.textContent ?? "").replace(/ /g, " ").trim() && !block.querySelector("img");
  }

  function ensureFiller(block: HTMLElement): void {
    if (block.dataset.type === "hr" || block.dataset.type === "code" || block.dataset.type === "image") return;
    if (!block.textContent && !block.querySelector("br")) block.appendChild(document.createElement("br"));
  }

  /** Block rỗng (chưa có <br> giữ dòng — gọi ensureFiller nếu cần). */
  function createBlock(type: BlockType, opts: { indent?: number; checked?: boolean; lang?: string } = {}): HTMLElement {
    const holder = document.createElement("div");
    holder.innerHTML = blockHtml(type, "", opts);
    const block = holder.firstElementChild as HTMLElement;
    if (type !== "code" && type !== "hr") block.innerHTML = "";
    return block;
  }

  function setIndent(block: HTMLElement, indent: number): void {
    const value = Math.max(0, Math.min(MAX_INDENT, indent));
    if (value) {
      block.dataset.indent = String(value);
      block.style.setProperty("--indent", String(value));
    } else {
      delete block.dataset.indent;
      block.style.removeProperty("--indent");
    }
  }

  /** Đổi kiểu block, giữ nguyên nội dung. Trả về block mới. */
  function setType(block: HTMLElement, type: BlockType): HTMLElement {
    const from = typeOf(block);
    if (from === type) return block;
    if (type === "code") {
      const next = createBlock("code");
      next.querySelector("code")!.textContent = `${block.textContent ?? ""}\n`;
      block.replaceWith(next);
      return next;
    }
    const next = createBlock(type, { indent: LIST_TYPES.has(type) || type === "p" ? indentOf(block) : 0 });
    if (from === "code") {
      next.textContent = (block.textContent ?? "").replace(/\n$/, "");
    } else {
      while (block.firstChild) next.appendChild(block.firstChild);
    }
    ensureFiller(next);
    block.replaceWith(next);
    return next;
  }

  /** Đánh số lại list số (theo từng mức thụt lề) và đảm bảo luôn có ít nhất 1 block. */
  function normalize(): void {
    if (!root.firstElementChild) root.innerHTML = blockHtml("p", "");
    // Block cuối là ảnh / đường kẻ / code → thêm 1 đoạn trống phía sau để còn chỗ bấm vào gõ tiếp.
    const last = root.lastElementChild as HTMLElement;
    if (["image", "gallery", "hr", "code"].includes(typeOf(last))) root.insertAdjacentHTML("beforeend", blockHtml("p", ""));
    const counters: number[] = [];
    for (const el of Array.from(root.children) as HTMLElement[]) {
      const type = typeOf(el);
      const indent = indentOf(el);
      if (type === "numbered") {
        counters.length = indent + 1;
        counters[indent] = (counters[indent] ?? 0) + 1;
        el.dataset.number = String(counters[indent]);
      } else if (LIST_TYPES.has(type)) {
        counters.length = indent;
      } else {
        counters.length = 0;
      }
    }
    root.classList.toggle("is-empty", root.children.length === 1 && isEmpty(root.firstElementChild as HTMLElement));
  }

  function commit(): void {
    normalize();
    onChange(serialize(root));
  }

  /** Tách block tại con trỏ: phần sau con trỏ chuyển sang block mới kiểu `type`. */
  function splitBlock(block: HTMLElement, type: BlockType): HTMLElement {
    const sel = selection()!;
    const range = sel.getRangeAt(0);
    if (!range.collapsed) range.deleteContents();
    const tail = document.createRange();
    tail.setStart(range.endContainer, range.endOffset);
    tail.setEnd(block, block.childNodes.length);
    const fragment = tail.extractContents();

    const next = createBlock(type, {
      indent: LIST_TYPES.has(type) || type === "p" ? indentOf(block) : 0,
      checked: false,
    });
    next.appendChild(fragment);
    // Bỏ phần tử rỗng còn sót lại sau khi cắt (vd. <strong></strong>).
    next.querySelectorAll("strong, em, b, i, s, del, code, a").forEach((el) => {
      if (!el.textContent) el.remove();
    });
    if (!next.textContent) next.innerHTML = "";
    ensureFiller(block);
    ensureFiller(next);
    block.after(next);
    placeCaret(next, false);
    return next;
  }

  // ---------- Gõ tắt kiểu Notion ----------

  const SHORTCUTS: [RegExp, (m: RegExpMatchArray) => { type: BlockType; checked?: boolean }][] = [
    [/^(#{1,3})$/, (m) => ({ type: `h${m[1].length}` as BlockType })],
    [/^[-*+]$/, () => ({ type: "bullet" })],
    [/^\d+[.)]$/, () => ({ type: "numbered" })],
    [/^\[( |x|X)?\]$/, (m) => ({ type: "todo", checked: !!m[1] && m[1] !== " " })],
    [/^>$/, () => ({ type: "quote" })],
  ];

  function applyShortcut(): boolean {
    const block = currentBlock();
    const sel = selection();
    if (!block || !sel?.rangeCount) return false;
    const type = typeOf(block);
    if (type !== "p" && type !== "bullet") return false;

    const before = document.createRange();
    before.setStart(block, 0);
    before.setEnd(sel.anchorNode!, sel.anchorOffset);
    const typed = before.toString().replace(/ /g, " ");
    if (!typed.endsWith(" ")) return false;
    const marker = typed.slice(0, -1);

    for (const [pattern, result] of SHORTCUTS) {
      const m = marker.match(pattern);
      if (!m) continue;
      const { type: next, checked } = result(m);
      if (type === "bullet" && next !== "todo") return false;
      before.deleteContents();
      const converted = setType(block, next);
      if (next === "todo") converted.dataset.checked = checked ? "true" : "false";
      ensureFiller(converted);
      placeCaret(converted, false);
      return true;
    }
    return false;
  }

  // ---------- Sự kiện ----------

  root.addEventListener("input", (e) => {
    if ((e as InputEvent).inputType === "insertText" && (e as InputEvent).data === " ") applyShortcut();
    commit();
  });

  root.addEventListener("keydown", (e) => {
    const block = currentBlock();
    if (!block || e.isComposing) return;
    const type = typeOf(block);
    const mod = e.ctrlKey || e.metaKey;


    if (mod && !e.altKey) {
      const command = ({ b: "bold", i: "italic", e: "code", k: "link" } as Record<string, InlineCommand>)[e.key.toLowerCase()];
      if (command && type !== "code") {
        e.preventDefault();
        editor.inline(command);
      }
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (type === "code") {
        const text = block.textContent ?? "";
        // Enter trên dòng trống cuối khối code → thoát ra đoạn văn mới.
        if (text.endsWith("\n\n") && caretAtEndOf(block)) {
          block.querySelector("code")!.textContent = text.replace(/\n\n$/, "\n");
          const next = createBlock("p");
          ensureFiller(next);
          block.after(next);
          placeCaret(next, false);
        } else {
          document.execCommand("insertText", false, "\n");
        }
        return commit();
      }
      const text = (block.textContent ?? "").trim();
      const fence = type === "p" ? text.match(/^```(\w*)$/) : null;
      if (fence) {
        const code = createBlock("code", { lang: fence[1].toLowerCase() });
        block.replaceWith(code);
        placeCaret(code.querySelector("code")!.firstChild ?? code.querySelector("code")!, false);
        return commit();
      }
      if (type === "p" && /^(-{3,}|\*{3,})$/.test(text)) {
        const hr = createBlock("hr");
        const next = createBlock("p");
        ensureFiller(next);
        block.replaceWith(hr);
        hr.after(next);
        placeCaret(next, false);
        return commit();
      }
      // Enter ở mục list rỗng → thoát list (giống Notion).
      if (LIST_TYPES.has(type) && isEmpty(block)) {
        if (indentOf(block) > 0) setIndent(block, indentOf(block) - 1);
        else placeCaret(setType(block, "p"), false);
        return commit();
      }
      splitBlock(block, LIST_TYPES.has(type) ? type : "p");
      return commit();
    }

    if (e.key === "Backspace" && caretAtStart(block)) {
      if (type !== "p" && type !== "code") {
        e.preventDefault();
        if (LIST_TYPES.has(type) && indentOf(block) > 0) setIndent(block, indentOf(block) - 1);
        else placeCaret(setType(block, "p"), false);
        return commit();
      }
      if (type === "code" && isEmpty(block)) {
        e.preventDefault();
        placeCaret(setType(block, "p"), false);
        return commit();
      }
      const prev = block.previousElementSibling as HTMLElement | null;
      if (type === "p" && prev) {
        e.preventDefault();
        if (typeOf(prev) === "hr") {
          prev.remove();
          return commit();
        }
        if (typeOf(prev) === "image" || typeOf(prev) === "gallery") {
          // Không gộp chữ vào ảnh. Đoạn trống thì bỏ đi (nếu phía sau còn chỗ để gõ).
          const next = block.nextElementSibling;
          if (isEmpty(block) && next) {
            block.remove();
            placeCaret(next, false);
          }
          return commit();
        }
        if (typeOf(prev) === "code") {
          placeCaret(prev.querySelector("code") ?? prev, true);
          if (isEmpty(block)) block.remove();
          return commit();
        }
        // Gộp vào block phía trên, con trỏ đặt ở chỗ nối.
        prev.querySelectorAll(":scope > br:last-child").forEach((br) => br.remove());
        const marker = document.createTextNode("");
        prev.appendChild(marker);
        block.querySelectorAll(":scope > br:last-child").forEach((br) => br.remove());
        while (block.firstChild) prev.appendChild(block.firstChild);
        block.remove();
        ensureFiller(prev);
        const range = document.createRange();
        range.setStart(marker, 0);
        range.collapse(true);
        selection()?.removeAllRanges();
        selection()?.addRange(range);
        return commit();
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (type === "code") {
        if (!e.shiftKey) document.execCommand("insertText", false, "  ");
        return;
      }
      if (type === "p" || LIST_TYPES.has(type)) {
        selectedBlocks().forEach((el) => {
          const t = typeOf(el);
          if (t === "p" || LIST_TYPES.has(t)) setIndent(el, indentOf(el) + (e.shiftKey ? -1 : 1));
        });
        commit();
      }
    }
  });

  function caretAtEndOf(block: HTMLElement): boolean {
    const sel = selection();
    if (!sel?.rangeCount) return false;
    const range = document.createRange();
    range.setStart(sel.anchorNode!, sel.anchorOffset);
    range.setEnd(block, block.childNodes.length);
    return range.toString().replace(/\n$/, "") === "";
  }

  // ---------- Ảnh ----------

  /** Chèn khối ảnh sau block đang có con trỏ (block đó là đoạn trống thì thay luôn). */
  function insertFigure(figure: HTMLElement): void {
    const block = currentBlock();
    if (block && typeOf(block) === "p" && isEmpty(block)) block.replaceWith(figure);
    else if (block) block.after(figure);
    else root.appendChild(figure);
    // Luôn có 1 đoạn sau ảnh để gõ tiếp.
    if (!figure.nextElementSibling) {
      const next = createBlock("p");
      ensureFiller(next);
      figure.after(next);
    }
    placeCaret(figure.nextElementSibling!, false);
  }

  function insertImageUrl(url: string, alt = ""): void {
    const holder = document.createElement("div");
    holder.innerHTML = imageHtml(url, alt);
    insertFigure(holder.firstElementChild as HTMLElement);
    commit();
  }

  /** Upload các file ảnh lên Cloudinary; hiện ảnh xem trước + tiến độ trong lúc chờ. */
  function insertImageFiles(files: File[]): void {
    for (const file of files.filter((f) => f.type.startsWith("image/"))) {
      const preview = URL.createObjectURL(file);
      const holder = document.createElement("div");
      holder.innerHTML = imageHtml(preview, "", { uploading: true });
      const figure = holder.firstElementChild as HTMLElement;
      insertFigure(figure);
      const progress = figure.querySelector<HTMLElement>("[data-img-progress]")!;

      uploadImage(file, (ratio) => (progress.textContent = `Uploading ${Math.round(ratio * 100)}%`))
        .then(({ url }) => {
          if (!figure.isConnected) return; // bị xóa trong lúc đang upload
          figure.dataset.src = url;
          figure.removeAttribute("data-uploading");
          progress.remove();
          const img = figure.querySelector("img")!;
          // Đổi sang ảnh trên Cloudinary khi đã tải xong để không bị nháy trắng.
          const display = displayUrl(url);
          const loader = new Image();
          loader.onload = loader.onerror = () => {
            img.src = display;
            URL.revokeObjectURL(preview);
          };
          loader.src = display;
          commit();
        })
        .catch((error: Error) => {
          figure.remove();
          URL.revokeObjectURL(preview);
          normalize();
          alert(`Couldn't upload "${file.name}": ${error.message}`);
        });
    }
    commit();
  }

  const isImageUrl = (text: string) => /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif|svg)(\?\S*)?$/i.test(text);

  // Kéo thả file ảnh từ máy vào trang.
  root.addEventListener("dragover", (e) => {
    if (dragged || !e.dataTransfer?.types.includes("Files")) return;
    e.preventDefault();
    root.classList.add("is-dragover");
  });
  root.addEventListener("dragleave", (e) => {
    if (!root.contains(e.relatedTarget as Node)) root.classList.remove("is-dragover");
  });
  root.addEventListener("drop", (e) => {
    root.classList.remove("is-dragover");
    if (dragged) return; // thả ảnh đang kéo trong trang — xử lý ở phần kéo ảnh bên dưới
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (!files.length) return;
    e.preventDefault();
    // Đặt con trỏ tại block được thả vào để ảnh chèn đúng chỗ.
    const target = blockOf(e.target as Node);
    if (target) placeCaret(target, true);
    insertImageFiles(files);
  });

  // Bấm vào vùng trống (cạnh ảnh, dưới cùng trang) → đặt con trỏ vào đoạn văn gần nhất để gõ tiếp.
  const TEXT_TYPES = new Set<BlockType>(["p", "h1", "h2", "h3", "bullet", "numbered", "todo", "quote"]);

  /** Đặt con trỏ vào đoạn văn ngay sau ảnh / hàng ảnh (tạo đoạn mới nếu phía sau không có chỗ gõ). */
  function focusAfter(block: HTMLElement): void {
    let next = block.nextElementSibling as HTMLElement | null;
    if (!next || !TEXT_TYPES.has(typeOf(next))) {
      next = createBlock("p");
      ensureFiller(next);
      block.after(next);
    }
    root.focus();
    placeCaret(next, false);
  }

  root.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLElement;
    // Bấm nút trên ảnh: không để vùng soạn mất focus (mất focus → render lại → ảnh nháy, nút đổi icon bị mất).
    if (target.closest("[data-img-action]")) {
      e.preventDefault();
      return;
    }
    if (target.closest("button, img, a, [data-img-resize], .np-img__grip")) return;
    const imageBlock = target.closest<HTMLElement>("figure[data-type='image'], [data-type='gallery']");
    if (imageBlock) {
      e.preventDefault();
      return focusAfter(blockOf(imageBlock) ?? imageBlock);
    }
    if (target !== root) return;
    // Bấm vào khoảng trống của vùng soạn: cạnh ảnh → gõ tiếp sau ảnh; dưới block cuối → cuối trang.
    const blocks = Array.from(root.children) as HTMLElement[];
    const hit = blocks.find((el) => {
      const rect = el.getBoundingClientRect();
      return e.clientY >= rect.top && e.clientY <= rect.bottom;
    });
    if (hit && (typeOf(hit) === "image" || typeOf(hit) === "gallery")) {
      e.preventDefault();
      focusAfter(hit);
    } else if (!hit && e.clientY > (root.lastElementChild?.getBoundingClientRect().bottom ?? 0)) {
      e.preventDefault();
      root.focus();
      placeCaret(root.lastElementChild ?? root, true);
    }
  });

  // ---------- Kéo mép ảnh để đổi kích thước (như Notion) ----------

  root.addEventListener("pointerdown", (e) => {
    const handle = (e.target as HTMLElement).closest<HTMLElement>("[data-img-resize]");
    const figure = handle?.closest<HTMLElement>("figure[data-type='image']");
    if (!handle || !figure || figure.parentElement !== root) return;
    e.preventDefault();
    const side = handle.dataset.imgResize === "left" ? -1 : 1;
    const startX = e.clientX;
    const startWidth = figure.getBoundingClientRect().width;
    const full = root.clientWidth;
    figure.classList.add("is-resizing");
    handle.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      // Ảnh canh giữa: kéo 1 mép ra x px thì ảnh rộng thêm 2x px.
      const px = startWidth + side * (ev.clientX - startX) * 2;
      const percent = Math.round(Math.min(100, Math.max(MIN_IMAGE_WIDTH, (px / full) * 100)));
      figure.dataset.width = String(percent);
      figure.style.setProperty("--np-img-w", `${percent}%`);
      figure.dataset.resizeLabel = `${percent}%`;
    };
    const end = () => {
      handle.removeEventListener("pointermove", move);
      figure.classList.remove("is-resizing");
      delete figure.dataset.resizeLabel;
      commit();
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end, { once: true });
    handle.addEventListener("pointercancel", end, { once: true });
  });

  // ---------- Kéo ảnh để di chuyển / đặt cạnh ảnh khác (như cột của Notion) ----------

  let dragged: HTMLElement | null = null;
  let drop: { target: HTMLElement; position: "left" | "right" | "before" | "after" } | null = null;
  const indicator = document.createElement("div");
  indicator.className = "np-drop-indicator";

  /** Hàng chỉ còn 1 ảnh → trả lại thành ảnh đơn; hàng trống → bỏ. */
  function tidyGalleries(): void {
    root.querySelectorAll<HTMLElement>("[data-type='gallery']").forEach((gallery) => {
      const figures = gallery.querySelectorAll("figure[data-type='image']");
      if (!figures.length) gallery.remove();
      else if (figures.length === 1) gallery.replaceWith(figures[0]);
    });
  }

  root.addEventListener("dragstart", (e) => {
    const figure = (e.target as HTMLElement).closest?.<HTMLElement>("figure[data-type='image']");
    if (!figure || figure.hasAttribute("data-uploading")) return;
    dragged = figure;
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("text/plain", ""); // Firefox cần có dữ liệu mới cho kéo
    window.setTimeout(() => figure.classList.add("is-dragging"), 0);
  });

  root.addEventListener("dragover", (e) => {
    if (!dragged) return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
    drop = null;
    const target = e.target as HTMLElement;
    const figure = target.closest<HTMLElement>("figure[data-type='image']");

    if (figure && figure !== dragged) {
      const rect = figure.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const row = figure.parentElement?.closest<HTMLElement>("[data-type='gallery']");
      const rowFull = row && row.querySelectorAll("figure").length >= MAX_ROW && dragged.parentElement !== row;
      // Mép trái / phải của ảnh → đặt cạnh nhau; giữa ảnh → đặt trên / dưới.
      if (x < 0.25 && !rowFull) drop = { target: figure, position: "left" };
      else if (x > 0.75 && !rowFull) drop = { target: figure, position: "right" };
      else {
        const block = blockOf(figure)!;
        const blockRect = block.getBoundingClientRect();
        drop = { target: block, position: e.clientY < blockRect.top + blockRect.height / 2 ? "before" : "after" };
      }
    } else if (!figure) {
      const block = blockOf(target) ?? (root.lastElementChild as HTMLElement | null);
      if (block && block !== dragged) {
        const rect = block.getBoundingClientRect();
        drop = { target: block, position: e.clientY < rect.top + rect.height / 2 ? "before" : "after" };
      }
    }

    if (!drop) return indicator.remove();
    const rect = drop.target.getBoundingClientRect();
    const vertical = drop.position === "left" || drop.position === "right";
    Object.assign(indicator.style, vertical
      ? { left: `${(drop.position === "left" ? rect.left : rect.right) - 2}px`, top: `${rect.top}px`, width: "4px", height: `${rect.height}px` }
      : { left: `${rect.left}px`, top: `${(drop.position === "before" ? rect.top : rect.bottom) - 2}px`, width: `${rect.width}px`, height: "4px" });
    if (!indicator.isConnected) document.body.appendChild(indicator);
  });

  root.addEventListener("drop", (e) => {
    if (!dragged) return;
    e.preventDefault();
    const figure = dragged;
    const target = drop;
    if (!target) return;

    if (target.position === "left" || target.position === "right") {
      // Đặt cạnh ảnh khác: ảnh đích chưa ở trong hàng thì tạo hàng mới bao quanh nó.
      let row = target.target.parentElement?.closest<HTMLElement>("[data-type='gallery']") ?? null;
      if (!row) {
        row = document.createElement("div");
        row.dataset.type = "gallery";
        row.className = "np-gallery";
        row.contentEditable = "false";
        target.target.replaceWith(row);
        row.appendChild(target.target);
      }
      if (target.position === "left") target.target.before(figure);
      else target.target.after(figure);
    } else {
      // Đặt trên / dưới 1 block → thành ảnh đơn (rộng hết trang nếu vừa tách khỏi hàng).
      if (figure.parentElement !== root) {
        figure.dataset.width = "100";
        figure.style.setProperty("--np-img-w", "100%");
      }
      if (target.position === "before") target.target.before(figure);
      else target.target.after(figure);
    }
    tidyGalleries();
    commit();
  });

  root.addEventListener("dragend", () => {
    dragged?.classList.remove("is-dragging");
    dragged = null;
    drop = null;
    indicator.remove();
  });

  // Nút trên ảnh (Copy / Download ảnh gốc, xóa) và bấm vào ảnh để mở trình xem ảnh.
  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const figure = target.closest<HTMLElement>("figure[data-type='image']");
    if (!figure) return;
    const button = target.closest<HTMLButtonElement>("[data-img-action]");
    const original = figure.dataset.src;

    if (button) {
      e.preventDefault();
      const action = button.dataset.imgAction;
      if (action === "remove") {
        figure.remove();
        tidyGalleries();
        commit();
        return;
      }
      if (!original) return; // còn đang upload
      // Đổi icon để báo trạng thái: đang xử lý → xong / lỗi → trở lại icon cũ.
      const icon = button.innerHTML;
      const title = button.title;
      const flash = (state: "done" | "failed", text: string) => {
        button.innerHTML = IMG_ICON[state];
        button.title = text;
        button.dataset.state = state;
        window.setTimeout(() => {
          button.innerHTML = icon;
          button.title = title;
          delete button.dataset.state;
        }, 2500);
      };
      button.disabled = true;
      button.innerHTML = IMG_ICON.busy;
      (action === "copy" ? copyOriginal(original) : downloadOriginal(original))
        .then(() => flash("done", action === "copy" ? "Copied" : "Downloaded"))
        .catch(() => {
          flash("failed", action === "copy" ? "Couldn't copy" : "Couldn't download");
          // Không copy/tải được (trình duyệt chặn…) → mở ảnh gốc để lưu thủ công.
          if (action === "download") window.open(original, "_blank", "noopener");
        })
        .finally(() => (button.disabled = false));
    } else if (target.tagName === "IMG" && original) {
      // Ctrl/Cmd + click → mở ảnh gốc ở tab mới; click thường → trình xem ảnh (lướt qua các ảnh trong trang).
      if (e.ctrlKey || e.metaKey || !options.onOpenImage) {
        window.open(original, "_blank", "noopener");
        return;
      }
      const figures = Array.from(root.querySelectorAll<HTMLElement>("figure[data-type='image']")).filter((f) => f.dataset.src);
      options.onOpenImage(
        figures.map((f) => f.dataset.src!),
        figures.indexOf(figure),
      );
    }
  });

  // Dán: ảnh (chụp màn hình…) → upload; link ảnh → khối ảnh; 1 dòng → chữ thường;
  // nhiều dòng → đọc như markdown (dán markdown là ra định dạng luôn).
  root.addEventListener("paste", (e) => {
    const images = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
    const text = e.clipboardData?.getData("text/plain") ?? "";
    e.preventDefault();
    const block = currentBlock();
    if (images.length) return insertImageFiles(images);
    if (isImageUrl(text.trim()) && (!block || typeOf(block) !== "code")) return insertImageUrl(text.trim());
    if (!text) return;
    if (!text.includes("\n") || (block && typeOf(block) === "code")) {
      document.execCommand("insertText", false, text);
      return;
    }
    const holder = document.createElement("div");
    holder.innerHTML = renderBlocks(text);
    const blocks = Array.from(holder.children) as HTMLElement[];
    if (!block) {
      root.append(...blocks);
    } else {
      const tail = splitBlock(block, typeOf(block) === "p" ? "p" : typeOf(block));
      tail.before(...blocks);
      if (isEmpty(block)) block.remove();
      if (isEmpty(tail)) tail.remove();
    }
    const last = blocks[blocks.length - 1];
    if (last) placeCaret(last.querySelector("code") ?? last, true);
    commit();
  });

  // Tick to-do: click vào ô vuông (nằm trong phần padding bên trái của block).
  root.addEventListener("mousedown", (e) => {
    const block = blockOf(e.target as Node);
    if (!block || typeOf(block) !== "todo") return;
    const rect = block.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(block).paddingLeft);
    if (e.clientX < rect.left + padding) {
      e.preventDefault();
      block.dataset.checked = block.dataset.checked === "true" ? "false" : "true";
      commit();
    }
  });

  // Rê chuột vào link → hiện địa chỉ ở góc dưới màn hình (giống thanh trạng thái của trình duyệt —
  // trình duyệt không tự hiện cho link nằm trong vùng contenteditable).
  const linkStatus = linkStatusBar();
  root.addEventListener("mouseover", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (link && root.contains(link)) linkStatus.show(link.href);
  });
  root.addEventListener("mouseout", (e) => {
    const link = (e.target as HTMLElement).closest("a[href]");
    if (link && !link.contains(e.relatedTarget as Node)) linkStatus.hide();
  });

  // Ctrl/Cmd + click để mở link (click thường là đặt con trỏ để sửa).
  root.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (link && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      window.open(link.href, "_blank", "noopener");
    }
  });

  // Rời editor → render lại từ markdown để tô màu lại code và dọn DOM trình duyệt tự sinh.
  // Chờ 1 nhịp: chuyển cửa sổ / hộp thoại prompt() cũng làm mất focus nhưng không phải rời editor
  // thật (document.hasFocus() = false) — khi đó giữ nguyên để không mất vị trí con trỏ.
  root.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (root.contains(document.activeElement) || !document.hasFocus()) return;
      if (root.querySelector("[data-uploading]")) return; // đang upload ảnh — giữ nguyên ảnh xem trước
      replaceContent(serialize(root));
    }, 0);
  });

  /**
   * Render lại từ markdown nhưng giữ nguyên các khối ảnh cũ (cùng URL) thay vì tạo thẻ <img> mới —
   * tạo mới làm ảnh tải/vẽ lại và bị nháy.
   */
  function replaceContent(markdown: string): void {
    const oldFigures = new Map<string, HTMLElement[]>();
    root.querySelectorAll<HTMLElement>("figure[data-type='image']").forEach((figure) => {
      const key = figureKey(figure);
      oldFigures.set(key, [...(oldFigures.get(key) ?? []), figure]);
    });
    const holder = document.createElement("div");
    holder.innerHTML = renderBlocks(markdown);
    holder.querySelectorAll<HTMLElement>("figure[data-type='image']").forEach((figure) => {
      const reuse = oldFigures.get(figureKey(figure))?.shift();
      if (reuse) figure.replaceWith(reuse);
    });
    root.replaceChildren(...Array.from(holder.childNodes));
    normalize();
  }

  function toggleInlineCode(): void {
    const sel = selection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const existing = (range.commonAncestorContainer instanceof Element ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement)?.closest("code");
    if (existing && root.contains(existing) && !existing.closest("pre")) {
      existing.replaceWith(document.createTextNode(existing.textContent ?? ""));
      return;
    }
    const text = range.toString();
    if (!text) return;
    range.deleteContents();
    const code = document.createElement("code");
    code.textContent = text;
    range.insertNode(code);
    const after = document.createRange();
    after.selectNodeContents(code);
    sel.removeAllRanges();
    sel.addRange(after);
  }

  const editor: WysiwygEditor = {
    load(markdown) {
      if (root.querySelector("[data-uploading]")) return; // không đè lên ảnh đang upload
      if (!root.firstElementChild) {
        root.innerHTML = renderBlocks(markdown);
        return normalize();
      }
      // Giữ lại thẻ ảnh cũ để ảnh không nháy khi người khác sửa trang.
      replaceContent(markdown);
    },

    pickImages() {
      if (!root.contains(selection()?.anchorNode ?? null)) placeCaret(root.lastElementChild ?? root, true);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;
      input.addEventListener("change", () => insertImageFiles(Array.from(input.files ?? [])));
      input.click();
    },

    inline(command) {
      const block = currentBlock();
      if (!block || typeOf(block) === "code" || typeOf(block) === "image") return;
      if (command === "bold") document.execCommand("bold");
      else if (command === "italic") document.execCommand("italic");
      else if (command === "strike") document.execCommand("strikeThrough");
      else if (command === "code") toggleInlineCode();
      else if (command === "link") {
        const anchor = selection()?.anchorNode?.parentElement?.closest("a");
        if (anchor && root.contains(anchor)) {
          document.execCommand("unlink");
        } else {
          const url = prompt("Link URL", "https://")?.trim();
          if (!url || !/^https?:\/\/\S+$/.test(url)) return;
          if (selection()?.isCollapsed) document.execCommand("insertHTML", false, `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`);
          else document.execCommand("createLink", false, url);
        }
      }
      commit();
    },

    block(type) {
      if (!root.contains(selection()?.anchorNode ?? null)) {
        // Chưa đặt con trỏ trong editor → thêm vào cuối trang.
        placeCaret(root.lastElementChild ?? root, true);
      }
      if (type === "hr") {
        const block = currentBlock();
        const hr = createBlock("hr");
        const next = createBlock("p");
        ensureFiller(next);
        (block ?? root.lastElementChild!).after(hr);
        hr.after(next);
        placeCaret(next, false);
        return commit();
      }
      const blocks = selectedBlocks().filter((el) => typeOf(el) !== "hr");
      if (!blocks.length) return;
      if (type === "code") {
        // Gộp các dòng đang chọn thành 1 khối code.
        const code = createBlock("code");
        code.querySelector("code")!.textContent = `${blocks.map((el) => el.textContent ?? "").join("\n")}\n`;
        blocks[0].before(code);
        blocks.forEach((el) => el.remove());
        placeCaret(code.querySelector("code")!, true);
        return commit();
      }
      // Tất cả đã là kiểu đó → bỏ về đoạn văn thường (bấm lần 2 để tắt).
      const target = blocks.every((el) => typeOf(el) === type) ? "p" : type;
      const converted = blocks.map((el) => setType(el, target));
      placeCaret(converted[converted.length - 1], true);
      commit();
    },

    focusStart() {
      root.focus();
      placeCaret(root.firstElementChild ?? root, false);
    },

    selectionRange() {
      const sel = selection();
      if (!sel?.rangeCount || sel.isCollapsed) return null;
      const range = sel.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) return null;
      const startBlock = blockOf(range.startContainer);
      if (!range.toString().trim() || (startBlock && typeOf(startBlock) === "code")) return null;
      return range;
    },
  };

  return editor;
}
