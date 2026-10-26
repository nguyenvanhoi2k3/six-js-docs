import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const CARD_STYLE = "padding:20px;border-radius:10px;background:var(--surface);border:1px solid var(--border);min-width:160px";

export const fade: ComponentDoc = {
  slug: "fade",
  eyebrow: "sx-fade",
  title: "Fade",
  lead: "Reveal-on-scroll bằng CSS transition thuần — không đụng tới six.to()/Tween/Timeline, chỉ tự gắn một attribute khi element lọt vào viewport.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-fade type="fade-up">
  <h2>Section title</h2>
</sx-fade>`)}
      <p class="note">
        Mỗi <span class="c-accent">sx-fade</span> tự reveal chính nó — không có mode "animate các con bên trong". Muốn stagger nhiều khối thì bọc riêng từng khối và dùng <span class="c-accent">cascade</span> (xem bên dưới).
      </p>

      <h2>Attributes</h2>
      {attrsTable([
        ["type", "fade | fade-up | fade-down | fade-left | fade-right | zoom-in | zoom-out", "fade"],
        ["strength", "độ mạnh hiệu ứng — px đối với các type dịch chuyển, % scale đối với zoom-in/zoom-out", "tuỳ type"],
        ["duration", "thời gian transition, tính bằng giây", "0.4"],
        ["delay", "độ trễ trước khi bắt đầu, tính bằng giây", "0"],
        ["cascade", "boolean — stagger các sx-fade cùng lọt viewport trong 1 khung hình, theo đúng thứ tự trong DOM", "false"],
      ])}
      <p class="note">
        Tôn trọng <code>prefers-reduced-motion: reduce</code> — khi bật, nội dung hiện sẵn ở trạng thái cuối, không transition.
      </p>

      <h2>Method</h2>
      {attrsTable([[".replay()", "reset về trạng thái ẩn rồi reveal lại từ đầu — dùng khi 1 khối được hiện lại (vd chuyển tab) và cần animate lại", "—"]])}
      <p></p>
      {codeBlock(`document.querySelector('sx-fade[data-tab="2"]').replay();`, "js")}
    </>
  ),

  demos: [
    {
      renderDemo: () => (
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <sx-fade type="fade-up" style={CARD_STYLE}>
            fade-up
          </sx-fade>
          <sx-fade type="fade-down" style={CARD_STYLE}>
            fade-down
          </sx-fade>
          <sx-fade type="fade-left" style={CARD_STYLE}>
            fade-left
          </sx-fade>
          <sx-fade type="fade-right" style={CARD_STYLE}>
            fade-right
          </sx-fade>
          <sx-fade type="zoom-in" style={CARD_STYLE}>
            zoom-in
          </sx-fade>
          <sx-fade type="zoom-out" style={CARD_STYLE}>
            zoom-out
          </sx-fade>
        </div>
      ),
    },
    {
      renderDemo: () => (
        <>
          <h3>cascade</h3>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <sx-fade type="fade-up" cascade style={CARD_STYLE}>
              1
            </sx-fade>
            <sx-fade type="fade-up" cascade style={CARD_STYLE}>
              2
            </sx-fade>
            <sx-fade type="fade-up" cascade style={CARD_STYLE}>
              3
            </sx-fade>
            <sx-fade type="fade-up" cascade style={CARD_STYLE}>
              4
            </sx-fade>
          </div>
          <p class="note">4 khối lọt viewport cùng lúc — cascade tự giãn delay theo thứ tự DOM, không cần khai báo delay riêng từng cái.</p>
        </>
      ),
    },
    {
      label: "replay()",
      html: `<div class="content-pane__panel">
  <button class="btn btn--primary btn--sm" data-replay>replay()</button>
</div>
<sx-fade id="fadeReplay" type="zoom-in" style="${CARD_STYLE}">
  Bấm nút để xem lại hiệu ứng
</sx-fade>`,
      js: `document.querySelector('[data-replay]').addEventListener('click', () => {
  document.getElementById('fadeReplay').replay();
});`,
      initDemo: (root) => {
        const el = root.querySelector<HTMLElement & { replay(): void }>("#fadeReplay")!;
        root.querySelector("[data-replay]")!.addEventListener("click", () => el.replay());
      },
    },
  ],
};
