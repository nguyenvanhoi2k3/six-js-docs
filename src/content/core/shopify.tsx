import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock, eventsTable } from "../shared";
import { h, Fragment } from "../../jsx";

export const shopifyContent: ContentMap = {
  "shopify/cart": {
    eyebrow: "Shopify",
    title: "Cart API",
    lead: "cartStore — client AJAX cart của Shopify dùng chung cho toàn trang, cộng isShopifyThemeEditor() để phát hiện đang chạy trong Theme Editor.",
    render: () => (
      <>
        {codeBlock(`import { cartStore } from "@six-js/core/Cart";

await cartStore.add({ id: 41234567890, quantity: 1 }); // POST /cart/add.js
await cartStore.get();                                 // GET /cart.js
await cartStore.updateItem("line-key-abc", 2);         // POST /cart/change.js`, "js")}
        <p class="note">
          Một singleton <code>cartStore</code> dùng chung cho cả trang — mọi <span class="c-accent">sx-add-cart</span>/<span class="c-accent">sx-cart-size</span> trên trang đọc cùng 1 nguồn dữ liệu giỏ hàng
          thay vì mỗi nơi tự fetch <code>/cart.js</code> riêng.
        </p>

        <h2>Method</h2>
        {attrsTable([
          ["add(items, sectionsToRender?)", "POST /cart/add.js — items là 1 object hoặc mảng { id, quantity, properties?, selling_plan? }", "—"],
          ["get(sectionsToRender?)", "GET /cart.js — lấy lại cart hiện tại, không hủy 1 add()/updateItem() khác đang chạy", "—"],
          ["updateItem(line, quantity, sectionsToRender?)", "POST /cart/change.js — line là key (string, nên dùng) hoặc index 1-based (number, kiểu cũ)", "—"],
        ])}
        <p class="note">
          Mọi method trả về <code>Promise&lt;ShopifyCart&gt;</code>. Gọi <code>add()</code>/<code>updateItem()</code> khi 1 cái còn đang chạy sẽ tự huỷ cái trước — chỉ kết quả của lần gọi mới nhất được áp dụng.
        </p>

        <h2>Property</h2>
        {attrsTable([
          ["cart", "ShopifyCart | null — cart gần nhất đã biết, null nếu chưa get()/add() lần nào", "—"],
          ["isLoading", "true khi add()/updateItem() đang chạy (get() không tính)", "—"],
        ])}

        <h2>Event</h2>
        <p>
          Bắn cả trên chính <code>cartStore</code> (<code>cartStore.addEventListener(...)</code>) và mirror trên <code>window</code> — ưu tiên dùng bản trên <code>window</code> nếu không chắc đang cùng
          instance <code>cartStore</code> (vd từ trong <span class="c-accent">sx-cart-size</span>, nơi build riêng có thể có bản <code>cartStore</code> inline riêng của nó).
        </p>
        {eventsTable([
          ["sx-cart-change (trên window)", "sau mỗi add()/get()/updateItem() thành công — detail: { cart, previousCart, source }"],
          ["sx-cart-error (trên window)", "khi request lỗi (network hoặc Shopify trả lỗi) — detail: { error, status?, description?, source }"],
        ])}
        <p></p>
        {codeBlock(
          `window.addEventListener('sx-cart-change', (e) => {
  console.log('giỏ hàng vừa đổi:', e.detail.cart.item_count, 'món');
});

window.addEventListener('sx-cart-error', (e) => {
  console.error('lỗi giỏ hàng:', e.detail.error.message);
});`,
          "js",
        )}
        <p class="note">
          Dùng <code>cartStore</code> trực tiếp khi cần tự dựng UI giỏ hàng; nếu chỉ cần nút thêm vào giỏ/badge số lượng có sẵn, xem{" "}
          <a href="components.html#add-cart">Add Cart</a> và <a href="components.html#cart-size">Cart Size</a>.
        </p>

        <h2>isShopifyThemeEditor()</h2>
        {codeBlock(`import { isShopifyThemeEditor } from "@six-js/core";

if (isShopifyThemeEditor()) {
  // đang preview trong Theme Editor (merchant đang edit, hoặc Section Rendering API) — bỏ qua
  // hành vi chỉ nên chạy trên storefront thật, vd autoplay nhạc nền
}`, "js")}
        <p class="note">
          Đọc trực tiếp <code>window.Shopify.designMode</code> — tín hiệu chính thức của Shopify, <code>true</code> khi đang ở trong Theme Editor, vắng/false trên storefront thật khách hàng thấy.
        </p>
      </>
    ),
  },
};
