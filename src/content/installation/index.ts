import { VERSION } from "@six-js/core";
import { codeBlock } from "../shared";

export function renderInstallation(): string {
  return `
    <article class="content-pane">
      <span class="content-pane__eyebrow">Bắt đầu</span>
      <h1>Installation</h1>
      <p class="content-pane__lead">Cài đặt gói <code>@six-js/core</code> (hiện tại: v${VERSION}) và import vào project của bạn.</p>

      <div class="callout">
        <strong>Lưu ý:</strong> <code>@six-js/core</code> đang trong giai đoạn phát triển và chưa publish lên npm registry.
        Trước khi publish chính thức, hãy dùng cách "chạy từ source" ở cuối trang, hoặc theo dõi repo để biết khi nào bản npm đầu tiên ra mắt.
      </div>

      <h2>1. Cài đặt qua npm</h2>
      <p>Khi đã publish, cài đặt như một gói npm thông thường:</p>
      ${codeBlock(
        `npm install @six-js/core
# hoặc
yarn add @six-js/core
# hoặc
pnpm add @six-js/core`,
        "bash",
      )}

      <h2>2. Import trong code</h2>
      <p>six-js export một object <code>six</code> duy nhất cho toàn bộ API (to/from/timeline/media/...), cộng với một file CSS riêng cho các web component:</p>
      ${codeBlock(
        `import { six } from "@six-js/core";
import "@six-js/core/style.css"; // style cho sx-dialog, sx-slider, sx-marquee, sx-animate...

// chỉ cần gọi nếu trang có dùng web components (<sx-dialog>, <sx-slider>, ...)
six.initElements();

// dùng animation engine thuần JS, không cần initElements()
six.to(".box", { x: 100, duration: 0.5, ease: "quadOut" });`,
        "js",
      )}

      <h2>3. Dùng qua thẻ &lt;script&gt; (không cần bundler)</h2>
      <p>six-js cũng build sẵn bản UMD, có thể nhúng thẳng qua CDN và dùng biến toàn cục <code>SixJS</code>:</p>
      ${codeBlock(
        `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@six-js/core/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/@six-js/core/dist/six-js.umd.js"></script>

<script>
  const { six } = SixJS;
  six.initElements();
  six.to(".box", { x: 100, duration: 0.5 });
</script>`,
        "html",
      )}

      <h2>Chạy từ source (trong lúc chưa publish)</h2>
      <p>Clone/kéo hai repo <code>six-js</code> (thư viện) và <code>six-js-docs</code> (trang docs này) nằm cạnh nhau, build thư viện rồi link qua <code>file:</code> dependency — đúng như cách bản thân trang docs này đang chạy:</p>
      ${codeBlock(
        `cd six-js
npm install
npm run build      # -> dist/six-js.es.js, dist/six-js.umd.js, dist/style.css

cd ../your-project
npm install file:../six-js`,
        "bash",
      )}
      <p>Rebuild <code>six-js</code> (<code>npm run build</code>) sẽ tự động được project của bạn nhận thấy — <code>file:</code> dependency được npm link dưới dạng symlink, chỉ cần build lại thư viện và refresh trình duyệt, không cần <code>npm install</code> lại.</p>
    </article>
  `;
}
