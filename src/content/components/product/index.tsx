import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const DEMO_CSS = `.product-demo fieldset {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  border: 0;
  padding: 0;
}

.product-demo label {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.product-demo input:checked + label,
.product-demo label:has(input:checked) {
  border-color: #ff7a45;
  color: #ff7a45;
}

.product-demo input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

sx-product[unavailable] sx-add-cart {
  opacity: 0.5;
  pointer-events: none;
}`;

export const product: ComponentDoc = {
  slug: "product",
  eyebrow: "sx-product",
  title: "Product",
  lead: "Form chọn variant Shopify theo nhiều option — khớp lựa chọn hiện tại với danh sách variant nhúng sẵn, phản ánh variant-id/unavailable, không cần tự viết logic match.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-product>
  <script type="application/json" data-sx-product-variants>
    [
      { "id": 111, "available": true,  "options": ["Đỏ", "S"] },
      { "id": 112, "available": false, "options": ["Đỏ", "M"] },
      { "id": 113, "available": true,  "options": ["Xanh", "S"] }
    ]
  </script>

  <fieldset>
    <label><input type="radio" name="color" data-option-index="0" data-option-value="Đỏ" checked> Đỏ</label>
    <label><input type="radio" name="color" data-option-index="0" data-option-value="Xanh"> Xanh</label>
  </fieldset>
  <fieldset>
    <label><input type="radio" name="size" data-option-index="1" data-option-value="S" checked> S</label>
    <label><input type="radio" name="size" data-option-index="1" data-option-value="M"> M</label>
  </fieldset>

  <sx-add-cart class="btn btn--primary">Thêm vào giỏ</sx-add-cart>
</sx-product>`)}
      <p class="note">
        <code>data-option-index</code> là vị trí option trong mảng <code>options</code> của từng variant (0, 1, 2...) — <code>data-option-value</code> là giá trị đang chọn ở option đó. Thiếu input nào cho 1 option thì option đó tự coi là <code>null</code> khi match.
      </p>
      <p class="note">
        <span class="c-accent">sx-add-cart</span> nằm trong không cần khai <code>variant-id</code> — tự đọc từ <span class="c-accent">sx-product</span> cha.
      </p>

      <h2>Attributes</h2>
      {attrsTable([
        ["variant-id", "tự phản ánh id variant khớp lựa chọn hiện tại — chỉ đọc", "—"],
        ["unavailable", "tự gắn khi không có variant nào khớp, hoặc variant khớp còn hàng = false — chỉ đọc", "—"],
        ["sync-url", 'true — đổi query "?variant=..." trên address bar theo variant đang chọn (history.replaceState, không reload). Chỉ nên bật ở trang product thật, KHÔNG bật ở quick-view', "false"],
        ["media-sync", 'tên — khi variant khớp có featuredMediaId, bắn "sx-media-select" với tên này để 1 sx-slider[media-sync="tên"] cùng tên nhảy ảnh theo', "—"],
      ])}

      <h2>Event</h2>
      {eventsTable([["sx-product-change", "mỗi lần lựa chọn đổi — detail: { variant } (object variant khớp, hoặc null nếu không khớp)"]])}
      <p></p>
      {codeBlock(
        `document.querySelector('sx-product').addEventListener('sx-product-change', (e) => {
  if (!e.detail.variant) return console.log('tổ hợp này hết hàng/không tồn tại');
  console.log('variant hiện tại:', e.detail.variant.id);
});`,
        "js",
      )}
    </>
  ),

  demos: [
    {
      label: "Chọn option -> variant-id",
      html: `<div class="product-demo">
  <sx-product id="demoProduct">
    <script type="application/json" data-sx-product-variants>
      [
        { "id": 111, "available": true,  "options": ["Đỏ", "S"] },
        { "id": 112, "available": false, "options": ["Đỏ", "M"] },
        { "id": 113, "available": true,  "options": ["Xanh", "S"] },
        { "id": 114, "available": true,  "options": ["Xanh", "M"] }
      ]
    </script>

    <fieldset>
      <label><input type="radio" name="demo-color" data-option-index="0" data-option-value="Đỏ" checked /> Đỏ</label>
      <label><input type="radio" name="demo-color" data-option-index="0" data-option-value="Xanh" /> Xanh</label>
    </fieldset>
    <fieldset>
      <label><input type="radio" name="demo-size" data-option-index="1" data-option-value="S" checked /> S</label>
      <label><input type="radio" name="demo-size" data-option-index="1" data-option-value="M" /> M</label>
    </fieldset>

    <sx-add-cart class="btn btn--primary">Thêm vào giỏ</sx-add-cart>
  </sx-product>
</div>
<p class="note" data-status>variant-id: 111</p>`,
      css: DEMO_CSS,
      js: `document.getElementById('demoProduct').addEventListener('sx-product-change', (e) => {
  console.log(e.detail.variant);
});`,
      initDemo: (root) => {
        const el = root.querySelector<HTMLElement>("#demoProduct")!;
        const status = root.querySelector<HTMLElement>("[data-status]")!;
        el.addEventListener("sx-product-change", (e: any) => {
          const variant = e.detail.variant;
          status.textContent = variant ? `variant-id: ${variant.id}${variant.available ? "" : " (hết hàng)"}` : "Không có variant khớp";
        });
      },
    },
  ],
};
