import "@six-js/core/components.css";
import "../styles/base.css";
import { registerDialog } from "@six-js/core/Components";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderFooter } from "../layout/footer/footer";
import { showcaseItems } from "../content/showcase";
import { codeBlock, mountCodeCopy, mountDemoTabs } from "../content/shared";
import { h, Fragment } from "../jsx";

registerDialog();

const dialogName = (i: number) => `showcase-code-${i}`;

const cards = showcaseItems.map((item, i) => (
  <div class="showcase-card" data-showcase-card data-search={`${item.title} ${item.subtitle}`.toLowerCase()}>
    <a class="showcase-card__link" href={item.demoUrl} target="_blank" rel="noopener">
      <span class="showcase-card__tag badge">{item.title}</span>
      <div class="showcase-card__media" style={`background:${item.gradient}`} />
      <div class="showcase-card__overlay">
        <span class="showcase-card__title">{item.title}</span>
        <span class="showcase-card__site">{item.subtitle}</span>
      </div>
    </a>
    <sx-dialog-trigger class="showcase-card__code-btn" name={dialogName(i)} aria-label="Xem code" title="Xem code">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#e6d1d1" viewBox="0 0 256 256">
        <path d="M66.56,91.07,22.25,128l44.31,36.93A4,4,0,0,1,64,172a3.94,3.94,0,0,1-2.56-.93l-48-40a4,4,0,0,1,0-6.14l48-40a4,4,0,0,1,5.12,6.14Zm176,33.86-48-40a4,4,0,1,0-5.12,6.14L233.75,128l-44.31,36.93a4,4,0,1,0,5.12,6.14l48-40a4,4,0,0,0,0-6.14ZM161.37,36.24a4,4,0,0,0-5.13,2.39l-64,176a4,4,0,0,0,2.39,5.13A4.12,4.12,0,0,0,96,220a4,4,0,0,0,3.76-2.63l64-176A4,4,0,0,0,161.37,36.24Z"></path>
      </svg>
    </sx-dialog-trigger>
  </div>
));

const dialogs = showcaseItems.map((item, i) => (
  <sx-dialog name={dialogName(i)} effect="zoom" position="center">
    <div class="card showcase-code-dialog">
      <h2>{item.title}</h2>
      <sx-dialog-trigger class="btn btn--ghost btn--sm" name={dialogName(i)}>
        Đóng
      </sx-dialog-trigger>
      <div class="demo-tabs" data-code-body={i}>
        <div class="demo-tabs__nav">
          <button type="button" class="demo-tabs__btn is-active" data-tab-btn="html">
            HTML
          </button>
          <button type="button" class="demo-tabs__btn" data-tab-btn="css">
            CSS
          </button>
          <button type="button" class="demo-tabs__btn" data-tab-btn="js">
            JS
          </button>
        </div>
        <div class="showcase-code-dialog__body demo-tabs__panel is-active" data-tab-panel="html">
          Đang tải code…
        </div>
        <div class="showcase-code-dialog__body demo-tabs__panel" data-tab-panel="css"></div>
        <div class="showcase-code-dialog__body demo-tabs__panel" data-tab-panel="js"></div>
      </div>
    </div>
  </sx-dialog>
));

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("showcase")}
    <div class="container">
      <header class="showcase-hero">
        <h1>Showcase</h1>
        <p>Demo trực tiếp cho từng plugin. Click vào một ô để mở trang demo trong tab mới, hoặc bấm icon để xem code.</p>
      </header>
      <div class="showcase-search-bar">
        <input type="search" class="showcase-search" placeholder="Tìm theo tên plugin..." data-showcase-search />
      </div>
      <section class="showcase-grid" data-showcase-grid>
        {cards}
      </section>
      <p class="showcase-empty" data-showcase-empty hidden>
        Không tìm thấy plugin nào khớp.
      </p>
    </div>
    {dialogs}
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();

const searchInput = document.querySelector<HTMLInputElement>("[data-showcase-search]")!;
const cardEls = Array.from(document.querySelectorAll<HTMLElement>("[data-showcase-card]"));
const emptyState = document.querySelector<HTMLElement>("[data-showcase-empty]")!;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cardEls.forEach((card) => {
    const matches = !query || (card.dataset.search ?? "").includes(query);
    card.hidden = !matches;
    if (matches) visibleCount++;
  });

  emptyState.hidden = visibleCount > 0;
});

mountDemoTabs();

/**
 * Strips each block's own common leading whitespace, rather than the whole file's — the demo
 * HTML nests <style>/<script> at different depths, so a global dedent would leave later blocks
 * jagged relative to earlier ones.
 */
function dedent(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

  const indents = lines.filter((line) => line.trim() !== "").map((line) => line.match(/^ */)![0].length);
  const minIndent = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(minIndent)).join("\n");
}

/** Splits a standalone demo HTML file into its HTML / CSS / JS parts, CodePen-style. */
function splitDemoSource(source: string): { html: string; css: string; js: string } {
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

// Fetched lazily (only once a dialog is actually opened) and cached per index, rather than
// bundling all 6 demo files' source as inline strings up front for content nobody may ever look at.
const loadedCode = new Set<number>();

window.addEventListener("sx-dialog-after-open", (e) => {
  const name = (e as CustomEvent<{ name: string }>).detail.name;
  const match = /^showcase-code-(\d+)$/.exec(name);
  if (!match) return;

  const i = Number(match[1]);
  if (loadedCode.has(i)) return;

  const wrap = document.querySelector<HTMLElement>(`[data-code-body="${i}"]`);
  const item = showcaseItems[i];
  if (!wrap || !item) return;

  const htmlPanel = wrap.querySelector<HTMLElement>('[data-tab-panel="html"]')!;
  const cssPanel = wrap.querySelector<HTMLElement>('[data-tab-panel="css"]')!;
  const jsPanel = wrap.querySelector<HTMLElement>('[data-tab-panel="js"]')!;

  fetch(item.demoUrl)
    .then((res) => res.text())
    .then((source) => {
      loadedCode.add(i);
      const { html, css, js } = splitDemoSource(source);
      htmlPanel.innerHTML = codeBlock(html, "html");
      cssPanel.innerHTML = css ? codeBlock(css, "css") : "";
      jsPanel.innerHTML = js ? codeBlock(js, "js") : "";
    })
    .catch(() => {
      htmlPanel.textContent = "Không tải được code.";
    });
});
