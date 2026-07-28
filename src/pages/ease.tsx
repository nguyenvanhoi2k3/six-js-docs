import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderEase, initEase } from "../content/ease";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";
import { h, Fragment } from "../jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("ease")}
    <div class="container">{renderEase()}</div>
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();
initEase(document.querySelector<HTMLElement>(".content-pane")!);
