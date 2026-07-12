import { six } from "@six-js/core";
import type { NavGroup } from "../nav/nav-data";
import { findFirstLeaf } from "../nav/nav-data";
import { renderSidebar } from "../nav/sidebar";
import type { ContentMap } from "./content-types";

export interface SectionRouterOptions {
  nav: NavGroup[];
  content: ContentMap;
  sidebarHeading: string;
  sidebarEl: HTMLElement;
  contentEl: HTMLElement;
}

function currentSlug(nav: NavGroup[]): string {
  const raw = location.hash.replace(/^#/, "");
  const [groupSlug, itemSlug] = raw.split("/");
  const group = nav.find((g) => g.slug === groupSlug);
  if (group && group.items.some((item) => item.slug === itemSlug)) return raw;
  return findFirstLeaf(nav);
}

export function initSectionRouter(options: SectionRouterOptions): void {
  const { nav, content, sidebarHeading, sidebarEl, contentEl } = options;

  sidebarEl.innerHTML = renderSidebar(nav, sidebarHeading);

  const links = Array.from(sidebarEl.querySelectorAll<HTMLAnchorElement>("[data-slug]"));
  const groups = Array.from(sidebarEl.querySelectorAll<HTMLDetailsElement>(".nav-tree__group"));

  function renderRoute() {
    const slug = currentSlug(nav);
    const entry = content[slug];

    links.forEach((a) => a.classList.toggle("is-active", a.dataset.slug === slug));
    const activeGroupSlug = slug.split("/")[0];
    groups.forEach((g) => {
      if (g.dataset.group === activeGroupSlug) g.open = true;
    });

    if (!entry) {
      contentEl.innerHTML = `<div class="content-pane__placeholder">Không tìm thấy nội dung.</div>`;
      return;
    }

    contentEl.innerHTML = `
      <article class="content-pane">
        <span class="content-pane__eyebrow">${entry.eyebrow}</span>
        <h1>${entry.title}</h1>
        <p class="content-pane__lead">${entry.lead}</p>
        ${entry.render()}
      </article>
    `;

    six.initElements();
    entry.init?.(contentEl);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
