import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

// ---- Shared CSS building blocks reused (and shown in full, self-contained form) across demos below ----
//
// sx-tooltip portals its floating bubble to document.body on mount (see tooltip.ts), so a demo
// section's own scoped <style> (demo.tsx wraps every demos[].css in a `#section-id ...` prefix) can
// never reach `.sx-tooltip-bubble`/`.sx-tooltip-surface` — that ancestor relationship no longer
// exists once it's there. The constants below are shown/copied as-is in each demo's CSS tab (real,
// unscoped CSS a consumer would actually write), while index.scss carries the same rules globally
// so the LIVE PREVIEW on this page still renders correctly despite that scoping — same split
// popover's own doc page uses for the exact same reason.

const ICON_BTN_CSS = `.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 16px;
}
.icon-btn:hover {
  background: var(--surface-2);
  border-color: var(--primary);
}`;

const VARIANT_CSS = `.sx-tooltip-bubble[data-variant="danger"] {
  --sx-tooltip-bg: #4a1414;
  --sx-tooltip-color: #ffd7d7;
}
.sx-tooltip-bubble[data-variant="brand"] {
  --sx-tooltip-bg: #78a5ee;
  --sx-tooltip-color: #061021;
}`;

const CELL_TABLE_CSS = `.cell-table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.cell-table > div {
  padding: 14px 6px;
  text-align: center;
  border-radius: 6px;
  background: #1c2030;
  border: 1px solid #2a2d33;
  font-size: 12px;
  cursor: default;
}
.cell-table > div:hover {
  border-color: #78a5ee;
}`;

const LOG_CSS = `.log {
  margin-top: 12px;
  width: min(100%, 420px);
  height: 120px;
  overflow-y: auto;
  background: #0f1013;
  border: 1px solid #2a2d33;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: monospace;
  font-size: 12px;
  color: #7ee787;
}`;

export const tooltip: ComponentDoc = {
  slug: "tooltip",
  eyebrow: "sx-tooltip",
  title: "Tooltip",
  lead: "Chú thích nhỏ hiện lên khi hover/focus vào một phần tử — tự định vị quanh trigger (12 vị trí, flip/shift, hiệu ứng) giống hệt sx-popover, có mũi tên trỏ, và không phá layout xung quanh.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-tooltip content="Xóa mục này">
  <button>🗑</button>
</sx-tooltip>`)}

      <p class="note">
        <span class="c-accent">sx-tooltip</span> có <code>display: contents</code> nên không tạo box riêng, không ảnh hưởng flex/grid xung quanh. Phần bong bóng nội dung là một phần tử riêng, tự portal ra{" "}
        <code>document.body</code> khi mount — luôn đo được kích thước thật để định vị, và <code>position: fixed</code> của nó không bị ancestor <code>overflow</code>/<code>transform</code> nào làm lệch hướng.
      </p>

      <h2>sx-tooltip</h2>
      {attrsTable([
        ["content", "text hiển thị — bỏ qua nếu có &lt;template&gt; con", "—"],
        ["for", "id của phần tử trigger đặt tách biệt (giống &lt;label for&gt;) — bỏ trống thì lấy luôn phần tử con đầu tiên (trừ template) làm trigger", "—"],
        ["position", "top | top-start | top-end | right | right-start | right-end | bottom | bottom-start | bottom-end | left | left-start | left-end", "top"],
        ["effect", "fade | zoom | zoom-in | slide-up | slide-down | slide-left | slide-right | flip-x | flip-y", "fade"],
        ["ease", 'tên easing cho component (xem trang <a href="ease.html#component">Ease</a>), hoặc chuỗi CSS transition-timing-function bất kỳ (vd: ease-in-out, cubic-bezier(...))', "cubic-bezier(0.4, 0, 0.2, 1)"],
        ["duration", "số giây (vd: 0.15)", "0.15"],
        ["offset", "khoảng cách (px) giữa trigger và tooltip", "8"],
        ["flip", "tự chuyển sang phía đối diện nếu phía đang chọn không đủ chỗ", "true"],
        ["shift", "tự dịch theo trục ngang/dọc còn lại để không tràn viewport (không đổi phía, không đổi effect)", "true"],
        ["boundary-padding", "khoảng đệm tối thiểu (px) tới mép viewport khi shift", "8"],
        ["arrow", "hiện mũi tên nhỏ trỏ về phía trigger", "true"],
        ["interactive", "giữ tooltip mở khi rê chuột từ trigger sang chính nội dung tooltip — cần bật nếu bên trong có link/nút bấm được", "false"],
        ["trigger", 'danh sách cách nhau bởi dấu phẩy: hover, focus, manual (vd trigger="focus,manual") — "manual": không tự mở/đóng, chỉ điều khiển bằng JS', "hover,focus"],
        ["open-delay", "số giây trễ trước khi mở — chỉ áp dụng khi trigger có &quot;hover&quot;", "0.15"],
        ["close-delay", "số giây trễ trước khi đóng — chỉ áp dụng khi trigger có &quot;hover&quot;", "0.1"],
        ["disabled", "tắt hẳn tooltip — nếu đang mở sẽ tự đóng ngay", "false"],
        ["variant", "token tùy ý, ghi ra data-variant trên bubble để CSS tự bắt theo (xem phần Style bên dưới)", "—"],
      ])}
      <p class="note">
        Focus bằng bàn phím (Tab) luôn mở ngay lập tức, không chờ <code>open-delay</code> — delay chỉ áp dụng cho hover chuột. Phím Esc đóng tooltip đang mở gần nhất.
      </p>
      <p class="note">
        Mặc định <span class="c-accent">fade</span> (chỉ opacity) chứ không phải <span class="c-accent">zoom</span> như sx-popover — mọi hiệu ứng scale đều làm cạnh xa của bubble phình ra một chút lúc vào,
        dễ thấy trên một khối nhỏ có mũi tên như tooltip hơn là trên popover. Muốn hiệu ứng zoom/slide/flip thì set <code>effect</code> tường minh.
      </p>

      <p>Lấy element bằng querySelector rồi điều khiển trực tiếp:</p>
      {codeBlock(
        `const tooltipEl = document.querySelector('sx-tooltip');

tooltipEl.show();
tooltipEl.hide();
tooltipEl.toggle();

// nội dung/kích thước vừa đổi -> định vị lại cho đúng
tooltipEl.updatePosition();

// đổi hẳn trigger đang neo - hữu ích khi dùng lại 1 tooltip cho nhiều phần tử
// (vd 1 bảng lớn, xem demo "Retarget động" bên dưới)
tooltipEl.anchor = someOtherElement;`,
        "js",
      )}

      <h2>Event</h2>
      <p>
        Được gọi trên chính thẻ <span class="c-accent">sx-tooltip</span> — lắng nghe bằng <code>addEventListener</code> như event DOM thường. Không có event dạng "yêu cầu" trên <code>window</code> như sx-popover
        — muốn mở/đóng từ đâu đó khác thì gọi thẳng <code>.show()</code>/<code>.hide()</code>/<code>.toggle()</code> trên element.
      </p>
      {eventsTable([
        ["sx-tooltip-before-show", "được gọi NGAY TRƯỚC khi mở (chưa mở) — cancelable, gọi preventDefault() để chặn"],
        ["sx-tooltip-show", "được gọi NGAY SAU khi đã mở xong"],
        ["sx-tooltip-before-hide", "được gọi NGAY TRƯỚC khi đóng (chưa đóng) — cancelable, gọi preventDefault() để chặn"],
        ["sx-tooltip-hide", "được gọi NGAY SAU khi đã đóng xong"],
      ])}
      {codeBlock(
        `const tooltipEl = document.querySelector('sx-tooltip');

tooltipEl.addEventListener('sx-tooltip-before-show', (e) => {
  // e.preventDefault() ở đây để chặn không cho mở
});
tooltipEl.addEventListener('sx-tooltip-show', () => console.log('đã mở xong'));
tooltipEl.addEventListener('sx-tooltip-hide', () => console.log('đã đóng xong'));`,
        "js",
      )}

      <h2>Style</h2>
      <p>Toàn bộ giao diện là CSS custom properties trên <code>.sx-tooltip-surface</code> — không Shadow DOM nên ghi đè bằng CSS thường của chính bạn là đủ, không cần đụng vào source thư viện.</p>
      {codeBlock(
        `--sx-tooltip-bg
--sx-tooltip-color
--sx-tooltip-font-size
--sx-tooltip-padding
--sx-tooltip-radius
--sx-tooltip-shadow
--sx-tooltip-max-width
--sx-tooltip-arrow-size`,
        "css",
      )}
      <p>
        Gắn <code>variant</code> để tooltip tự thêm <code>data-variant="..."</code> lên bubble, tiện làm hook CSS theo ngữ cảnh:
      </p>
      {codeBlock(`<sx-tooltip content="Không thể hoàn tác" variant="danger">
  <button>Xóa vĩnh viễn</button>
</sx-tooltip>`)}
      {codeBlock(VARIANT_CSS, "css")}
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Cơ bản",
      html: `<div class="content-pane__panel">
  <sx-tooltip content="Xóa mục này">
    <button class="icon-btn">🗑</button>
  </sx-tooltip>
  <sx-tooltip content="Thêm vào yêu thích" position="bottom">
    <button class="icon-btn">♥</button>
  </sx-tooltip>
  <sx-tooltip content="Chia sẻ liên kết" position="right">
    <button class="icon-btn">🔗</button>
  </sx-tooltip>
</div>`,
      css: ICON_BTN_CSS,
    },
    {
      label: "12 vị trí + tự flip/shift",
      html: `<div class="grid-compass">
  <sx-tooltip content="Căn theo mép trái của trigger (top-start)" position="top-start"><button class="icon-btn" style="font-size:11px">TS</button></sx-tooltip>
  <sx-tooltip content="Căn giữa trigger theo chiều ngang (top)" position="top"><button class="icon-btn" style="font-size:11px">T</button></sx-tooltip>
  <sx-tooltip content="Căn theo mép phải của trigger (top-end)" position="top-end"><button class="icon-btn" style="font-size:11px">TE</button></sx-tooltip>

  <sx-tooltip content="Căn theo mép trên của trigger (left-start)" position="left-start"><button class="icon-btn" style="font-size:11px">LS</button></sx-tooltip>
  <span></span>
  <sx-tooltip content="Căn theo mép trên của trigger (right-start)" position="right-start"><button class="icon-btn" style="font-size:11px">RS</button></sx-tooltip>

  <sx-tooltip content="Căn giữa trigger theo chiều dọc (left)" position="left"><button class="icon-btn" style="font-size:11px">L</button></sx-tooltip>
  <span class="center-mark"></span>
  <sx-tooltip content="Căn giữa trigger theo chiều dọc (right)" position="right"><button class="icon-btn" style="font-size:11px">R</button></sx-tooltip>

  <sx-tooltip content="Căn theo mép dưới của trigger (left-end)" position="left-end"><button class="icon-btn" style="font-size:11px">LE</button></sx-tooltip>
  <span></span>
  <sx-tooltip content="Căn theo mép dưới của trigger (right-end)" position="right-end"><button class="icon-btn" style="font-size:11px">RE</button></sx-tooltip>

  <sx-tooltip content="Căn theo mép trái của trigger (bottom-start)" position="bottom-start"><button class="icon-btn" style="font-size:11px">BS</button></sx-tooltip>
  <sx-tooltip content="Căn giữa trigger theo chiều ngang (bottom)" position="bottom"><button class="icon-btn" style="font-size:11px">B</button></sx-tooltip>
  <sx-tooltip content="Căn theo mép phải của trigger (bottom-end)" position="bottom-end"><button class="icon-btn" style="font-size:11px">BE</button></sx-tooltip>
</div>`,
      css: `${ICON_BTN_CSS}

.grid-compass {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, auto);
  gap: 28px 10px;
  justify-items: center;
  align-items: center;
  max-width: 460px;
  margin: 0 auto;
  padding: 24px 0;
}
.grid-compass .center-mark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}`,
    },
    {
      label: "Hiệu ứng (effect)",
      html: `<div class="content-pane__panel">
  <sx-tooltip content="fade (mặc định)" effect="fade"><button class="btn btn--ghost btn--sm">fade</button></sx-tooltip>
  <sx-tooltip content="zoom" effect="zoom"><button class="btn btn--ghost btn--sm">zoom</button></sx-tooltip>
  <sx-tooltip content="zoom-in" effect="zoom-in"><button class="btn btn--ghost btn--sm">zoom-in</button></sx-tooltip>
  <sx-tooltip content="slide-up" effect="slide-up"><button class="btn btn--ghost btn--sm">slide-up</button></sx-tooltip>
  <sx-tooltip content="slide-down" effect="slide-down"><button class="btn btn--ghost btn--sm">slide-down</button></sx-tooltip>
  <sx-tooltip content="slide-left" effect="slide-left"><button class="btn btn--ghost btn--sm">slide-left</button></sx-tooltip>
  <sx-tooltip content="slide-right" effect="slide-right"><button class="btn btn--ghost btn--sm">slide-right</button></sx-tooltip>
  <sx-tooltip content="flip-x" effect="flip-x"><button class="btn btn--ghost btn--sm">flip-x</button></sx-tooltip>
  <sx-tooltip content="flip-y" effect="flip-y"><button class="btn btn--ghost btn--sm">flip-y</button></sx-tooltip>
</div>`,
    },
    {
      label: "Nội dung phong phú (template) + interactive",
      html: `<div class="content-pane__panel">
  <sx-tooltip position="bottom" interactive open-delay="0.08">
    <button class="btn btn--primary btn--sm">Xem chi tiết đơn hàng</button>
    <template>
      <strong>Đơn #A1029</strong><br />
      Trạng thái: <em>Đang giao</em><br />
      <a href="#">Theo dõi đơn hàng →</a>
    </template>
  </sx-tooltip>
</div>
<p class="note">Không có <code>interactive</code>, rê chuột từ trigger sang link bên trong tooltip sẽ khiến nó đóng trước khi bấm được.</p>`,
    },
    {
      label: "Custom theme qua CSS variables (variant)",
      html: `<div class="content-pane__panel">
  <sx-tooltip content="Cảnh báo: hành động không thể hoàn tác" variant="danger" position="top">
    <button class="btn btn--ghost btn--sm">Xóa vĩnh viễn</button>
  </sx-tooltip>
  <sx-tooltip content="Gói Pro đang hoạt động" variant="brand" position="top">
    <button class="btn btn--ghost btn--sm">Nâng cấp</button>
  </sx-tooltip>
</div>`,
      css: VARIANT_CSS,
    },
    {
      label: "for tách rời + trigger mode",
      html: `<div class="content-pane__panel">
  <button class="btn btn--ghost btn--sm" id="tooltip-detached-anchor">Trigger ở đây</button>
</div>
<sx-tooltip for="tooltip-detached-anchor" content="Tooltip khai báo tách biệt hoàn toàn (for)" position="top"></sx-tooltip>

<div class="content-pane__panel">
  <sx-tooltip content="Chỉ hiện khi focus bằng bàn phím (Tab)" trigger="focus">
    <button class="btn btn--ghost btn--sm">Chỉ focus mới hiện</button>
  </sx-tooltip>
</div>

<div class="content-pane__panel">
  <sx-tooltip id="tooltip-manual-demo" content="Được điều khiển hoàn toàn bằng JS" trigger="manual" position="top">
    <button class="btn btn--primary btn--sm">Nút này im lặng</button>
  </sx-tooltip>
  <button class="btn btn--ghost btn--sm" data-manual-show>.show()</button>
  <button class="btn btn--ghost btn--sm" data-manual-hide>.hide()</button>
  <button class="btn btn--ghost btn--sm" data-manual-toggle>.toggle()</button>
</div>`,
      js: `const manualTip = document.getElementById('tooltip-manual-demo');

document.querySelector('[data-manual-show]').addEventListener('click', () => manualTip.show());
document.querySelector('[data-manual-hide]').addEventListener('click', () => manualTip.hide());
document.querySelector('[data-manual-toggle]').addEventListener('click', () => manualTip.toggle());`,
      initDemo: (root) => {
        const manualTip = root.querySelector<any>("#tooltip-manual-demo");
        root.querySelector("[data-manual-show]")!.addEventListener("click", () => manualTip?.show());
        root.querySelector("[data-manual-hide]")!.addEventListener("click", () => manualTip?.hide());
        root.querySelector("[data-manual-toggle]")!.addEventListener("click", () => manualTip?.toggle());
      },
    },
    {
      label: "Retarget động bằng .anchor",
      html: `<p class="note">Dùng lại 1 tooltip duy nhất cho nhiều ô — hữu ích cho bảng ảo hóa/canvas nơi không thể bọc từng phần tử. Di chuột qua từng ô bên dưới.</p>
<div class="cell-table" id="tooltip-cell-table">
  <div data-info="Doanh thu tháng 1: 120tr">Th.1</div>
  <div data-info="Doanh thu tháng 2: 98tr">Th.2</div>
  <div data-info="Doanh thu tháng 3: 145tr">Th.3</div>
  <div data-info="Doanh thu tháng 4: 132tr">Th.4</div>
  <div data-info="Doanh thu tháng 5: 160tr">Th.5</div>
  <div data-info="Doanh thu tháng 6: 171tr">Th.6</div>
  <div data-info="Doanh thu tháng 7: 155tr">Th.7</div>
  <div data-info="Doanh thu tháng 8: 180tr">Th.8</div>
</div>
<sx-tooltip id="tooltip-cell-tip" trigger="manual" position="top"></sx-tooltip>`,
      css: CELL_TABLE_CSS,
      js: `const cellTip = document.getElementById('tooltip-cell-tip');

for (const cell of document.querySelectorAll('#tooltip-cell-table > div')) {
  cell.addEventListener('pointerenter', () => {
    // Set content TRƯỚC khi đổi anchor: tooltip đang mở sẽ định vị lại ngay theo kích thước
    // MỚI, tránh 1 khung hình bị lệch vì còn tính theo kích thước cũ.
    cellTip.setAttribute('content', cell.dataset.info);
    cellTip.anchor = cell;
    cellTip.show();
  });
  cell.addEventListener('pointerleave', () => cellTip.hide());
}`,
      initDemo: (root) => {
        const cellTip = root.querySelector<any>("#tooltip-cell-tip");
        root.querySelectorAll<HTMLElement>("#tooltip-cell-table > div").forEach((cell) => {
          cell.addEventListener("pointerenter", () => {
            cellTip?.setAttribute("content", cell.dataset.info ?? "");
            if (cellTip) cellTip.anchor = cell;
            cellTip?.show();
          });
          cell.addEventListener("pointerleave", () => cellTip?.hide());
        });
      },
    },
    {
      label: "Lifecycle events",
      html: `<div class="content-pane__panel">
  <sx-tooltip id="tooltip-events-demo" content="Hover hoặc focus vào đây, xem log bên dưới" position="bottom">
    <button class="btn btn--primary btn--sm">Hover / Tab vào đây</button>
  </sx-tooltip>
</div>
<div class="log" data-tooltip-log></div>`,
      css: LOG_CSS,
      js: `const tooltipEl = document.getElementById('tooltip-events-demo');

tooltipEl.addEventListener('sx-tooltip-before-show', () => console.log('sắp mở'));
tooltipEl.addEventListener('sx-tooltip-show', () => console.log('đã mở xong'));
tooltipEl.addEventListener('sx-tooltip-before-hide', () => console.log('sắp đóng'));
tooltipEl.addEventListener('sx-tooltip-hide', () => console.log('đã đóng xong'));`,
      initDemo: (root) => {
        const log = root.querySelector<HTMLElement>("[data-tooltip-log]")!;
        const tooltipEl = root.querySelector("#tooltip-events-demo");
        const write = (msg: string) => {
          const line = document.createElement("div");
          line.textContent = msg;
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
        };
        for (const name of ["sx-tooltip-before-show", "sx-tooltip-show", "sx-tooltip-before-hide", "sx-tooltip-hide"]) {
          tooltipEl?.addEventListener(name, () => write(name));
        }
      },
    },
  ],
};
