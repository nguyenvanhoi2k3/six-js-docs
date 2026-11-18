/**
 * Phần markdown dùng chung cho Notes: nạp ngôn ngữ Prism để tô màu code, render định dạng chữ
 * (**bold**, *italic*, ~~strike~~, `code`, [text](url), link tự động) và bỏ ký hiệu để tìm kiếm /
 * đếm từ. Phần block (heading, list, to-do…) nằm trong wysiwyg.ts.
 */
// prismjs (lõi) phải được nạp trước các component — component dùng biến global `Prism`.
import "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-liquid";

/** Tên ghi sau ``` → tên grammar Prism. "" = không tô màu. */
export const CODE_LANGS: Record<string, string> = {
  js: "javascript", javascript: "javascript", mjs: "javascript", cjs: "javascript",
  ts: "typescript", typescript: "typescript",
  jsx: "jsx", tsx: "tsx",
  html: "markup", xml: "markup", svg: "markup", markup: "markup",
  css: "css", scss: "scss", sass: "scss",
  json: "json",
  bash: "bash", sh: "bash", shell: "bash", zsh: "bash",
  liquid: "liquid",
  text: "", txt: "", plain: "",
};

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const LINK_ATTRS = 'target="_blank" rel="noopener noreferrer"';

export function renderInline(text: string): string {
  // Tách `code` ra trước để không format bên trong code.
  return text
    .split(/(`[^`]+`)/g)
    .map((part, i) => {
      if (i % 2 === 1) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      return escapeHtml(part)
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s<>"')]+)\)/g, `<a href="$2" ${LINK_ATTRS}>$1</a>`)
        .replace(/(?<![="'>\w])https?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g, (url) => `<a href="${url}" ${LINK_ATTRS}>${url}</a>`)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        // *nghiêng* dùng được cả giữa từ (bold ** đã được thay ở dòng trên nên không lẫn).
        .replace(/\*([^*\s](?:[^*]*[^*\s])?)\*/g, "<em>$1</em>")
        .replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>")
        .replace(/~~([^~]+)~~/g, "<del>$1</del>");
    })
    .join("");
}

/** Bỏ ký hiệu markdown để đếm chữ / tìm kiếm / làm đoạn trích. */
export function plainText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^\s*(#{1,3}|[-*+](\s+\[[ xX]\])?|\d+[.)]|>)\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`]/g, "");
}
