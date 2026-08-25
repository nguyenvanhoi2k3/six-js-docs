import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

// ---- Shared CSS building blocks reused (and shown in full, self-contained form) across demos below ----
//
// Mỗi toast được appendChild thẳng vào chính <sx-toast-viewport> (không portal ra body) - nhưng cả
// trang demo.html chỉ nên có DUY NHẤT 1 sx-toast-viewport (xem demo "Cơ bản" bên dưới, đúng như một
// consumer thật sẽ dùng), nằm trong section của demo đó. Style riêng cho từng toast (toast-class)
// vẫn cần sống trong index.scss thay vì css scoped-per-demo, vì .sx-toast luôn là con của viewport ở
// demo "Cơ bản" - CSS scoped theo #section-id của MỘT demo khác (vd demo "Style") sẽ không với tới.

const TOAST_STYLE_CSS = `.sx-toast.demo-purple {
  --sx-toast-bg: #241b3d;
  --sx-toast-color: #e4d6ff;
  --sx-toast-accent: #a970ff;
  --sx-toast-radius: 1.25em;
}
.sx-toast.demo-square {
  --sx-toast-radius: 0.125em;
  --sx-toast-accent-width: 6px;
}`;

export const toast: ComponentDoc = {
  slug: "toast",
  eyebrow: "sx-toast",
  title: "Toast",
  lead: "Thông báo ngắn nổi ở góc màn hình, tự biến mất sau một khoảng thời gian — bắn bằng thẻ khai báo sẵn hoặc một CustomEvent duy nhất từ bất kỳ đâu trong code, tự xếp hàng khi vượt quá số lượng hiển thị cùng lúc.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-toast-trigger message="Đã lưu thành công!" variant="success">Lưu</sx-toast-trigger>

<!-- 1 lần duy nhất cho toàn bộ trang, đặt ở đâu cũng được (thường cuối body) -->
<sx-toast-viewport></sx-toast-viewport>`)}

      <p class="note">
        <span class="c-accent">sx-toast-viewport</span> không portal — nó chỉ <code>position: fixed</code> để luôn nổi trên mọi thứ, còn từng toast được tạo ra là con thật của chính nó. Chỉ cần khai báo{" "}
        <strong>một</strong> viewport cho cả trang; mọi <span class="c-accent">sx-toast-trigger</span> hay <code>CustomEvent</code> khác (xem bên dưới) đều tự tìm đến đúng viewport đó.
      </p>

      <h2>sx-toast-trigger</h2>
      <p>{"Bọc một label bấm được — giống hệt cách sx-popover-trigger/sx-dialog-trigger hoạt động, bản thân thẻ này là nút bấm, không cần &lt;button&gt; con."}</p>
      {attrsTable([
        ["message", "text hiển thị — bỏ qua nếu có &lt;template&gt; con", "—"],
        ["variant", "success | error | info", "info"],
        ["duration", "số giây trước khi tự đóng", "3"],
        ["toast-id", "id để nhóm — bắn lại cùng id sẽ thay thế toast cũ (đang hiện hoặc đang xếp hàng) thay vì cộng dồn, hợp cho toast kiểu tiến trình", "—"],
        ["toast-class", "thêm class riêng vào phần tử toast được tạo ra — dùng kèm CSS variable để style riêng 1 toast (xem phần Style)", "—"],
      ])}
      {codeBlock(`<sx-toast-trigger variant="info" toast-class="demo-purple">
  Xem đơn hàng (rich content)
  <template>
    <strong>Đơn hàng #A1029</strong><br />
    Trạng thái: <em>Đang giao</em><br />
    <a href="#">Theo dõi đơn hàng →</a>
  </template>
</sx-toast-trigger>`)}
      <p class="note">{"Một &lt;template&gt; con thắng thế "}<code>message</code>{" khi cả hai cùng có mặt — giống hệt quy tắc content-attribute-vs-template của sx-tooltip."}</p>

      <h2>sx-toast-viewport</h2>
      {attrsTable([["position", "top-left | top-center | top-right | bottom-left | bottom-center | bottom-right", "bottom-right"]])}
      <p>
        Đổi trực tiếp bằng attribute HTML hoặc qua JS (<code>viewportEl.position = "top-left"</code>) — CSS tự phản ứng theo, không cần thêm gì khác. Tối đa <strong>3 toast</strong> hiển thị cùng lúc trên một
        viewport — phần dư tự xếp hàng, hiện lần lượt khi có chỗ trống. Di chuột (hoặc Tab focus) vào một toast đang hiện sẽ tạm dừng đếm giờ; rời đi thì đếm tiếp từ thời gian còn lại, không reset về đầu.
      </p>

      <h2>Bắn toast bằng JS</h2>
      <p>
        <span class="c-accent">sx-toast-trigger</span> chỉ hợp khi nội dung/điều kiện đã biết trước lúc viết HTML. Khi cần bắn toast từ kết quả API, vòng lặp, setTimeout... thì dispatch thẳng{" "}
        <code>CustomEvent("sx-toast-show")</code> lên <code>window</code> — đây chính là event mà <span class="c-accent">sx-toast-trigger</span> cũng dùng bên trong, không phải 2 cơ chế khác nhau.
      </p>
      {codeBlock(
        `window.dispatchEvent(
  new CustomEvent("sx-toast-show", {
    detail: {
      message: "Đã lưu thay đổi",
      variant: "success",
      duration: 3.5,
      id: "save-status",       // xem toast-id ở trên
      className: "demo-purple", // xem toast-class ở trên
    },
  })
);`,
        "js",
      )}

      <h2>Event</h2>
      <p>
        Không có event "sau khi hiện/ẩn" trên chính từng toast (chúng vô danh và tự dọn dẹp) — chỉ có đúng 1 event, dispatch trên <span class="c-accent">window</span>, mà cả{" "}
        <span class="c-accent">sx-toast-trigger</span> lẫn code gọi tay ở trên đều dùng chung:
      </p>
      {eventsTable([["sx-toast-show", "yêu cầu hiện một toast mới — detail là ToastShowDetail (message/content/variant/duration/id/className)"]])}
      {codeBlock(
        `// Nghe được MỌI toast trên trang, bất kể bắn qua sx-toast-trigger hay dispatchEvent thủ công
window.addEventListener('sx-toast-show', (e) => {
  console.log('sắp hiện toast:', e.detail);
});`,
        "js",
      )}

      <h2>Style</h2>
      <p>Toàn bộ giao diện là CSS custom properties trên class thường <code>.sx-toast</code> — không Shadow DOM nên ghi đè bằng CSS của chính bạn là đủ, không cần đụng vào source thư viện.</p>
      {codeBlock(
        `--sx-toast-bg
--sx-toast-color
--sx-toast-border-color
--sx-toast-radius
--sx-toast-padding
--sx-toast-shadow
--sx-toast-min-width
--sx-toast-max-width
--sx-toast-font-size
--sx-toast-accent        (màu vạch trái)
--sx-toast-accent-width`,
        "css",
      )}
      <p>
        Style riêng 1 toast bằng <code>toast-class</code>/<code>className</code>, hoặc toàn trang qua <code>:root</code>:
      </p>
      {codeBlock(TOAST_STYLE_CSS, "css")}
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "HTML thuần, không cần JS",
      html: `<div class="content-pane__panel">
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Đây là một thông báo info." variant="info">Info</sx-toast-trigger>
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Lưu thành công!" variant="success">Success</sx-toast-trigger>
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Có lỗi xảy ra, thử lại sau." variant="error" duration="5">Error (5s)</sx-toast-trigger>
</div>

<!-- 1 lần duy nhất cho toàn bộ trang này - mọi sx-toast-trigger/dispatchEvent khác ở các demo bên dưới đều bắn vào đây -->
<sx-toast-viewport></sx-toast-viewport>`,
    },
    {
      label: "Nội dung phong phú (template)",
      html: `<div class="content-pane__panel">
  <sx-toast-trigger class="btn btn--primary btn--sm" variant="info" toast-class="demo-purple">
    Xem đơn hàng (rich content)
    <template>
      <strong>Đơn hàng #A1029</strong><br />
      Trạng thái: <em>Đang giao</em><br />
      <a href="#">Theo dõi đơn hàng →</a>
    </template>
  </sx-toast-trigger>
</div>`,
      css: TOAST_STYLE_CSS,
    },
    {
      label: "Style tùy chỉnh (toast-class)",
      html: `<div class="content-pane__panel">
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Toast màu tím, tự định nghĩa 100% bằng CSS!" variant="info" toast-class="demo-purple">Toast tím</sx-toast-trigger>
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Toast bo góc vuông, vạch màu dày hơn." variant="success" toast-class="demo-square">Toast vuông</sx-toast-trigger>
</div>`,
      css: TOAST_STYLE_CSS,
    },
    {
      label: "Đổi vị trí hiển thị (position)",
      html: `<div class="content-pane__panel" data-toast-position-picker>
  <button class="btn btn--ghost btn--sm" data-position="top-left">top-left</button>
  <button class="btn btn--ghost btn--sm" data-position="top-center">top-center</button>
  <button class="btn btn--ghost btn--sm" data-position="top-right">top-right</button>
  <button class="btn btn--ghost btn--sm" data-position="bottom-left">bottom-left</button>
  <button class="btn btn--ghost btn--sm" data-position="bottom-center">bottom-center</button>
  <button class="btn btn--ghost btn--sm" data-position="bottom-right">bottom-right (mặc định)</button>
</div>
<p class="note">
  Vị trí hiện tại: <code data-toast-current-position>bottom-right</code>. Cả trang chỉ dùng chung 1 sx-toast-viewport (xem demo "HTML thuần"), nên đổi ở đây cũng ảnh hưởng luôn các demo tĩnh phía trên.
</p>
<div class="content-pane__panel">
  <button class="btn btn--primary btn--sm" data-toast-position-test>Bắn toast thử vị trí này</button>
</div>`,
      js: `const viewportEl = document.querySelector('sx-toast-viewport');

document.querySelector('[data-toast-position-picker]').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-position]');
  if (!btn) return;
  viewportEl.position = btn.dataset.position; // setter trong toast-viewport.ts
  document.querySelector('[data-toast-current-position]').textContent = viewportEl.position;
});

document.querySelector('[data-toast-position-test]').addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('sx-toast-show', {
    detail: { message: \`Toast tại vị trí "\${viewportEl.position}"\`, variant: 'info' },
  }));
});`,
      initDemo: (root) => {
        const viewportEl = document.querySelector<any>("sx-toast-viewport");
        const currentLabel = root.querySelector<HTMLElement>("[data-toast-current-position]")!;
        root.querySelector("[data-toast-position-picker]")!.addEventListener("click", (e) => {
          const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-position]");
          if (!btn || !viewportEl) return;
          viewportEl.position = btn.dataset.position;
          currentLabel.textContent = viewportEl.position;
        });
        root.querySelector("[data-toast-position-test]")!.addEventListener("click", () => {
          window.dispatchEvent(new CustomEvent("sx-toast-show", { detail: { message: `Toast tại vị trí "${viewportEl?.position}"`, variant: "info" } }));
        });
      },
    },
    {
      label: "JS API + hàng đợi",
      html: `<div class="content-pane__panel">
  <button class="btn btn--ghost btn--sm" data-toast-custom>Bắn 1 toast bằng dispatchEvent</button>
  <button class="btn btn--ghost btn--sm" data-toast-burst>Bắn liên tiếp 6 toast (test hàng đợi)</button>
</div>
<p class="note">Tối đa 3 toast hiển thị cùng lúc — phần dư tự xếp hàng, hiện lần lượt khi có chỗ trống.</p>`,
      js: `function showToast(detail) {
  window.dispatchEvent(new CustomEvent('sx-toast-show', { detail }));
}

document.querySelector('[data-toast-custom]').addEventListener('click', () => {
  showToast({ message: 'Thông báo tùy chỉnh, bắn bằng JS.', variant: 'info', duration: 4 });
});

document.querySelector('[data-toast-burst]').addEventListener('click', () => {
  for (let i = 1; i <= 6; i++) {
    showToast({
      message: \`Toast xếp hàng #\${i}\`,
      variant: i % 3 === 0 ? 'error' : i % 3 === 1 ? 'info' : 'success',
    });
  }
});`,
      initDemo: (root) => {
        const showToast = (detail: unknown) => window.dispatchEvent(new CustomEvent("sx-toast-show", { detail: detail as any }));
        root.querySelector("[data-toast-custom]")!.addEventListener("click", () => {
          showToast({ message: "Thông báo tùy chỉnh, bắn bằng JS.", variant: "info", duration: 4 });
        });
        root.querySelector("[data-toast-burst]")!.addEventListener("click", () => {
          for (let i = 1; i <= 6; i++) {
            showToast({ message: `Toast xếp hàng #${i}`, variant: i % 3 === 0 ? "error" : i % 3 === 1 ? "info" : "success" });
          }
        });
      },
    },
    {
      label: "Tạm dừng khi hover/focus",
      html: `<div class="content-pane__panel">
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Toast này tồn tại 10 giây — thử rê chuột giữ lên nó." variant="info" duration="10">Bắn toast 10s</sx-toast-trigger>
  <sx-toast-trigger class="btn btn--ghost btn--sm" message="Toast 1.2 giây, biến mất nhanh." variant="success" duration="1.2">Bắn toast 1.2s</sx-toast-trigger>
</div>`,
    },
    {
      label: "Thay thế tại chỗ bằng id (toast tiến trình)",
      html: `<div class="content-pane__panel">
  <button class="btn btn--primary btn--sm" data-toast-progress>Mô phỏng upload 3 bước</button>
</div>
<p class="note">Cùng <code>id="upload-1"</code> xuyên suốt — quan sát sẽ chỉ có 1 toast, nội dung/màu đổi dần chứ không nhân bản.</p>`,
      js: `document.querySelector('[data-toast-progress]').addEventListener('click', () => {
  const id = 'upload-1';
  const fire = (detail) => window.dispatchEvent(new CustomEvent('sx-toast-show', { detail: { ...detail, id } }));

  fire({ message: 'Đang tải lên (0%)...', variant: 'info', duration: 60 });
  setTimeout(() => fire({ message: 'Đang tải lên (60%)...', variant: 'info', duration: 60 }), 900);
  setTimeout(() => fire({ message: 'Tải lên thành công!', variant: 'success', duration: 3 }), 1800);
});`,
      initDemo: (root) => {
        root.querySelector("[data-toast-progress]")!.addEventListener("click", () => {
          const id = "upload-1";
          const fire = (detail: object) => window.dispatchEvent(new CustomEvent("sx-toast-show", { detail: { ...detail, id } }));
          fire({ message: "Đang tải lên (0%)...", variant: "info", duration: 60 });
          setTimeout(() => fire({ message: "Đang tải lên (60%)...", variant: "info", duration: 60 }), 900);
          setTimeout(() => fire({ message: "Tải lên thành công!", variant: "success", duration: 3 }), 1800);
        });
      },
    },
  ],
};
