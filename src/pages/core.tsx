import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { coreNav } from "../layout/nav/nav-data";
import { initSectionRouter } from "../layout/section-router/section-router";
import { coreContent } from "../content/core";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";
import { h, Fragment } from "../jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("core")}
    <div class="section-layout">
      <aside class="section-sidebar" id="sidebar" />
      <main class="section-content" id="content" />
    </div>
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();

initSectionRouter({
  nav: coreNav,
  content: coreContent,
  sidebarHeading: "Core",
  sidebarEl: document.querySelector<HTMLElement>("#sidebar")!,
  contentEl: document.querySelector<HTMLElement>("#content")!,
});
