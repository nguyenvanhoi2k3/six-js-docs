import "@six-js/core/style.css";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderInstallation } from "../content/installation";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("installation")}

  <div class="container page-section">
    ${renderInstallation()}
  </div>

  ${renderFooter()}
`;

mountThemeToggle(document);
mountCodeCopy();
