import "@six-js/core/style.css";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { pluginsNav } from "../layout/nav/nav-data";
import { initSectionRouter } from "../layout/animatable-router/section-router";
import { pluginsContent } from "../content/plugins";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("plugins")}
  <div class="section-layout">
    <aside class="section-sidebar" id="sidebar"></aside>
    <main class="section-content" id="content"></main>
  </div>
  ${renderFooter()}
`;

mountThemeToggle(document);
mountCodeCopy();

initSectionRouter({
  nav: pluginsNav,
  content: pluginsContent,
  sidebarHeading: "Plugins",
  sidebarEl: document.querySelector<HTMLElement>("#sidebar")!,
  contentEl: document.querySelector<HTMLElement>("#content")!,
});
