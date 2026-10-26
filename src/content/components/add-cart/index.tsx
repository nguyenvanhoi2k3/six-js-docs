import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
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
}

sx-add-cart {
  padding: 10px 18px;
  border-radius: 8px;
}

.log {
  margin-top: 12px;
  width: min(100%, 460px);
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

export const addCart: ComponentDoc = {
  slug: "add-cart",
  eyebrow: "sx-add-cart",
  title: "Add Cart",
  lead: "Nút \"Thêm vào giỏ\" cho Shopify — tự gọi cartStore.add(), tự chuyển trạng thái idle/loading/success/error, tự đọc variant-id từ sx-product cha nếu có.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-add-cart variant-id="41234567890" quantity="1" class="btn">
  Thêm vào giỏ
</sx-add-cart>`)}
      <p class="note">
        Nằm trong <span class="c-accent">sx-product</span>: có thể bỏ <code>variant-id</code> — tự đọc <code>variantId</code> từ <span class="c-accent">sx-product</span> cha theo lựa chọn hiện tại (xem trang Product).
      </p>
      <p class="note">
        Chỉ lo phần hành vi gọi API + trạng thái — chữ/nền/bo góc là CSS của theme, giống <span class="c-accent">sx-dialog-trigger</span>.
      </p>

      <h2>Attributes</h2>
      {attrsTable([
        ["variant-id", "id variant cần thêm — bỏ trống nếu đã nằm trong sx-product", "—"],
        ["quantity", "số lượng", "1"],
        ["disabled", "khoá tương tác", "false"],
        ["state", 'idle | loading | success | error — tự quản lý, chỉ đọc (phản ánh qua CSS, không nên set tay)', "idle"],
      ])}

      <h2>Event</h2>
      {eventsTable([
        ["sx-add-cart-before-add", "ngay trước khi gọi API — detail: { variantId, quantity }, cancelable: preventDefault() để chặn thêm"],
        ["sx-add-cart-success", "thêm thành công — detail: { variantId, quantity, cart } (cart = ShopifyCart mới nhất)"],
        ["sx-add-cart-error", "thêm thất bại — detail: { variantId, quantity, error }"],
      ])}
      <p></p>
      {codeBlock(
        `const addCartEl = document.querySelector('sx-add-cart');

addCartEl.addEventListener('sx-add-cart-success', (e) => {
  console.log('đã thêm vào giỏ, giỏ hiện có', e.detail.cart.item_count, 'món');
});

addCartEl.addEventListener('sx-add-cart-error', (e) => {
  console.error('thêm vào giỏ lỗi:', e.detail.error);
});`,
        "js",
      )}

      <h2>Method</h2>
      {attrsTable([[".add()", "gọi thêm vào giỏ bằng tay, giống hành vi click", "—"]])}
    </>
  ),

  demos: [
    {
      label: "Trạng thái + tích hợp sx-cart-size",
      html: `<div class="cart-demo">
  <sx-cart-size id="demoCartSize" class="cart-badge">0</sx-cart-size>
  <sx-add-cart id="demoAddCartOk" variant-id="111" class="btn btn--primary">Thêm vào giỏ (thành công)</sx-add-cart>
  <sx-add-cart id="demoAddCartFail" variant-id="999" class="btn btn--ghost">Thêm vào giỏ (giả lập lỗi)</sx-add-cart>
</div>
<div class="log" data-cart-log></div>
<p class="note">Demo này giả lập (mock) response Shopify ngay trong trình duyệt để chạy được không cần store thật — code production chỉ cần đúng như phần "Code" phía trên, không cần mock gì cả.</p>`,
      css: DEMO_CSS,
      js: `const addOk = document.getElementById('demoAddCartOk');
const addFail = document.getElementById('demoAddCartFail');

for (const el of [addOk, addFail]) {
  el.addEventListener('sx-add-cart-success', (e) => console.log('sx-add-cart-success', e.detail.cart.item_count));
  el.addEventListener('sx-add-cart-error', (e) => console.error('sx-add-cart-error', e.detail.error.message));
}`,
      initDemo: (root) => {
        const log = root.querySelector<HTMLElement>("[data-cart-log]")!;
        const write = (msg: string) => {
          const line = document.createElement("div");
          line.textContent = msg;
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
        };

        let itemCount = 0;
        const realFetch = window.fetch.bind(window);

        // Không restore window.fetch sau demo — mỗi demo.html chỉ load 1 trang cho 1 component,
        // không có demo khác cần fetch thật chạy sau đó.
        window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
          const url = String(input);
          if (!url.includes("/cart/add.js") && !url.includes("/cart.js")) return realFetch(input, init);

          if (url.includes("/cart/add.js")) {
            const body = init?.body ? JSON.parse(String(init.body)) : { items: [] };
            const variantId = body.items?.[0]?.id;
            if (variantId === 999) {
              return Promise.resolve(new Response(JSON.stringify({ description: "Variant không đủ hàng (giả lập)" }), { status: 422 }));
            }
            itemCount += 1;
            return Promise.resolve(new Response(JSON.stringify({ id: variantId, quantity: 1 }), { status: 200 }));
          }

          return Promise.resolve(
            new Response(JSON.stringify({ token: "demo", item_count: itemCount, total_price: itemCount * 10000, items: [] }), { status: 200 }),
          );
        }) as typeof window.fetch;

        for (const id of ["demoAddCartOk", "demoAddCartFail"]) {
          const el = root.querySelector<HTMLElement>(`#${id}`)!;
          el.addEventListener("sx-add-cart-success", (e: any) => write(`sx-add-cart-success -> cart.item_count = ${e.detail.cart.item_count}`));
          el.addEventListener("sx-add-cart-error", (e: any) => write(`sx-add-cart-error -> ${e.detail.error.message}`));
        }
      },
    },
  ],
};
