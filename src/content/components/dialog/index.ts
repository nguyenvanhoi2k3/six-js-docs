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
    ${codeBlock(`<sx-dialog-trigger name="basic-demo">Mở dialog</sx-dialog-trigger>

<sx-dialog name="basic-demo" effect="zoom" position="center">
  <sx-close-cursor>đóng</sx-close-cursor>
  <div class="card">
    <h2>Xin chào từ sx-dialog</h2>
    <sx-dialog-trigger name="basic-demo">Đóng</sx-dialog-trigger>
  </div>
</sx-dialog>`)}

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
  `,

  // ---- Demos: paste/edit the raw HTML inside each renderDemo() below ----
  demos: [
    {
      renderDemo: () => `
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="basic-demo">Mở dialog</sx-dialog-trigger>
        </div>

        <sx-dialog name="basic-demo" effect="zoom" position="center">
          <sx-close-cursor class="close-cursor">đóng</sx-close-cursor>
          <div class="card" style="width: min(420px, 80vw)">
            <h2>Xin chào từ sx-dialog</h2>
            <p>Kéo, click ra ngoài, hoặc nhấn Esc để đóng.</p>
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
        <sx-dialog name="fx-slide-up" effect="slide-up" position="bottom">
          <div class="card" style="width: min(420px, 90vw)"><h2>effect="slide-up"</h2><p>position="bottom" thường đi cùng slide-up/slide-down.</p><sx-dialog-trigger class="btn btn--ghost" name="fx-slide-up">Đóng</sx-dialog-trigger></div>
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
        <div class="content-pane__panel">
          <sx-dialog-trigger class="btn btn--primary" name="pull-demo">Mở bottom sheet</sx-dialog-trigger>
        </div>

        <sx-dialog name="pull-demo" effect="slide-up" position="bottom">
          <div class="card" style="width: min(480px, 92vw)">
            <sx-dialog-pull threshold="0.25" style="display:block;width:40px;height:4px;border-radius:999px;background:var(--border);margin:0 auto var(--space-2);"></sx-dialog-pull>
            <h2>Kéo xuống để đóng</h2>
            <p>Vuốt tay cầm phía trên xuống quá 25% chiều cao dialog (hoặc vuốt nhanh) để đóng.</p>
          </div>
        </sx-dialog>
      `,
    },
  ],
};
