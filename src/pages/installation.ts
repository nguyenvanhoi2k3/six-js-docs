import "@six-js/core/style.css";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderInstallation } from "../content/installation";
import { mountCodeCopy } from "../content/shared";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("installation")}

  <div class="container page-section">
    ${renderInstallation()}
  </div>

  <footer class="site-footer">
    <div class="container">six-js docs</div>
  </footer>
`;

mountThemeToggle(document);
mountCodeCopy();
