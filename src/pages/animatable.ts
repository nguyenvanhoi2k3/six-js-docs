import "@six-js/core/style.css";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { animatableNav } from "../layout/nav/nav-data";
import { initSectionRouter } from "../layout/animatable-router/section-router";
import { animatableContent } from "../content/animatable";
import { mountCodeCopy } from "../content/shared";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("animatable")}
  <div class="section-layout">
    <aside class="section-sidebar" id="sidebar"></aside>
    <main class="section-content" id="content"></main>
  </div>
`;

mountThemeToggle(document);
mountCodeCopy();

initSectionRouter({
  nav: animatableNav,
  content: animatableContent,
  sidebarHeading: "Animatable",
  sidebarEl: document.querySelector<HTMLElement>("#sidebar")!,
  contentEl: document.querySelector<HTMLElement>("#content")!,
});
