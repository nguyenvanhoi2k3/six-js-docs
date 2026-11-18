import "../auth/gate";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderNotes, initNotes } from "../content/notes";
import { mountCodeCopy } from "../content/shared";
import { renderFooter } from "../layout/footer/footer";
import { h, Fragment } from "../jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("notes")}
    <div class="np-layout">{renderNotes()}</div>
    {renderFooter()}
  </>
);

mountThemeToggle(document);
mountCodeCopy();
initNotes(document.querySelector<HTMLElement>(".np-layout")!);
