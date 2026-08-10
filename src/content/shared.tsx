import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import { h } from "../jsx";

type AttrRow = [attr: string, desc: string, def: string] | [attr: string, desc: string, values: string, def: string];

/**
 * 3-tuple rows render the classic [Attribute, Description, Default] table. A 4-tuple row inserts
 * its own "Value" column (allowed values, e.g. `"x" | "y"`) right after Attribute, ahead of the
 * prose description — used for vars tables where that's worth calling out separately. Whether a
 * whole table gets that extra column is decided once, from whether ANY row in it is a 4-tuple.
 */
export function attrsTable(rows: AttrRow[]): string {
  const hasValues = rows.some((row) => row.length === 4);
  return (
    <table class="content-pane__attrs">
      <thead>
        <tr>
          <th>Attribute</th>
          {hasValues && <th>Value</th>}
          <th>Description</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const [attr, desc, values, def] = row.length === 4 ? row : [row[0], row[1], undefined, row[2]];
          return (
            <tr>
              <td>{attr}</td>
              {hasValues && <td>{values ?? "—"}</td>}
              <td>{desc}</td>
              <td>{def}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/**
 * For DOM event names (dispatched/listened via addEventListener), not HTML attributes — a
 * separate table from attrsTable() specifically so the header doesn't say "Attribute" for
 * something you never actually write into markup.
 */
export function eventsTable(rows: [event: string, desc: string][]): string {
  return (
    <table class="content-pane__attrs">
      <thead>
        <tr>
          <th>Event</th>
          <th>Mô tả</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([event, desc]) => (
          <tr>
            <td>{event}</td>
            <td>{desc}</td>
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

/**
 * Strips each block's own common leading whitespace, rather than the whole file's — a demo file
 * nests <style>/<script> at different depths, so a global dedent would leave later blocks jagged
 * relative to earlier ones.
 */
export function dedent(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  const indents = lines.filter((line) => line.trim() !== "").map((line) => line.match(/^ */)![0].length);
  const minIndent = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(minIndent)).join("\n");
}

/** Splits a standalone demo HTML file into its HTML / CSS / JS parts, CodePen-style. */
export function splitDemoSource(source: string): { html: string; css: string; js: string } {
  const doc = new DOMParser().parseFromString(source, "text/html");

  const css = Array.from(doc.querySelectorAll("style"))
    .map((el) => dedent(el.textContent ?? ""))
    .filter(Boolean)
    .join("\n\n");

  const js = Array.from(doc.querySelectorAll("script"))
    .map((el) => dedent(el.textContent ?? ""))
    .filter(Boolean)
    .join("\n\n");

  doc.querySelectorAll("style, script").forEach((el) => el.remove());

  return { html: dedent(doc.body.innerHTML), css, js };
}

let tabListenerMounted = false;

/** Wires up any `.demo-tabs` block: click a `[data-tab-btn]`, show the matching `[data-tab-panel]` within the same block. */
export function mountDemoTabs(): void {
  if (tabListenerMounted) return;
  tabListenerMounted = true;

  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-tab-btn]");
    if (!btn) return;

    const wrap = btn.closest(".demo-tabs");
    if (!wrap) return;

    const target = btn.dataset.tabBtn;
    wrap.querySelectorAll<HTMLElement>("[data-tab-btn]").forEach((b) => b.classList.toggle("is-active", b === btn));
    wrap.querySelectorAll<HTMLElement>("[data-tab-panel]").forEach((p) => p.classList.toggle("is-active", p.dataset.tabPanel === target));
  });
}
