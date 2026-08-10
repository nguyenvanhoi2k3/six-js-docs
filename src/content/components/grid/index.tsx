import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

// ---- Shared CSS building blocks reused (and shown in full, self-contained form) across demos below ----

const ITEM_CSS = `.item {
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  user-select: none;
}`;

const RESIZE_FRAME_CSS = `.resize-frame {
  resize: horizontal;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  min-width: 280px;
  padding: 12px;
  border: 1px dashed #999;
}`;

const CONTROLS_CSS = `.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

sx-grid-controls-trigger {
  padding: 6px 14px;
  border: 1px solid #999;
  cursor: pointer;
}

sx-grid-controls-trigger[sx-active] {
  background: #000;
  color: #fff;
  border-color: #000;
}`;

const mkItems = (n: number, tag: "div" | "sx-grid-item" = "div"): string =>
  Array.from({ length: n }, (_, i) => `  <${tag} class="item">${i + 1}</${tag}>`).join("\n");

export const grid: ComponentDoc = {
  slug: "grid",
  eyebrow: "sx-grid",
  title: "Grid",
  lead: "Layout dạng lưới linh hoạt — chia cột cố định, tự động theo min-item-width, hoặc responsive theo breakpoint viewport; hỗ trợ masonry, col-span/row-span, và đổi số cột bằng sx-grid-controls.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-grid xs="1" md="2" lg="3" gap="16">
  <sx-grid-item>Item 1</sx-grid-item>
  <sx-grid-item>Item 2</sx-grid-item>
  <sx-grid-item>Item 3</sx-grid-item>
</sx-grid>`)}

      <h2>sx-grid</h2>
      {attrsTable([
        ["mode", 'grid | masonry — masonry tự pack item theo chiều cao thực (shortest-column-first)', "grid"],
        ["name", "định danh grid — dùng khi ghép với sx-grid-controls ở ngoài", "—"],
        ["columns", "số cột cố định", "—"],
        ["gap", "khoảng cách giữa các ô, tính bằng px", "16"],
        ["column-gap", "khoảng cách theo chiều ngang — ghi đè gap", "theo gap"],
        ["row-gap", "khoảng cách theo chiều dọc — ghi đè gap", "theo gap"],
        ["min-item-width", "chiều rộng tối thiểu mỗi item (px) — tự tính số cột vừa khít chiều rộng của chính sx-grid", "—"],
        ["fill", 'balanced | sequential — cách phân bổ item vào cột khi mode="masonry"', "balanced"],
        ["xs / sm / md / lg / xl / xxl", "số cột theo breakpoint viewport (mobile-first) — có mặt bất kỳ cái nào sẽ ưu tiên hơn columns, min-item-width và breakpoints", "—"],
        ["breakpoints", "JSON theo chiều rộng của chính sx-grid, ghi đè columns/gap/column-gap/row-gap/min-item-width/fill", "—"],
      ])}
      <p class="note">Không khai báo cột nào ở trên (columns, min-item-width, breakpoints, xs...xxl) thì mỗi item tự giữ nguyên chiều rộng và tự xuống dòng.</p>

      <h2>sx-grid-item</h2>
      <p class="note">
        Item con của <span class="c-accent">sx-grid</span> — dùng thẻ này (thay vì div thường) khi cần col-span/row-span, span theo breakpoint, order, hoặc <span class="c-accent">mode="masonry"</span>.
      </p>
      {attrsTable([
        ["col-span", "số cột chiếm dụng (dùng cùng columns cố định trên sx-grid)", "1"],
        ["row-span", "số hàng chiếm dụng", "1"],
        ["xs / sm / md / lg / xl / xxl", "span theo breakpoint, tính trên nền 12 cột (kiểu Bootstrap) — dùng bất kỳ cái nào sẽ chuyển cả sx-grid cha sang chia 12 cột", "—"],
        ["order", "thứ tự hiển thị ở mọi kích thước", "0"],
        ["order-xs / order-sm / order-md / order-lg / order-xl / order-xxl", "thứ tự hiển thị theo breakpoint viewport (mobile-first)", "—"],
      ])}
      <p class="note">col-span/row-span, span theo breakpoint và order đều không có tác dụng ở <span class="c-accent">mode="masonry"</span>.</p>

      <h2>sx-grid-controls / sx-grid-controls-trigger</h2>
      <p class="note">
        Bộ nút đổi số cột cho một <span class="c-accent">sx-grid</span> khác, ghép qua attribute <span class="c-accent">name</span> (giống aria-controls).
      </p>
      {codeBlock(`<sx-grid-controls name="my-grid">
  <sx-grid-controls-trigger device="xs" column="1">1</sx-grid-controls-trigger>
  <sx-grid-controls-trigger device="xs" column="3" sx-active>3</sx-grid-controls-trigger>
</sx-grid-controls>

<sx-grid name="my-grid" columns="1">
  ...
</sx-grid>`)}
      {attrsTable([["name", "name của sx-grid cần điều khiển", "—"]])}
      {attrsTable([
        ["device", "xs | sm | md | lg | xl | xxl — trigger chỉ hiện từ ngưỡng viewport này trở lên", "xs"],
        ["column", "số cột áp dụng cho sx-grid khi trigger này được chọn", "1"],
        ["sx-active", "có mặt = trigger được chọn mặc định khi mount", "—"],
      ])}
      <p class="note">Lựa chọn được lưu vào localStorage theo name — reload trang vẫn giữ đúng số cột đã chọn.</p>

      <h2>Method</h2>
      <p class="note">
        Lấy element <span class="c-accent">sx-grid</span> qua <span class="c-accent">querySelector</span> để ép số cột trực tiếp bằng JS, không cần qua sx-grid-controls.
      </p>
      {codeBlock(
        `const grid = document.querySelector('sx-grid[name="my-grid"]');

grid.overrideColumns(4); // ép cứng 4 cột, bỏ qua columns/xs...xxl/breakpoints — tự trượt mượt vào vị trí mới

grid.overrideColumns(4, false); // giống trên nhưng snap tức thì, không trượt

grid.overrideColumns(null); // gỡ ép, trả lại theo cấu hình ban đầu`,
        "js",
      )}
      <table class="content-pane__attrs">
        <thead>
          <tr>
            <th>Method</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>overrideColumns(columns, animate?)</td>
            <td>ép số cột hiện tại; truyền null để gỡ ép. animate mặc định true (trượt mượt), truyền false để snap tức thì</td>
          </tr>
        </tbody>
      </table>
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Mặc định",
      html: `<sx-grid gap="12">
  <div class="item" style="width:220px">1</div>
  <div class="item" style="width:140px">2</div>
  <div class="item" style="width:300px">3</div>
  <div class="item" style="width:180px">4</div>
</sx-grid>`,
      css: ITEM_CSS,
    },
    {
      label: "Cột cố định",
      html: `<sx-grid columns="3" gap="12">
${mkItems(6)}
</sx-grid>`,
      css: ITEM_CSS,
    },
    {
      label: "Responsive theo viewport",
      html: `<sx-grid xs="1" sm="2" md="3" gap="12">
${mkItems(6)}
</sx-grid>
<p class="note">Resize cửa sổ trình duyệt để xem số cột đổi theo breakpoint.</p>`,
      css: ITEM_CSS,
    },
    {
      label: "min-item-width",
      html: `<div class="resize-frame">
  <sx-grid min-item-width="140" gap="12">
${mkItems(8)}
  </sx-grid>
</div>
<p class="note">Kéo góc dưới-phải khung để đổi chiều rộng — số cột tự tính lại.</p>`,
      css: `${RESIZE_FRAME_CSS}

${ITEM_CSS}`,
    },
    {
      label: "breakpoints (JSON)",
      html: `<div class="resize-frame">
  <sx-grid gap="12" columns="1" breakpoints="{0: {columns: 1}, 420: {columns: 2}, 640: {columns: 3}}">
${mkItems(6)}
  </sx-grid>
</div>
<p class="note">Breakpoint tính theo chiều rộng của chính sx-grid, không phải viewport.</p>`,
      css: `${RESIZE_FRAME_CSS}

${ITEM_CSS}`,
    },
    {
      label: "col-span / row-span",
      html: `<sx-grid columns="4" gap="12">
  <sx-grid-item col-span="2" row-span="2" class="item">span 2x2</sx-grid-item>
  <sx-grid-item class="item">2</sx-grid-item>
  <sx-grid-item class="item">3</sx-grid-item>
  <sx-grid-item col-span="2" class="item">span 2x1</sx-grid-item>
  <sx-grid-item class="item">5</sx-grid-item>
  <sx-grid-item class="item">6</sx-grid-item>
</sx-grid>`,
      css: ITEM_CSS,
    },
    {
      label: "Span theo breakpoint",
      html: `<sx-grid gap="12">
  <sx-grid-item xs="12" md="6" lg="3" class="item">1</sx-grid-item>
  <sx-grid-item xs="12" md="6" lg="3" class="item">2</sx-grid-item>
  <sx-grid-item xs="12" md="6" lg="3" class="item">3</sx-grid-item>
  <sx-grid-item xs="12" md="6" lg="3" class="item">4</sx-grid-item>
</sx-grid>
<p class="note">Resize cửa sổ trình duyệt để xem span đổi theo breakpoint.</p>`,
      css: ITEM_CSS,
    },
    {
      label: "Order cố định",
      html: `<sx-grid columns="3" gap="12">
  <sx-grid-item order="2" class="item">1</sx-grid-item>
  <sx-grid-item order="0" class="item">2</sx-grid-item>
  <sx-grid-item order="1" class="item">3</sx-grid-item>
</sx-grid>
<p class="note">order cố định — thứ tự hiển thị luôn là 2, 3, 1</p>`,
      css: ITEM_CSS,
    },
    {
      label: "Order theo breakpoint",
      html: `<sx-grid xs="1" md="3" gap="12">
  <sx-grid-item order-xs="1" order-md="0" class="item">1</sx-grid-item>
  <sx-grid-item class="item">2</sx-grid-item>
  <sx-grid-item order-xs="-1" order-md="0" class="item">3</sx-grid-item>
</sx-grid>
<p class="note">order: số nhỏ hơn lên trước, số lớn hơn lùi sau; cùng order thì giữ nguyên thứ tự, không set gì thì mặc định order: 0.</p>`,
      css: ITEM_CSS,
    },
    {
      label: 'mode="masonry"',
      html: `<sx-grid mode="masonry" columns="4" gap="12">
  <sx-grid-item class="item" style="height:70px">1</sx-grid-item>
  <sx-grid-item class="item" style="height:140px">2</sx-grid-item>
  <sx-grid-item class="item" style="height:100px">3</sx-grid-item>
  <sx-grid-item class="item" style="height:190px">4</sx-grid-item>
  <sx-grid-item class="item" style="height:80px">5</sx-grid-item>
  <sx-grid-item class="item" style="height:150px">6</sx-grid-item>
  <sx-grid-item class="item" style="height:110px">7</sx-grid-item>
  <sx-grid-item class="item" style="height:60px">8</sx-grid-item>
</sx-grid>`,
      css: `.item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e4e4e4;
  user-select: none;
}`,
    },
    {
      label: "sx-grid-controls",
      html: `<div class="controls">
  <sx-grid-controls name="grid-demo">
    <sx-grid-controls-trigger device="xs" column="1">1</sx-grid-controls-trigger>
    <sx-grid-controls-trigger device="xs" column="2" sx-active>2</sx-grid-controls-trigger>
    <sx-grid-controls-trigger device="xs" column="3">3</sx-grid-controls-trigger>
    <sx-grid-controls-trigger device="xs" column="4">4</sx-grid-controls-trigger>
  </sx-grid-controls>
</div>
<sx-grid name="grid-demo" columns="2" gap="12">
${mkItems(8, "sx-grid-item")}
</sx-grid>`,
      css: `${CONTROLS_CSS}

${ITEM_CSS}`,
    },
  ],
};
