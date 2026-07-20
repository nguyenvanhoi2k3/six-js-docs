import "@six-js/core/components.css";
import "../styles/base.css";
import { registerDialog } from "@six-js/core/Components";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderFooter } from "../layout/footer/footer";
import { showcaseItems } from "../content/showcase";
import { codeBlock, mountCodeCopy } from "../content/shared";
import { h, Fragment } from "../jsx";

registerDialog();

const cards = showcaseItems.map((item, i) => (
  <div
    class="showcase-card"
    data-showcase-card
    data-search={`${item.title} ${item.site}`.toLowerCase()}
  >
    <a
      class="showcase-card__link"
      href={item.href}
      target="_blank"
      rel="noopener"
    >
      <span class="showcase-card__tag badge">placeholder</span>
      <div class="showcase-card__media" style={`background:${item.gradient}`} />
      <div class="showcase-card__overlay">
        <span class="showcase-card__title">{item.title}</span>
        <span class="showcase-card__site">{item.site} ↗</span>
      </div>
    </a>
    <sx-dialog-trigger
      class="showcase-card__code-btn"
      name={`showcase-code-${i}`}
      aria-label="Xem code"
      title="Xem code"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="#e6d1d1"
        viewBox="0 0 256 256"
      >
        <path d="M66.56,91.07,22.25,128l44.31,36.93A4,4,0,0,1,64,172a3.94,3.94,0,0,1-2.56-.93l-48-40a4,4,0,0,1,0-6.14l48-40a4,4,0,0,1,5.12,6.14Zm176,33.86-48-40a4,4,0,1,0-5.12,6.14L233.75,128l-44.31,36.93a4,4,0,1,0,5.12,6.14l48-40a4,4,0,0,0,0-6.14ZM161.37,36.24a4,4,0,0,0-5.13,2.39l-64,176a4,4,0,0,0,2.39,5.13A4.12,4.12,0,0,0,96,220a4,4,0,0,0,3.76-2.63l64-176A4,4,0,0,0,161.37,36.24Z"></path>
      </svg>
    </sx-dialog-trigger>
  </div>
));

const dialogs = showcaseItems.map((item, i) => (
  <sx-dialog name={`showcase-code-${i}`} effect="zoom" position="center">
    <div class="card showcase-code-dialog">
      <h2>{item.title}</h2>
      <div class="showcase-code-dialog__body">
        {codeBlock(item.code, item.codeLang)}
      </div>
      <sx-dialog-trigger
        class="btn btn--ghost btn--sm"
        name={`showcase-code-${i}`}
      >
        Đóng
      </sx-dialog-trigger>
    </div>
  </sx-dialog>
));

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("showcase")}
    <div class="container">
      <header class="showcase-hero">
        <h1>Showcase</h1>
        <p>
          Những sản phẩm thực tế dựng bằng six-js. Click vào một ô để mở trang
          demo trong tab mới, hoặc bấm icon để xem code.
        </p>
      </header>
      <div class="showcase-search-bar">
        <input
          type="search"
          class="showcase-search"
          placeholder="Tìm theo tên hoặc site..."
          data-showcase-search
        />
      </div>
      <section class="showcase-grid" data-showcase-grid>
        {cards}
      </section>
    </div>
    {dialogs}
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();

const searchInput = document.querySelector<HTMLInputElement>(
  "[data-showcase-search]",
)!;
const cardEls = Array.from(
  document.querySelectorAll<HTMLElement>("[data-showcase-card]"),
);
const emptyState = document.querySelector<HTMLElement>(
  "[data-showcase-empty]",
)!;

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
