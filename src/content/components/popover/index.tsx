import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

// ---- Shared CSS building blocks reused (and shown in full, self-contained form) across demos below ----
//
// sx-popover portals to document.body on mount (see popover.ts), so a demo section's own scoped
// <style> (demo.tsx wraps every demos[].css in a `#section-id ...` prefix) can never reach it or
// its content — that ancestor relationship no longer exists once it's open. POPOVER_CSS below is
// shown/copied as-is in each demo's CSS tab (genuinely correct, unscoped, real-world CSS — exactly
// what a consumer would write in their own project), while index.scss carries the same rules
// globally/unscoped so the LIVE PREVIEW on this page still renders correctly despite that scoping.

const POPOVER_CSS = `sx-popover {
  font-size: 14px;
  color: #e1dcc9;
  background: #14161b;
  border-color: #2a2d33;
  padding-block: 20px;
}

sx-popover .menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
}
sx-popover .menu button,
sx-popover .menu sx-popover-trigger {
  text-align: left;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: none;
  color: inherit;
  font-size: 14px;
  cursor: pointer;
}
sx-popover .menu button:hover,
sx-popover .menu sx-popover-trigger:hover {
  background: #1a1c20;
}

/* nút site-wide (.btn--ghost) đặt cứng color: var(--text) — trên demo.html biến này bị ghim
   gần-đen, chìm mất trên nền tối cứng của sx-popover ở trên; ghi đè để ăn theo màu chữ sáng
   #e1dcc9 đã khai báo cho sx-popover. */
sx-popover .btn--ghost {
  color: inherit;
}`;

// sx-popover-trigger itself never portals, so this one is genuinely safe scoped per-demo.
const TRIGGER_INPUT_CSS = `sx-popover-trigger input {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #2a2d33;
  background: #14161b;
  color: #e1dcc9;
  font-size: 14px;
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

const POSITIONS = ["top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"];
// 12 cặp trigger/popover độc lập (thay vì 1 popover dùng chung) để tab HTML là code dùng thật được luôn, không lẫn dây nối riêng cho demo.
const positionPairsHtml = POSITIONS.map(
  (p) => `  <sx-popover-trigger class="btn btn--ghost btn--sm" name="pos-${p}">${p}</sx-popover-trigger>
  <sx-popover name="pos-${p}" position="${p}"><span>position="${p}"</span></sx-popover>`,
).join("\n\n");

export const popover: ComponentDoc = {
  slug: "popover",
  eyebrow: "sx-popover",
  title: "Popover",
  lead: "Panel nổi tự định vị quanh một trigger (tooltip, dropdown, menu...) — tự flip/shift để không tràn viewport, mở qua click/hover/focus hoặc điều khiển bằng JS.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-popover-trigger name="menu1">Mở menu</sx-popover-trigger>

<sx-popover name="menu1" position="bottom-start">
  <div class="menu">
    <button>Chỉnh sửa</button>
    <button>Xoá</button>
  </div>
</sx-popover>`)}

      <p class="note">
        <span class="c-accent">sx-popover</span> tự portal ra <code>document.body</code> khi mount (dù đang đóng) — luôn đo được kích thước thật để định vị, và <code>position: fixed</code> của nó không bị một
        ancestor <code>overflow</code>/<code>transform</code> nào giữa chỗ khai báo và <code>body</code> làm lệch hướng.
      </p>

      <h2>sx-popover</h2>
      {attrsTable([
        ["name", "string — khớp với sx-popover-trigger name", "—"],
        ["position", "top | top-start | top-end | right | right-start | right-end | bottom | bottom-start | bottom-end | left | left-start | left-end", "bottom"],
        ["effect", "fade | zoom | zoom-in | slide-up | slide-down | slide-left | slide-right | flip-x | flip-y", "zoom"],
        ["ease", 'tên easing cho component (xem trang <a href="/ease.html#component">Ease</a>), hoặc chuỗi CSS transition-timing-function bất kỳ (vd: ease-in-out, cubic-bezier(...))', "cubic-bezier(0.4, 0, 0.2, 1)"],
        ["duration", "số giây (vd: 0.15)", "0.2"],
        ["offset", "khoảng cách (px) giữa trigger và popover", "8"],
        ["flip", "tự chuyển sang phía đối diện nếu phía đang chọn không đủ chỗ", "true"],
        ["shift", "tự dịch theo trục ngang/dọc còn lại để không tràn viewport (không đổi phía, không đổi effect)", "true"],
        ["boundary-padding", "khoảng đệm tối thiểu (px) tới mép viewport khi shift", "8"],
        ["close-on-outside-click", "click ra ngoài (cả trigger lẫn content) tự đóng", "true"],
        ["close-on-esc-key", "phím Esc tự đóng (chỉ popover đang mở gần nhất)", "true"],
        ["breakpoints", "JSON theo container width, override các attribute trên — cùng cú pháp với sx-dialog", "—"],
      ])}
      <p>Lấy element bằng querySelector rồi điều khiển trực tiếp — ví dụ thực tế:</p>
      {codeBlock(
        `const popoverEl = document.querySelector('sx-popover[name="menu1"]');

if (!popoverEl.open) {
  popoverEl.show(); // cần đã có trigger neo vào trước đó ít nhất 1 lần (xem phần Event bên dưới)
}

// hoặc gọn hơn, không cần tự check trạng thái trước:
popoverEl.toggle();

// nội dung bên trong vừa đổi kích thước (vd load thêm dữ liệu) -> định vị lại cho đúng:
popoverEl.updatePosition();`,
        "js",
      )}

      <h2>sx-popover-trigger</h2>
      {attrsTable([
        ["name", "string — khớp với sx-popover name", "—"],
        ["trigger", "click | hover | focus | manual (manual: tự mở/đóng bằng JS, trigger chỉ lo aria-*, không tự bắn sự kiện mở/đóng)", "click"],
        ["open-delay", "độ trễ (ms) trước khi mở — chỉ áp dụng trigger=&quot;hover&quot;", "100"],
        ["close-delay", "độ trễ (ms) trước khi đóng — chỉ áp dụng trigger=&quot;hover&quot;, đủ để rê chuột từ trigger qua content không bị đóng giữa chừng", "100"],
      ])}
      <p class="note">Enter/Space luôn toggle được bất kể trigger mode nào — đảm bảo thao tác bàn phím dùng được cả khi trigger đang set hover/focus.</p>

      <h2>Event</h2>
      <p>4 event dưới đây bắn trên chính <span class="c-accent">sx-popover</span></p>
      {eventsTable([
        ["sx-popover-before-open", "bắn NGAY TRƯỚC khi mở (chưa mở) — cancelable, gọi preventDefault() để chặn"],
        ["sx-popover-after-open", "bắn NGAY SAU khi đã mở xong hẳn"],
        ["sx-popover-before-close", "bắn NGAY TRƯỚC khi đóng (chưa đóng) — cancelable, gọi preventDefault() để chặn"],
        ["sx-popover-after-close", "bắn NGAY SAU khi đã đóng xong hẳn"],
      ])}
      <p></p>
      {codeBlock(
        `const popoverEl = document.querySelector('sx-popover[name="menu1"]');

popoverEl.addEventListener('sx-popover-before-open', () => {
  console.log('sắp mở');
});

popoverEl.addEventListener('sx-popover-after-open', () => {
  console.log('đã mở xong'); // vd: tự focus vào input bên trong content
});

popoverEl.addEventListener('sx-popover-before-close', (e) => {
  // gọi e.preventDefault() ở đây để chặn không cho đóng
});

popoverEl.addEventListener('sx-popover-after-close', () => {
  console.log('đã đóng xong');
});`,
        "js",
      )}

      <p>
        3 event khác dưới đây <strong>không phải</strong> thông báo trạng thái — mà là <strong>yêu cầu</strong> mở/đóng, bắn trên <span class="c-accent">window</span> (không phải trên popover), mọi{" "}
        <span class="c-accent">sx-popover</span> có <code>name</code> khớp sẽ tự nghe thấy:
      </p>
      {eventsTable([
        ["sx-popover-toggle", "yêu cầu đảo trạng thái đang có — trigger tự bắn khi trigger=&quot;click&quot; được click"],
        ["sx-popover-show", "yêu cầu mở — trigger tự bắn khi hover/focus vào"],
        ["sx-popover-hide", "yêu cầu đóng — trigger tự bắn khi hover/focus rời đi"],
      ])}
      <p>Muốn mở bằng JS không qua trigger thì tự bắn lại đúng event này, kèm theo <code>triggerEl</code> để popover biết định vị theo đâu:</p>
      {codeBlock(
        `window.dispatchEvent(new CustomEvent('sx-popover-show', {
  detail: { name: 'menu1', triggerEl: someTriggerElement },
}));`,
        "js",
      )}
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Cơ bản (click)",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--primary" name="basic-popover">Mở popover</sx-popover-trigger>
  <sx-popover name="basic-popover" position="bottom">
    <div style="min-width:200px">
      <p style="margin:0 0 8px">Click ra ngoài hoặc nhấn Esc để đóng.</p>
    </div>
  </sx-popover>
</div>`,
      css: POPOVER_CSS,
    },
    {
      label: "12 vị trí (position)",
      html: `<div class="content-pane__panel" style="justify-content:center;padding:60px 0">
${positionPairsHtml}
</div>`,
      css: POPOVER_CSS,
    },
    {
      label: "offset (khoảng cách trigger-popover)",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--ghost btn--sm" name="offset-0">offset="0"</sx-popover-trigger>
  <sx-popover-trigger class="btn btn--ghost btn--sm" name="offset-8">offset="8" (mặc định)</sx-popover-trigger>
  <sx-popover-trigger class="btn btn--ghost btn--sm" name="offset-24">offset="24"</sx-popover-trigger>

  <sx-popover name="offset-0" position="bottom" offset="0"><span>offset="0"</span></sx-popover>
  <sx-popover name="offset-8" position="bottom" offset="8"><span>offset="8"</span></sx-popover>
  <sx-popover name="offset-24" position="bottom" offset="24"><span>offset="24"</span></sx-popover>
</div>`,
      css: POPOVER_CSS,
    },
    {
      label: "Hiệu ứng (effect)",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--primary" name="fx-fade">fade</sx-popover-trigger>
  <sx-popover-trigger class="btn btn--primary" name="fx-slide-up">slide-up</sx-popover-trigger>
  <sx-popover-trigger class="btn btn--primary" name="fx-flip-x">flip-x</sx-popover-trigger>

  <sx-popover name="fx-fade" effect="fade"><span>effect="fade"</span></sx-popover>
  <sx-popover name="fx-slide-up" effect="slide-up"><span>effect="slide-up"</span></sx-popover>
  <sx-popover name="fx-flip-x" effect="flip-x"><span>effect="flip-x"</span></sx-popover>
</div>`,
      css: POPOVER_CSS,
    },
    {
      label: "Trigger mode: hover / focus",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--ghost" name="hover-popover" trigger="hover">Rê chuột vào đây</sx-popover-trigger>
  <sx-popover name="hover-popover" position="top"><span>Mở khi hover, đóng sau close-delay khi rời chuột.</span></sx-popover>

  <sx-popover-trigger name="focus-popover" trigger="focus">
    <input type="text" placeholder="Focus vào input này" />
  </sx-popover-trigger>
  <sx-popover name="focus-popover" position="bottom-start"><span>Mở khi input được focus, đóng khi blur.</span></sx-popover>
</div>`,
      css: `${POPOVER_CSS}

${TRIGGER_INPUT_CSS}`,
    },
    {
      label: "flip tự né mép viewport",
      html: `<div class="content-pane__panel" style="justify-content:space-between">
  <sx-popover-trigger class="btn btn--ghost btn--sm" name="flip-left">Sát mép trái</sx-popover-trigger>
  <sx-popover-trigger class="btn btn--ghost btn--sm" name="flip-right">Sát mép phải</sx-popover-trigger>
</div>
<p class="note">Thu hẹp cửa sổ trình duyệt nếu chưa thấy flip — nó chỉ kích hoạt khi phía đang chọn thật sự không đủ chỗ.</p>
<sx-popover name="flip-left" position="left"><span style="display:block;min-width:160px">position="left" — hết chỗ bên trái thì tự sang phải.</span></sx-popover>
<sx-popover name="flip-right" position="right"><span style="display:block;min-width:160px">position="right" — hết chỗ bên phải thì tự sang trái.</span></sx-popover>`,
      css: POPOVER_CSS,
    },
    {
      label: "Manual + JS API",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--primary btn--sm" name="manual-popover" trigger="manual">Anchor (click không phản ứng)</sx-popover-trigger>
  <button class="btn btn--ghost btn--sm" data-manual-show>dispatch "sx-popover-show"</button>
  <button class="btn btn--ghost btn--sm" data-manual-hide>popoverEl.hide()</button>
  <button class="btn btn--ghost btn--sm" data-manual-toggle>popoverEl.toggle()</button>

  <!-- close-on-outside-click="false": các nút điều khiển nằm NGOÀI content của popover, nên mặc
       định (true) global-outside-click sẽ tự đóng popover ngay trên pointerdown của cú click đó -
       TRƯỚC KHI listener .toggle()/.hide() phía dưới kịp chạy - khiến .toggle() sau đó lại mở
       ngược trở lại. Demo này minh hoạ điều khiển hoàn toàn bằng JS nên tắt hẳn outside-click. -->
  <sx-popover name="manual-popover" position="bottom" close-on-outside-click="false">
    <span>Mở bằng CustomEvent (cần triggerEl để định vị lần đầu), đóng/toggle gọi thẳng method trên phần tử.</span>
  </sx-popover>
</div>`,
      css: POPOVER_CSS,
      js: `const anchor = document.querySelector('sx-popover-trigger[name="manual-popover"]');
const popoverEl = document.querySelector('sx-popover[name="manual-popover"]');

// Mở: bắn CustomEvent kèm triggerEl để popover biết định vị theo đâu
window.dispatchEvent(new CustomEvent('sx-popover-show', {
  detail: { name: 'manual-popover', triggerEl: anchor },
}));

// Đóng / đảo trạng thái: gọi thẳng method trên phần tử, không cần qua event nữa
popoverEl.hide();
popoverEl.toggle();`,
      initDemo: (root) => {
        const anchor = root.querySelector<HTMLElement>('sx-popover-trigger[name="manual-popover"]')!;
        const popoverEl = document.querySelector<any>('sx-popover[name="manual-popover"]');
        root.querySelector("[data-manual-show]")!.addEventListener("click", () => {
          window.dispatchEvent(new CustomEvent("sx-popover-show", { detail: { name: "manual-popover", triggerEl: anchor } }));
        });
        root.querySelector("[data-manual-hide]")!.addEventListener("click", () => popoverEl?.hide());
        root.querySelector("[data-manual-toggle]")!.addEventListener("click", () => popoverEl?.toggle());
      },
    },
    {
      label: "Lifecycle events",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--primary btn--sm" name="events-popover">Mở &amp; xem log</sx-popover-trigger>
</div>
<sx-popover name="events-popover" position="bottom"><span>Toggle vài lần để thấy log bên dưới.</span></sx-popover>
<div class="log" data-popover-log></div>`,
      css: `${POPOVER_CSS}

${LOG_CSS}`,
      js: `const popoverEl = document.querySelector('sx-popover[name="events-popover"]');

// bắn trên CHÍNH popover (không phải window) — sau khi trạng thái đã thực sự đổi
popoverEl.addEventListener('sx-popover-before-open', () => console.log('sắp mở'));
popoverEl.addEventListener('sx-popover-after-open', () => console.log('đã mở xong'));
popoverEl.addEventListener('sx-popover-before-close', () => console.log('sắp đóng'));
popoverEl.addEventListener('sx-popover-after-close', () => console.log('đã đóng xong'));`,
      initDemo: (root) => {
        const log = root.querySelector<HTMLElement>("[data-popover-log]")!;
        const popoverEl = document.querySelector('sx-popover[name="events-popover"]');
        const write = (msg: string) => {
          const line = document.createElement("div");
          line.textContent = msg;
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
        };
        for (const name of ["sx-popover-before-open", "sx-popover-after-open", "sx-popover-before-close", "sx-popover-after-close"]) {
          popoverEl?.addEventListener(name, () => write(name));
        }
      },
    },
    {
      label: "Popover lồng nhau",
      html: `<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--primary btn--sm" name="outer-popover">Mở menu</sx-popover-trigger>
</div>
<sx-popover name="outer-popover" position="bottom-start">
  <div class="menu">
    <button>Hành động A</button>
    <button>Hành động B</button>
    <sx-popover-trigger name="inner-popover" trigger="hover">Thêm ▸</sx-popover-trigger>
  </div>
</sx-popover>
<sx-popover name="inner-popover" position="right-start">
  <div class="menu">
    <button>Hành động con 1</button>
    <button>Hành động con 2</button>
  </div>
</sx-popover>`,
      css: POPOVER_CSS,
    },
    {
      label: "Breakpoints (responsive)",
      html: `<p class="note">
  breakpoints tính theo min-width, giống mobile-first: attribute gốc (position="bottom") là baseline
  nhỏ nhất, mốc 567 áp dụng khi viewport ĐẠT tới đó trở lên — mở rộng cửa sổ để thấy override, thu
  hẹp xuống dưới 567px để quay lại baseline.
</p>
<div class="content-pane__panel">
  <sx-popover-trigger class="btn btn--primary btn--sm" name="responsive-popover">Breakpoints</sx-popover-trigger>
</div>
<sx-popover
  name="responsive-popover"
  position="bottom"
  breakpoints="{
    567: {
      position: 'top',
      effect: 'slide-down'
    }
  }"
>
  <span>Từ 567px trở lên: position đổi thành "top", effect đổi thành "slide-down".</span>
</sx-popover>`,
      css: POPOVER_CSS,
    },
  ],
};
