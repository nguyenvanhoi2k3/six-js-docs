import "@six-js/core/style.css";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderFooter } from "../layout/footer/footer";
import { showcaseItems } from "../content/showcase";

const cards = showcaseItems
  .map(
    (item) => `
      <a class="showcase-card" href="${item.href}" target="_blank" rel="noopener">
        <span class="showcase-card__tag badge">placeholder</span>
        <div class="showcase-card__media" style="background:${item.gradient}"></div>
        <div class="showcase-card__overlay">
          <span class="showcase-card__title">${item.title}</span>
          <span class="showcase-card__site">${item.site} ↗</span>
        </div>
      </a>
    `,
  )
  .join("");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("showcase")}

  <div class="container">
    <header class="showcase-hero">
      <h1>Showcase</h1>
      <p>Những sản phẩm thực tế dựng bằng six-js. Click vào một ô để mở trang demo trong tab mới.</p>
    </header>

    <section class="showcase-grid">${cards}</section>
  </div>

  ${renderFooter()}
`;

mountThemeToggle(document);
