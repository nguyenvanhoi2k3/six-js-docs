import "./index.scss";
import { codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const DEMO_CSS = `.cart-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-badge {
  min-width: 1.6rem;
  height: 1.6rem;
  padding: 0 6px;
  border-radius: 999px;
  background: #1a1c20;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}`;

export const cartSize: ComponentDoc = {
  slug: "cart-size",
  eyebrow: "sx-cart-size",
  title: "Cart Size",
  lead: "Badge số lượng giỏ hàng Shopify — tự lắng nghe sự kiện cart thay đổi trên window, tự ẩn khi giỏ rỗng, tự pulse khi số thay đổi.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-cart-size class="cart-badge">{{ cart.item_count }}</sx-cart-size>`)}
      <p class="note">
        Nội dung text khởi tạo nên render sẵn từ server (vd Liquid <code>cart.item_count</code>) — <span class="c-accent">sx-cart-size</span> chỉ cập nhật lại sau đó, không fetch gì khi mới connect.
      </p>
      <p class="note">
        Tự <code>hidden</code> khi số lượng bằng 0 (hoặc nội dung ban đầu để trống). Cập nhật qua bất kỳ nguồn nào bắn sự kiện <code>sx-cart-change</code> trên <code>window</code> — <span class="c-accent">sx-add-cart</span>, hoặc gọi trực tiếp <code>cartStore</code> (xem trang Cart API) đều kích hoạt nó.
      </p>

      <h2>Attributes</h2>
      <p class="note">Không có attribute riêng — mọi thứ điều khiển qua nội dung text + sự kiện window.</p>
    </>
  ),

  demos: [
    {
      label: "Pulse khi đổi số",
      html: `<div class="cart-demo">
  <sx-cart-size id="demoCartSize2" class="cart-badge">2</sx-cart-size>
  <button class="btn btn--ghost btn--sm" data-bump>+1 vào giỏ</button>
  <button class="btn btn--ghost btn--sm" data-empty>Giỏ rỗng (ẩn badge)</button>
</div>
<p class="note">Demo giả lập sự kiện <code>sx-cart-change</code> trên window — thực tế sự kiện này tự bắn ra bởi sx-add-cart/cartStore.</p>`,
      css: DEMO_CSS,
      js: `let count = 2;

document.querySelector('[data-bump]').addEventListener('click', () => {
  count += 1;
  window.dispatchEvent(new CustomEvent('sx-cart-change', { detail: { cart: { item_count: count } } }));
});

document.querySelector('[data-empty]').addEventListener('click', () => {
  count = 0;
  window.dispatchEvent(new CustomEvent('sx-cart-change', { detail: { cart: { item_count: count } } }));
});`,
      initDemo: (root) => {
        let count = 2;
        root.querySelector("[data-bump]")!.addEventListener("click", () => {
          count += 1;
          window.dispatchEvent(new CustomEvent("sx-cart-change", { detail: { cart: { item_count: count } } }));
        });
        root.querySelector("[data-empty]")!.addEventListener("click", () => {
          count = 0;
          window.dispatchEvent(new CustomEvent("sx-cart-change", { detail: { cart: { item_count: count } } }));
        });
      },
    },
  ],
};
