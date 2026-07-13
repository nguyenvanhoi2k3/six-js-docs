import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";

export const dialog: ComponentDoc = {
  slug: "dialog",
  eyebrow: "sx-dialog",
  title: "Dialog",
  lead: "Modal/dialog web component với hiệu ứng vào/ra, kéo để đóng, và breakpoints responsive.",
  demoSidebar: false,
  render: () => `
    <h2>Code</h2>
    ${codeBlock(`<sx-dialog-trigger name="dialog1">Open</sx-dialog-trigger>

<sx-dialog 
  name="dialog1" 
  effect="zoom" 
  breakpoints="{
    567: {
      position: 'right',
      effect: 'slide-left'
    }
  }"
>
  <sx-close-cursor>x</sx-close-cursor>
  <div class="content" style="background: #fff">
    <h2>Dialog</h2>
    <div>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
      dolorum?
    </div>
    <sx-dialog-trigger name="dialog1">Đóng</sx-dialog-trigger>
  </div>
</sx-dialog>`)}

    <p class="note"> <span class="c-accent">sx-close-cursor</span> replace cursor mặc định khi di chuột vào vùng overlay (cần <span class="c-accent">close-on-outside-click="true"</span> để hiện).</p>
    <p class="note"> Cả <span class="c-accent">sx-dialog</span> và <span class="c-accent">sx-close-cursor</span> đều portal.</p>
    <h2>Attributes</h2>

    ${attrsTable([
      ["name", "string — khớp với sx-dialog-trigger name", "—"],
      [
        "effect",
        "fade | zoom | zoom-in | slide-up | slide-down | slide-left | slide-right | flip-x | flip-y",
        "zoom",
      ],
      [
        "position",
        "center | top | bottom | left | right | top-left | top-right | bottom-left | bottom-right",
        "center",
      ],
      ["duration", "số giây (vd: 0.3)", "0.3"],
      ["close-on-outside-click", "true | false", "true"],
      ["close-on-esc-key", "true | false", "true"],
      ["scrollable", "true | false — cho phép cuộn nền khi mở", "false"],
      ["overlay", "true | false", "true"],
      [
        "overlay-style",
        "chuỗi CSS inline cho lớp overlay",
        "background-color: rgba(0,0,0,0.5);",
      ],
      [
        "breakpoints",
        "JSON theo container width, override các attribute trên",
        "—",
      ],
      [
        "threshold (trên sx-dialog-pull)",
        "0 – 1, tỉ lệ khoảng cách kéo trước khi tự đóng",
        "0.25",
      ],
    ])}

<h2>sx-dialog-pull</h2>
Đặt bên trong <span class="c-accent">sx-dialog</span>. Hướng kéo để đóng dựa vào <span class="c-accent">position</span>
    ${codeBlock(`
<sx-dialog-pull></sx-dialog-pull>`)}
${attrsTable([
  [
    "threshold",
    "number (0–1), tỉ lệ % kích thước dialog cần kéo qua mới tự đóng",
    "0.25",
  ],
])}
  `,

  // ---- Demos: paste/edit the raw HTML inside each renderDemo() below ----
  demos: [
    {
      renderDemo: () => `
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="basic-demo">Mở dialog</sx-dialog-trigger>
        </div>

        <sx-dialog name="basic-demo" effect="zoom" position="center">
          <div class="card" style="width: min(420px, 80vw)">
            <h2>Xin chào</h2>
            <input type="text">
            <p>Click ra ngoài, hoặc nhấn Esc để đóng.</p>
            <sx-dialog-trigger class="btn btn--ghost" name="basic-demo">Đóng</sx-dialog-trigger>
          </div>
        </sx-dialog>
      `,
    },
    {
      renderDemo: () => `
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="fx-fade">fade</sx-dialog-trigger>
          <sx-dialog-trigger class="btn btn--primary" name="fx-zoom-in">zoom-in</sx-dialog-trigger>
          <sx-dialog-trigger class="btn btn--primary" name="fx-slide-up">slide-up</sx-dialog-trigger>
          <sx-dialog-trigger class="btn btn--primary" name="fx-flip-x">flip-x</sx-dialog-trigger>
        </div>

        <sx-dialog name="fx-fade" effect="fade" position="center">
          <div class="card" style="width: min(360px, 80vw)"><h2>effect="fade"</h2><sx-dialog-trigger class="btn btn--ghost" name="fx-fade">Đóng</sx-dialog-trigger></div>
        </sx-dialog>
        <sx-dialog name="fx-zoom-in" effect="zoom-in" position="center">
          <div class="card" style="width: min(360px, 80vw)"><h2>effect="zoom-in"</h2><sx-dialog-trigger class="btn btn--ghost" name="fx-zoom-in">Đóng</sx-dialog-trigger></div>
        </sx-dialog>
        <sx-dialog name="fx-slide-up" effect="slide-up">
          <div class="card" style="width: min(420px, 90vw)"><h2>effect="slide-up"</h2><sx-dialog-trigger class="btn btn--ghost" name="fx-slide-up">Đóng</sx-dialog-trigger></div>
        </sx-dialog>
        <sx-dialog name="fx-flip-x" effect="flip-x" position="center">
          <div class="card" style="width: min(360px, 80vw)"><h2>effect="flip-x"</h2><sx-dialog-trigger class="btn btn--ghost" name="fx-flip-x">Đóng</sx-dialog-trigger></div>
        </sx-dialog>
      `,
    },
    {
      renderDemo: () => `
        <div class="content-pane__panel">
          ${[
            "center",
            "top",
            "bottom",
            "left",
            "right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]
            .map(
              (p) =>
                `<button class="btn btn--ghost btn--sm" data-position="${p}">${p}</button>`,
            )
            .join("")}
        </div>

        <sx-dialog name="position-demo" effect="zoom" position="center">
          <div class="card" style="width: min(320px, 80vw)">
            <h2 id="pos-title">position</h2>
            <sx-dialog-trigger class="btn btn--ghost" name="position-demo">Đóng</sx-dialog-trigger>
          </div>
        </sx-dialog>
      `,
      // Only this demo needs JS: it swaps the `position` attribute before re-opening.
      initDemo: (root) => {
        const dialogEl = root.querySelector('sx-dialog[name="position-demo"]');
        const titleEl = root.querySelector("#pos-title");
        root
          .querySelectorAll<HTMLButtonElement>("[data-position]")
          .forEach((btn) => {
            btn.addEventListener("click", () => {
              const position = btn.dataset.position!;
              dialogEl?.setAttribute("position", position);
              if (titleEl) titleEl.textContent = `position="${position}"`;
              window.dispatchEvent(
                new CustomEvent("sx-dialog-toggle", {
                  detail: { name: "position-demo" },
                }),
              );
            });
          });
      },
    },
    {
      renderDemo: () => `
      <div class="flex gap-20">
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="pull-demo">Pull down</sx-dialog-trigger>
        </div>

        <sx-dialog name="pull-demo" effect="slide-up" position="bottom">
        <sx-dialog-pull></sx-dialog-pull>
          <div class="card" style="width: min(480px, 92vw)">
            <h2>Kéo xuống để đóng</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
          dolorum?</p>
          </div>
        </sx-dialog>

         <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="pull-demo2">Pull up</sx-dialog-trigger>
        </div>

        <sx-dialog name="pull-demo2" effect="slide-down" position="top">
          <div class="card" style="width: min(480px, 92vw)">
          <h2>Kéo lên để đóng</h2>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
          dolorum?</p>
          </div>
          <sx-dialog-pull></sx-dialog-pull>
        </sx-dialog>

        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="pull-demo3">Pull right</sx-dialog-trigger>
        </div>

        <sx-dialog name="pull-demo3" effect="slide-right" position="right">
        <div class="flex">
          <sx-dialog-pull></sx-dialog-pull>

          <div class="card" style="width: min(480px, 92vw)">
          <h2>Kéo sang phải để đóng</h2>
          <p>sx-dialog-pull {
      width: 6px;
      height: 100px;
    }</p>
          </div>
        </div>

        </sx-dialog>
      </div>
      `,
    },
    {
      renderDemo: () => `
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="dialog-demo-cursor">Cursor</sx-dialog-trigger>
        </div>

        <sx-dialog name="dialog-demo-cursor" effect="zoom" position="center">
         <sx-close-cursor><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"></path> </g></svg></sx-close-cursor>
          <div class="card" style="width: min(420px, 80vw)">
            <h2>Xin chào</h2>
            <p>Click ra ngoài, hoặc nhấn Esc để đóng.</p>
            <sx-dialog-trigger class="btn btn--ghost" name="dialog-demo-cursor">Đóng</sx-dialog-trigger>
          </div>
        </sx-dialog>
      `,
    },
    {
      renderDemo: () => `
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="nested-dialog">Nested Dialog</sx-dialog-trigger>
        </div>

        <sx-dialog name="nested-dialog" effect="zoom" position="center">
          <div class="card" style="width: min(420px, 80vw)">
            <h2>Nested Dialog</h2>
            <p>Click ra ngoài, hoặc nhấn Esc để đóng.</p>
            <sx-dialog-trigger class="btn btn--ghost" name="nested-dialog-2">Đóng</sx-dialog-trigger>
            <sx-dialog name="nested-dialog-2">
             <div class="card" style="width: min(320px, 80vw)">
           
            <div>
             Bạn chắc chắn muốn đóng modal chứ?
            </div>
            <sx-dialog-trigger class="btn btn--ghost" name="nested-dialog-2">No</sx-dialog-trigger>
            <sx-dialog-trigger class="btn btn--primary" name="nested-dialog">Yes</sx-dialog-trigger>
            </div>
            </sx-dialog>
          </div>
        </sx-dialog>
      `,
    },
    {
      renderDemo: () => `
      Co màn để xem
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="dialog-responsive">Breakpoints</sx-dialog-trigger>
        </div>

        <sx-dialog name="dialog-responsive" effect="slide-up" position="bottom"
        breakpoints="{
      567: {
        position: 'right',
        effect: 'slide-left'
      }
    }">
          <div class="dialog-cart">
          <sx-dialog-pull></sx-dialog-pull>
            <h2>Xin chào</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
          dolorum?</p>
          </div>
        </sx-dialog>
      `,
    },
  ],
};
