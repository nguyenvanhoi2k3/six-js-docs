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

export type BlockType = "p" | "h1" | "h2" | "h3" | "bullet" | "numbered" | "todo" | "quote" | "code" | "hr";
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
};

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
  if (tag === "LI") return "bullet";
  return "p";
}

function indentOf(el: Element): number {
  return Math.min(Number((el as HTMLElement).dataset?.indent) || 0, MAX_INDENT);
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

export function createWysiwyg(root: HTMLElement, onChange: (markdown: string) => void): WysiwygEditor {
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
    if (block.dataset.type === "hr" || block.dataset.type === "code") return;
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

  // Dán: 1 dòng → chèn chữ thường; nhiều dòng → đọc như markdown (dán markdown là ra định dạng luôn).
  root.addEventListener("paste", (e) => {
    const text = e.clipboardData?.getData("text/plain") ?? "";
    e.preventDefault();
    const block = currentBlock();
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
      root.innerHTML = renderBlocks(serialize(root));
      normalize();
    }, 0);
  });

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
      root.innerHTML = renderBlocks(markdown);
      normalize();
    },

    inline(command) {
      const block = currentBlock();
      if (!block || typeOf(block) === "code") return;
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
