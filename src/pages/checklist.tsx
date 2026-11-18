import "../auth/gate";
import "../styles/base.css";
import { renderHeader } from "../layout/header/header";
import { mountThemeToggle } from "../layout/header/theme";
import { renderChecklist, renderChecklistSidebar, initChecklist } from "../content/checklist";
import { renderFooter } from "../layout/footer/footer";
import { h, Fragment } from "../jsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = (
  <>
    {renderHeader("checklist")}
    <div class="section-layout">
      <aside class="section-sidebar checklist-sidebar" id="sidebar">
        {renderChecklistSidebar()}
      </aside>
      <main class="section-content" id="content">
        {renderChecklist()}
      </main>
    </div>
    {renderFooter()}
  </>
);

mountThemeToggle(document);
initChecklist(document.querySelector<HTMLElement>("#content")!, document.querySelector<HTMLElement>("#sidebar")!);
