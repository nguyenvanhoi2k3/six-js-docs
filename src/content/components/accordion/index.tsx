import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

// ---- Shared CSS building blocks reused (and shown in full, self-contained form) across demos below ----

const ACCORDION_CSS = `sx-accordion {
  display: block;
  width: min(100%, 560px);
  border: 1px solid #2a2d33;
  border-radius: 10px;
  overflow: hidden;
  background: #14161b;
  color: #e1dcc9;
}

sx-accordion-item {
  border-bottom: 1px solid #2a2d33;
}
sx-accordion-item:last-child {
  border-bottom: none;
}

sx-accordion-trigger {
  padding: 16px 20px;
  font-weight: 600;
}
sx-accordion-trigger:hover {
  background: #1a1c20;
}
sx-accordion-trigger[aria-disabled="true"]:hover {
  background: none;
}

sx-accordion-trigger::after {
  content: "";
  flex-shrink: 0;
  width: 0.5em;
  height: 0.5em;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform var(--sx-accordion-duration, 250ms) ease;
}
sx-accordion-item[sx-open] > sx-accordion-trigger::after {
  transform: rotate(-135deg);
}

.sx-accordion-content-inner {
  padding: 0 20px 16px;
  color: #a8a29a;
  font-size: 14px;
  line-height: 1.6;
}
.sx-accordion-content-inner p {
  margin: 0 0 8px;
}`;

export const accordion: ComponentDoc = {
  slug: "accordion",
  eyebrow: "sx-accordion",
  title: "Accordion",
  lead: "Danh sách mục mở/đóng — single-select (mở 1 đóng phần còn lại) hoặc multiple, điều hướng bàn phím theo chuẩn WAI-ARIA.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-accordion>
  <sx-accordion-item sx-open>
    <sx-accordion-trigger>six-js là gì?</sx-accordion-trigger>
    <sx-accordion-content>
      Một animation engine nhỏ gọn kèm vài web
      component độc lập, framework-agnostic như accordion này.
    </sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item disabled>
    <sx-accordion-trigger>Mục này bị disabled</sx-accordion-trigger>
    <sx-accordion-content>Không thể focus hay mở mục này.</sx-accordion-content>
  </sx-accordion-item>
</sx-accordion>`)}
      <h2>sx-accordion</h2>
      {attrsTable([
        ["multiple", "cho phép nhiều mục mở cùng lúc — bỏ qua thì chỉ 1 mục mở tại một thời điểm (mở mục khác tự đóng mục đang mở)", "false"],
        ["duration", "số giây cho animation mở/đóng (ghi ra CSS var --sx-accordion-duration)", "0.25"],
      ])}

      <h2>sx-accordion-item</h2>
      <p>
        Bọc một cặp <span class="c-accent">sx-accordion-trigger</span> + <span class="c-accent">sx-accordion-content</span>.
      </p>
      {attrsTable([
        ["sx-open", "có mặt = mục mở sẵn khi mount", "—"],
        ["disabled", "chặn click/phím, không cho mở/đóng", "false"],
        ["value", "chuỗi định danh mục, đọc lại qua detail.value của các event bên dưới — bỏ qua thì dùng id của trigger", "—"],
      ])}

      <p>Lấy element bằng querySelector rồi điều khiển trực tiếp — ví dụ thực tế:</p>
      {codeBlock(
        `const item = document.querySelector('sx-accordion-item[value="q1"]');

if (item.disabled) {
  console.log('mục này đang bị khoá, bỏ qua');
} else if (item.open) {
  item.hide(); // đang mở -> đóng lại
} else {
  item.show(); // đang đóng -> mở ra
}

// hoặc gọn hơn, không cần tự check trạng thái trước:
item.toggle();

console.log('vừa thao tác mục:', item.value);`,
        "js",
      )}

      <h2>Event</h2>
      {eventsTable([
        ["sx-accordion-before-open", "được gọi NGAY TRƯỚC khi mở (chưa mở) — cancelable, gọi preventDefault() để chặn"],
        ["sx-accordion-after-open", "được gọi NGAY SAU khi đã mở xong hẳn"],
        ["sx-accordion-before-close", "được gọi NGAY TRƯỚC khi đóng (chưa đóng) — cancelable, gọi preventDefault() để chặn"],
        ["sx-accordion-after-close", "được gọi NGAY SAU khi đã đóng xong hẳn"],
      ])}
      <p>
        Được gọi trên chính <span class="c-accent">sx-accordion-item</span> vừa toggle. Vì có <code>bubbles: true</code> nên chỉ cần gắn listener một lần ở <span class="c-accent">sx-accordion</span> cha (hoặc cả{" "}
        <code>document</code>) là bắt được sự kiện từ mọi item bên trong, không cần lặp qua từng item:
      </p>
      {codeBlock(
        `const accordionEl = document.querySelector('sx-accordion');

accordionEl.addEventListener('sx-accordion-before-open', (e) => {
  console.log('sắp mở:', e.detail.value);
});

accordionEl.addEventListener('sx-accordion-after-open', (e) => {
  console.log('đã mở xong:', e.detail.value); // vd: load nội dung lazy ngay tại đây
});

accordionEl.addEventListener('sx-accordion-before-close', (e) => {
  if (!confirm('Chắc chắn đóng?')) e.preventDefault(); // huỷ, không cho đóng nữa
});

accordionEl.addEventListener('sx-accordion-after-close', (e) => {
  console.log('đã đóng xong:', e.detail.value);
});`,
        "js",
      )}
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Single-select (mặc định)",
      html: `<sx-accordion>
  <sx-accordion-item>
    <sx-accordion-trigger>six-js là gì?</sx-accordion-trigger>
    <sx-accordion-content>Một animation engine nhỏ gọn kèm vài web component độc lập, framework-agnostic như accordion này.</sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item sx-open>
    <sx-accordion-trigger>Có hỗ trợ bàn phím không?</sx-accordion-trigger>
    <sx-accordion-content>Có — Enter/Space toggle trigger đang focus, ArrowUp/ArrowDown/Home/End chuyển focus giữa các trigger, theo đúng mẫu WAI-ARIA Accordion.</sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item>
    <sx-accordion-trigger>Đóng được hết tất cả không?</sx-accordion-trigger>
    <sx-accordion-content>Ở chế độ single-select, click lại trigger đang mở sẽ đóng nó — có thể không còn mục nào mở.</sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item disabled>
    <sx-accordion-trigger>Mục này bị disabled</sx-accordion-trigger>
    <sx-accordion-content>Không thể focus hay mở mục này.</sx-accordion-content>
  </sx-accordion-item>
</sx-accordion>`,
      css: ACCORDION_CSS,
    },
    {
      label: "multiple — mở độc lập",
      html: `<sx-accordion multiple>
  <sx-accordion-item sx-open>
    <sx-accordion-trigger>Mục A</sx-accordion-trigger>
    <sx-accordion-content>Nội dung A có thể mở cùng lúc với B và C.</sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item sx-open>
    <sx-accordion-trigger>Mục B</sx-accordion-trigger>
    <sx-accordion-content>Nội dung B, độc lập với các mục còn lại.</sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item>
    <sx-accordion-trigger>Mục C</sx-accordion-trigger>
    <sx-accordion-content>Thử mở mục này trong khi A/B vẫn đang mở.</sx-accordion-content>
  </sx-accordion-item>
</sx-accordion>
<div class="content-pane__panel">
  <button class="btn btn--ghost btn--sm" data-accordion-open-all>Mở hết (.open = true)</button>
  <button class="btn btn--ghost btn--sm" data-accordion-close-all>Đóng hết (.hide())</button>
</div>`,
      css: ACCORDION_CSS,
      js: `const accordionEl = document.querySelector('sx-accordion[multiple]');

// Mở tất cả các mục
accordionEl.querySelectorAll(':scope > sx-accordion-item').forEach((item) => {
  item.open = true;
});

// Đóng tất cả các mục
accordionEl.querySelectorAll(':scope > sx-accordion-item').forEach((item) => {
  item.hide();
});`,
      initDemo: (root) => {
        const acc = root.querySelector("sx-accordion[multiple]")!;
        root.querySelector("[data-accordion-open-all]")!.addEventListener("click", () => {
          acc.querySelectorAll(":scope > sx-accordion-item").forEach((item: any) => (item.open = true));
        });
        root.querySelector("[data-accordion-close-all]")!.addEventListener("click", () => {
          acc.querySelectorAll(":scope > sx-accordion-item").forEach((item: any) => item.hide());
        });
      },
    },
    {
      label: "duration tuỳ chỉnh",
      html: `<sx-accordion duration="0.6">
  <sx-accordion-item sx-open>
    <sx-accordion-trigger>Mở chậm 600ms, panel cao</sx-accordion-trigger>
    <sx-accordion-content>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda fugit iure repellendus voluptatum, cum illo ipsum est a nobis.</p>
      <p>Chiều cao animate đúng theo kích thước thật của nội dung, không cố định trước.</p>
    </sx-accordion-content>
  </sx-accordion-item>
  <sx-accordion-item>
    <sx-accordion-trigger>Một mục ngắn, cùng accordion</sx-accordion-trigger>
    <sx-accordion-content>Nội dung ngắn, vẫn dùng chung duration 600ms.</sx-accordion-content>
  </sx-accordion-item>
</sx-accordion>`,
      css: ACCORDION_CSS,
    },
  ],
};
