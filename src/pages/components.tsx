import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderFlatSidebar } from "../layout/nav/sidebar";
import { componentsList } from "../layout/nav/nav-data";
import { componentsDocs } from "../content/components";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";
import { h, Fragment } from "../jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("components")}
    <div class="section-layout">
      <aside class="section-sidebar" id="sidebar" />
      <main class="section-content" id="content" />
    </div>
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();

const sidebarEl = document.querySelector<HTMLElement>("#sidebar")!;
const contentEl = document.querySelector<HTMLElement>("#content")!;

sidebarEl.innerHTML = renderFlatSidebar(componentsList, "Components");
const links = Array.from(sidebarEl.querySelectorAll<HTMLAnchorElement>("[data-slug]"));

function currentSlug(): string {
  const raw = location.hash.replace(/^#/, "");
  return componentsDocs.some((d) => d.slug === raw) ? raw : componentsDocs[0].slug;
}

function renderRoute() {
  const slug = currentSlug();
  const doc = componentsDocs.find((d) => d.slug === slug)!;

  links.forEach((a) => a.classList.toggle("is-active", a.dataset.slug === slug));

  contentEl.innerHTML = (
    <article class="content-pane">
      <span class="content-pane__eyebrow">{doc.eyebrow}</span>
      <h1>{doc.title}</h1>
      <p class="content-pane__lead">{doc.lead}</p>
      <div class="content-pane__panel">
        <a class="btn btn--primary" href={`/demo.html?c=${doc.slug}`} target="_blank" rel="noopener">
          Xem demo ↗
        </a>
      </div>
      {doc.render()}
    </article>
  );

  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
