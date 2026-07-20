import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderInstallation, initInstallation } from "../content/installation";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";
import { h, Fragment } from "../jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("installation")}
    <div class="container page-installation">{renderInstallation()}</div>
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();
initInstallation(document.querySelector<HTMLElement>(".content-pane")!);
