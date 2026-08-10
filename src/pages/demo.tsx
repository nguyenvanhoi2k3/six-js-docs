import "@six-js/core/components.css";
import "../styles/base.css";
import "../styles/demo-fixed-light.css";
import { registerComponents } from "@six-js/core/Components";

registerComponents();
import { componentsDocs } from "../content/components";
import { pluginsContent } from "../content/plugins";
import { codeBlock, mountCodeCopy, mountDemoTabs, scopeCss } from "../content/shared";
import type { ComponentDemo, ComponentDoc } from "../content/components/types";
import { h } from "../jsx";

const root = document.querySelector<HTMLDivElement>("#app")!;

type DemoDoc = Pick<ComponentDoc, "slug" | "eyebrow" | "title" | "demos" | "demoSidebar">;

/** Resolves `?c=<componentSlug>` (components) or `?p=<pluginContentKey>` (plugins) into a common shape demo.html can render. */
function findDoc(): DemoDoc | undefined {
  const params = new URLSearchParams(location.search);

  const componentSlug = params.get("c");
  if (componentSlug) return componentsDocs.find((d) => d.slug === componentSlug);

  const pluginKey = params.get("p");
  const entry = pluginKey ? pluginsContent[pluginKey] : undefined;
  if (!entry?.demos?.length) return undefined;

  return {
    slug: pluginKey!.replace(/\//g, "--"),
    eyebrow: entry.eyebrow,
    title: entry.title,
    demos: entry.demos,
    demoSidebar: entry.demos.length > 1,
  };
}

function renderDemoBody(sectionId: string, d: ComponentDemo): string {
  if (!d.html) return d.renderDemo?.() ?? "";

  const style = d.css ? <style>{scopeCss(`#${sectionId}`, d.css)}</style> : "";

  return (
    <div class="demo-tabs">
      <div class="demo-tabs__nav">
        <button type="button" class="demo-tabs__btn is-active" data-tab-btn="preview">
          Demo
        </button>
        <button type="button" class="demo-tabs__btn" data-tab-btn="html">
          HTML
        </button>
        {d.css ? (
          <button type="button" class="demo-tabs__btn" data-tab-btn="css">
            CSS
          </button>
        ) : (
          ""
        )}
        {d.js ? (
          <button type="button" class="demo-tabs__btn" data-tab-btn="js">
            JS
          </button>
        ) : (
          ""
        )}
      </div>
      {style}
      <div class="demo-tabs__panel is-active" data-tab-panel="preview">
        {d.html}
      </div>
      <div class="demo-tabs__panel" data-tab-panel="html">
        {codeBlock(d.html, "html")}
      </div>
      {d.css ? (
        <div class="demo-tabs__panel" data-tab-panel="css">
          {codeBlock(d.css, "css")}
        </div>
      ) : (
        ""
      )}
      {d.js ? (
        <div class="demo-tabs__panel" data-tab-panel="js">
          {codeBlock(d.js, "js")}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function setupScrollSpy(doc: DemoDoc) {
  const sidebar = root.querySelector<HTMLElement>(".demo-sidebar");
  const heading = sidebar?.querySelector<HTMLElement>(".section-sidebar__heading");
  const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  if (!sidebar || !links.length) return;

  if (heading) heading.textContent = doc.title;

  const linkById = new Map(links.map((a) => [a.getAttribute("href")?.slice(1) ?? "", a]));

  const setActive = (id: string) => {
    const link = linkById.get(id);
    if (!link) return;

    links.forEach((a) => a.classList.remove("is-active"));
    link.classList.add("is-active");

    const label = link.textContent?.trim();
    document.title = label ? `${doc.title} — ${label} — demo` : `${doc.title} — demo`;
  };

  const firstId = links[0]?.getAttribute("href")?.slice(1);
  if (firstId) setActive(firstId);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
  );

  doc.demos.forEach((_, i) => {
    const section = root.querySelector<HTMLElement>(`#${doc.slug}-demo-${i}`);
    if (section) observer.observe(section);
  });
}

function render() {
  const doc = findDoc();

  if (!doc) {
    root.innerHTML = (
      <div class="demo-stage">
        <p style="color:var(--muted);font-family:var(--font-sans)">Không tìm thấy demo.</p>
      </div>
    );
    return;
  }

  document.title = `${doc.title} — demo`;

  const sections = doc.demos
    .map((d, i) => {
      const sectionId = `${doc.slug}-demo-${i}`;
      return (
        <section id={sectionId} class="demo-section">
          {d.label ? <h2>{d.label}</h2> : ""}
          {renderDemoBody(sectionId, d)}
        </section>
      );
    })
    .join("");

  root.innerHTML =
    doc.demoSidebar === false ? (
      <div id={doc.eyebrow} class="demo-stage">
        {sections}
      </div>
    ) : (
      <div class="section-layout">
        <aside class="section-sidebar demo-sidebar">
          <p class="section-sidebar__heading">{doc.title}</p>
          <ul class="nav-tree nav-tree__flat">
            {doc.demos.map((d, i) => (
              <li>
                <a href={`#${doc.slug}-demo-${i}`}>{d.label ?? ""}</a>
              </li>
            ))}
          </ul>
        </aside>
        <main id={doc.eyebrow} class="section-content">
          {sections}
        </main>
      </div>
    );

  doc.demos.forEach((d, i) => {
    const section = root.querySelector<HTMLElement>(`#${doc.slug}-demo-${i}`);
    if (section) d.initDemo?.(section);
  });

  setupScrollSpy(doc);
}

mountDemoTabs();
mountCodeCopy();
render();
