import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const DEMO_CSS = `.card {
  width: min(100%, 280px);
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.swatches {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}

.swatches label {
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.swatches input:checked + label,
.swatches label:has(input:checked) {
  border-color: #ff7a45;
  color: #ff7a45;
}

.swatches input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

[data-product-add-to-cart][disabled] {
  opacity: 0.5;
  pointer-events: none;
}`;

export const variantLinks: ComponentDoc = {
  slug: "variant-links",
  eyebrow: "sx-variant-links",
  title: "Variant Links",
  lead: "Bản nhẹ của sx-product cho card sản phẩm (collection/grid) — value của input radio/checkbox LÀ variant id luôn, không cần JSON variants hay match nhiều option.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<div data-variant-links-scope>
  <sx-variant-links>
    <label><input type="radio" name="swatch" value="111" checked> Đỏ</label>
    <label><input type="radio" name="swatch" value="112"> Xanh</label>
  </sx-variant-links>

  <a href="/products/ao-thun" data-product-link>Xem chi tiết</a>
  <sx-add-cart data-product-add-to-cart variant-id="111" class="btn">Thêm vào giỏ</sx-add-cart>
</div>`)}
      <p class="note">
        <span class="c-accent">sx-variant-links</span> chỉ cần bọc quanh input chọn mẫu — <code>[data-product-add-to-cart]</code> và <code>[data-product-link]</code> có thể là anh em (sibling) của nó, miễn cùng nằm trong 1{" "}
        <code>[data-variant-links-scope]</code> chung (thường là cả thẻ card sản phẩm).
      </p>
      <p class="note">Khi đổi lựa chọn: set <code>variant-id</code> + bỏ <code>disabled</code> trên nút add-to-cart, và viết lại query "?variant=..." trên mọi link trong scope.</p>

      <h2>Attributes</h2>
      {attrsTable([
        ["media-sync", 'tên — khi input được chọn có data-media-id, bắn "sx-media-select" với tên này (giống sx-media-picker)', "—"],
      ])}
      <p class="note">Mỗi input cần <code>value</code> = variant id thật. Có thể thêm <code>data-media-id</code> trên input để đồng thời đổi ảnh qua media-sync.</p>

      <h2>Event</h2>
      {eventsTable([["sx-variant-links-change", "khi chọn input khác — detail: { variantId }"]])}
    </>
  ),

  demos: [
    {
      label: "Card sản phẩm",
      html: `<div class="card" data-variant-links-scope>
  <strong>Áo thun cơ bản</strong>

  <sx-variant-links class="swatches">
    <label><input type="radio" name="demo-swatch" value="111" checked /> Đỏ</label>
    <label><input type="radio" name="demo-swatch" value="112" /> Xanh</label>
  </sx-variant-links>

  <div style="display:flex;gap:8px;align-items:center">
    <a href="/products/ao-thun" data-product-link class="btn btn--ghost btn--sm">Xem chi tiết</a>
    <sx-add-cart data-product-add-to-cart variant-id="111" class="btn btn--primary btn--sm">Thêm vào giỏ</sx-add-cart>
  </div>
</div>
<p class="note" data-status>variant-id: 111 — link: /products/ao-thun?variant=111</p>`,
      css: DEMO_CSS,
      js: `document.querySelector('sx-variant-links').addEventListener('sx-variant-links-change', (e) => {
  console.log('variant đã chọn:', e.detail.variantId);
});`,
      initDemo: (root) => {
        const status = root.querySelector<HTMLElement>("[data-status]")!;
        root.querySelector("sx-variant-links")!.addEventListener("sx-variant-links-change", (e: any) => {
          const link = root.querySelector<HTMLAnchorElement>("[data-product-link]")!;
          status.textContent = `variant-id: ${e.detail.variantId} — link: ${link.getAttribute("href")}`;
        });
      },
    },
  ],
};
