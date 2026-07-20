import "./styles/base.css";
import { renderHeader } from "./layout/header/header";
import { mountThemeToggle } from "./layout/header/theme";
import { renderFooter } from "./layout/footer/footer";
import { renderHome, initHome } from "./content/home";
import { h, Fragment } from "./jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("home")}
    {renderHome()}
    {renderFooter()}
  </>
);

mountThemeToggle(document);
initHome();
