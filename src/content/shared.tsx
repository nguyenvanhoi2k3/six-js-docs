import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import { h } from "../jsx";

export function attrsTable(rows: [attr: string, value: string, def: string][]): string {
  return (
    <table class="content-pane__attrs">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Giá trị</th>
          <th>Mặc định</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([attr, value, def]) => (
          <tr>
            <td>{attr}</td>
            <td>{value}</td>
            <td>{def}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Prefixes every top-level selector in `css` with `scope` so it only applies within that container. Skips at-rule blocks (@media, @keyframes, ...). */
export function scopeCss(scope: string, css: string): string {
  return css.replace(/(^|\})\s*([^{}]+)\{/g, (match, brace: string, selectorList: string) => {
    if (selectorList.trim().startsWith("@")) return match;
    const scoped = selectorList
      .split(",")
      .map((s) => `${scope} ${s.trim()}`)
      .join(", ");
    return `${brace}\n${scoped} {`;
  });
}

export type CodeLang = "html" | "css" | "js" | "bash";

const GRAMMAR_NAME: Record<CodeLang, string> = {
  html: "markup",
  css: "css",
  js: "javascript",
  bash: "bash",
};

export function codeBlock(code: string, lang: CodeLang = "html"): string {
  const source = code.trim();
  const grammarName = GRAMMAR_NAME[lang];
  const grammar = Prism.languages[grammarName];
  const highlighted = grammar ? Prism.highlight(source, grammar, grammarName) : source;

  return (
    <div class="code-block-wrap">
      <button type="button" class="code-block__copy" data-copy-code aria-label="Copy code">
        <svg class="icon-copy" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="7.5" y="7.5" width="10" height="10" rx="1.5" />
          <path d="M12.5 7.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v7A1.5 1.5 0 0 0 4 12.5h3.5" />
        </svg>
        <svg class="icon-check" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 10.5l4 4 8-9" />
        </svg>
      </button>
      <pre class={`code-block language-${lang}`}>
        <code class={`language-${lang}`}>{highlighted}</code>
      </pre>
    </div>
  );
}

let copyListenerMounted = false;

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      textarea.remove();
    }
  });
}

export function mountCodeCopy(): void {
  if (copyListenerMounted) return;
  copyListenerMounted = true;

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-code]");
    if (!btn) return;

    const code = btn.parentElement?.querySelector("code");
    const text = code?.textContent ?? "";

    copyText(text)
      .then(() => {
        btn.classList.add("is-copied");
        window.setTimeout(() => btn.classList.remove("is-copied"), 1500);
      })
      .catch(() => {});
  });
}
