import "@six-js/core/style.css";
import "../styles/base.css";
import { six } from "@six-js/core";
import { componentsDocs } from "../content/components";
import { codeBlock, mountCodeCopy, scopeCss } from "../content/shared";
import type { ComponentDemo } from "../content/components/types";

const root = document.querySelector<HTMLDivElement>("#app")!;

function renderDemoBody(sectionId: string, d: ComponentDemo): string {
  if (!d.html) return d.renderDemo?.() ?? "";

  const style = d.css ? `<style>${scopeCss(`#${sectionId}`, d.css)}</style>` : "";

  return `
    <div class="demo-tabs">
      <div class="demo-tabs__nav">
        <button type="button" class="demo-tabs__btn is-active" data-tab-btn="preview">Demo</button>
        <button type="button" class="demo-tabs__btn" data-tab-btn="html">HTML</button>
        ${d.css ? `<button type="button" class="demo-tabs__btn" data-tab-btn="css">CSS</button>` : ""}
      </div>
      ${style}
      <div class="demo-tabs__panel is-active" data-tab-panel="preview">${d.html}</div>
      <div class="demo-tabs__panel" data-tab-panel="html">${codeBlock(d.html, "html")}</div>
      ${d.css ? `<div class="demo-tabs__panel" data-tab-panel="css">${codeBlock(d.css, "css")}</div>` : ""}
    </div>
  `;
}

function render() {
  const slug = new URLSearchParams(location.search).get("c") ?? "";
  const doc = componentsDocs.find((d) => d.slug === slug);

  if (!doc) {
    root.innerHTML = `<div class="demo-stage"><p style="color:var(--muted);font-family:var(--font-sans)">Không tìm thấy demo cho "${slug}".</p></div>`;
    return;
  }

  document.title = `${doc.title} — demo`;

  const sections = doc.demos
    .map((d, i) => {
      const sectionId = `${doc.slug}-demo-${i}`;
      return `
        <section id="${sectionId}" class="demo-section">
          ${d.label ? `<h2>${d.label}</h2>` : ""}
          ${renderDemoBody(sectionId, d)}
        </section>
      `;
    })
    .join("");

  root.innerHTML =
    doc.demoSidebar === false
      ? `
        <div id="${doc.eyebrow}" class="demo-stage">
          ${sections}
        </div>
      `
      : `
        <div class="section-layout">
          <aside class="section-sidebar demo-sidebar">
            <p class="section-sidebar__heading">${doc.title}</p>
            <ul class="nav-tree nav-tree__flat">
              ${doc.demos.map((d, i) => `<li><a href="#${doc.slug}-demo-${i}">${d.label ?? ""}</a></li>`).join("")}
            </ul>
          </aside>
          <main id="${doc.eyebrow}" class="section-content">${sections}</main>
        </div>
      `;

  six.initElements();
  doc.demos.forEach((d, i) => {
    const section = root.querySelector<HTMLElement>(`#${doc.slug}-demo-${i}`);
    if (section) d.initDemo?.(section);
  });
}

root.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-tab-btn]");
  if (!btn) return;

  const wrap = btn.closest(".demo-tabs");
  if (!wrap) return;

  const target = btn.dataset.tabBtn;
  wrap.querySelectorAll<HTMLElement>("[data-tab-btn]").forEach((b) => b.classList.toggle("is-active", b === btn));
  wrap
    .querySelectorAll<HTMLElement>("[data-tab-panel]")
    .forEach((p) => p.classList.toggle("is-active", p.dataset.tabPanel === target));
});

mountCodeCopy();
render();
