import "@six-js/core/components.css";
import { registerDialog } from "@six-js/core/Components";
import type { NavGroup } from "../nav/nav-data";
import { findFirstLeaf } from "../nav/nav-data";
import { renderSidebar } from "../nav/sidebar";
import type { ContentMap } from "./content-types";
import { codeBlock, mountDemoTabs, splitDemoSource } from "../../content/shared";
import { h } from "../../jsx";

export interface SectionRouterOptions {
  nav: NavGroup[];
  content: ContentMap;
  sidebarHeading: string;
  sidebarEl: HTMLElement;
  contentEl: HTMLElement;
}

const DEMO_CODE_DIALOG_NAME = "section-demo-code";

function currentSlug(nav: NavGroup[]): string {
  const raw = location.hash.replace(/^#/, "");
  const [groupSlug, itemSlug] = raw.split("/");
  const group = nav.find((g) => g.slug === groupSlug);
  if (group && group.items.some((item) => item.slug === itemSlug)) return raw;
  return findFirstLeaf(nav);
}

/**
 * A page's `demoUrl` entries point at standalone static demo files (not shown inline) — this sets
 * up ONE shared "Xem code" dialog, fetching + splitting whichever file is current on open, cached
 * per URL so switching between pages that share the same demoUrl doesn't refetch.
 */
function setupDemoCodeDialog(): { setCurrentUrl: (url: string | null) => void } {
  registerDialog();
  mountDemoTabs();

  document.body.insertAdjacentHTML(
    "beforeend",
    (
      <sx-dialog name={DEMO_CODE_DIALOG_NAME} effect="zoom" position="center">
        <div class="card showcase-code-dialog">
          <h2>Code</h2>
          <sx-dialog-trigger class="btn btn--ghost btn--sm" name={DEMO_CODE_DIALOG_NAME}>
            Đóng
          </sx-dialog-trigger>
          <div class="demo-tabs">
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
    ),
  );

  const dialogEl = document.querySelector(`sx-dialog[name="${DEMO_CODE_DIALOG_NAME}"]`)!;
  const htmlPanel = dialogEl.querySelector<HTMLElement>('[data-tab-panel="html"]')!;
  const cssPanel = dialogEl.querySelector<HTMLElement>('[data-tab-panel="css"]')!;
  const jsPanel = dialogEl.querySelector<HTMLElement>('[data-tab-panel="js"]')!;

  const demoCodeCache = new Map<string, { html: string; css: string; js: string }>();
  let currentUrl: string | null = null;

  window.addEventListener("sx-dialog-before-open", (e) => {
    const name = (e as CustomEvent<{ name: string }>).detail.name;
    if (name !== DEMO_CODE_DIALOG_NAME || !currentUrl) return;

    const url = currentUrl;
    const cached = demoCodeCache.get(url);
    if (cached) {
      htmlPanel.innerHTML = codeBlock(cached.html, "html");
      cssPanel.innerHTML = cached.css ? codeBlock(cached.css, "css") : "";
      jsPanel.innerHTML = cached.js ? codeBlock(cached.js, "js") : "";
      return;
    }

    htmlPanel.textContent = "Đang tải code…";
    cssPanel.innerHTML = "";
    jsPanel.innerHTML = "";

    fetch(url)
      .then((res) => res.text())
      .then((source) => {
        const split = splitDemoSource(source);
        demoCodeCache.set(url, split);
        if (currentUrl !== url) return; // đã điều hướng sang trang khác trước khi fetch xong
        htmlPanel.innerHTML = codeBlock(split.html, "html");
        cssPanel.innerHTML = split.css ? codeBlock(split.css, "css") : "";
        jsPanel.innerHTML = split.js ? codeBlock(split.js, "js") : "";
      })
      .catch(() => {
        htmlPanel.textContent = "Không tải được code.";
      });
  });

  return { setCurrentUrl: (url) => (currentUrl = url) };
}

export function initSectionRouter(options: SectionRouterOptions): void {
  const { nav, content, sidebarHeading, sidebarEl, contentEl } = options;

  sidebarEl.innerHTML = renderSidebar(nav, sidebarHeading);

  const links = Array.from(sidebarEl.querySelectorAll<HTMLAnchorElement>("[data-slug]"));
  const groups = Array.from(sidebarEl.querySelectorAll<HTMLDetailsElement>(".nav-tree__group"));

  const hasDemoUrls = Object.values(content).some((entry) => entry.demoUrl);
  const demoCodeDialog = hasDemoUrls ? setupDemoCodeDialog() : null;

  function renderRoute() {
    const slug = currentSlug(nav);
    const entry = content[slug];

    links.forEach((a) => a.classList.toggle("is-active", a.dataset.slug === slug));
    const activeGroupSlug = slug.split("/")[0];
    groups.forEach((g) => {
      if (g.dataset.group === activeGroupSlug) g.open = true;
    });

    if (!entry) {
      contentEl.innerHTML = <div class="content-pane__placeholder">Không tìm thấy nội dung.</div>;
      return;
    }

    demoCodeDialog?.setCurrentUrl(entry.demoUrl ?? null);

    contentEl.innerHTML = (
      <article class="content-pane">
        <span class="content-pane__eyebrow">{entry.eyebrow}</span>
        <h1>{entry.title}</h1>
        <p class="content-pane__lead">{entry.lead}</p>
        {entry.demoUrl || (entry.demos && entry.demos.length) ? (
          <div class="content-pane__panel">
            <a class="btn btn--primary" href={entry.demoUrl ?? `demo.html?p=${encodeURIComponent(slug)}`} target="_blank" rel="noopener">
              Xem demo ↗
            </a>
            {entry.demoUrl ? (
              <sx-dialog-trigger class="btn btn--ghost" name={DEMO_CODE_DIALOG_NAME}>
                Xem code
              </sx-dialog-trigger>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {entry.render()}
      </article>
    );

    entry.init?.(contentEl);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
