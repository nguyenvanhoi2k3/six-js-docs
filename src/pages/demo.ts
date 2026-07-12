import "@six-js/core/style.css";
import "../styles/base.css";
import { six } from "@six-js/core";
import { componentsDocs } from "../content/components";

const root = document.querySelector<HTMLDivElement>("#app")!;

function render() {
  const slug = new URLSearchParams(location.search).get("c") ?? "";
  const doc = componentsDocs.find((d) => d.slug === slug);

  if (!doc) {
    root.innerHTML = `<div class="demo-stage"><p style="color:var(--muted);font-family:var(--font-sans)">Không tìm thấy demo cho "${slug}".</p></div>`;
    return;
  }

  document.title = `${doc.title} — demo`;

  const sections = doc.demos
    .map(
      (d, i) => `
        <section id="${doc.slug}-demo-${i}" class="demo-section">
          ${d.label ? `<h2>${d.label}</h2>` : ""}
          ${d.renderDemo()}
        </section>
      `,
    )
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

render();
