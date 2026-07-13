import { codeBlock } from "../shared";

export function renderInstallation(): string {
  return `
    <article class="content-pane">
      <h1>Installation</h1>
      <h2>1. npm</h2>
      ${codeBlock(`npm install @six-js/core`, "bash")}
      Hoặc
      ${codeBlock(`yarn add @six-js/core`, "bash")}
      ${codeBlock(`pnpm add @six-js/core`, "bash")}
      Usage
      ${codeBlock(
        `import { six } from "@six-js/core";

// Nếu dùng các custom elements (vd: sx-animate)
import "@six-js/core/style.css";
six.initElements(); 

six.to(".box", { x: 400, duration: 1.5, ease: "quintInOut" });`,
        "js",
      )}

      <h2>2. CDN </h2>
      ${codeBlock(
        `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@six-js/core/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/@six-js/core/dist/six-js.umd.js"></script>

<script>
  const { six, splitText } = SixJS;

  six.initElements();

  six.to(".box", { x: 400, duration: 1.5, ease: "quintInOut" });
</script>`,
        "html",
      )}
      <p class="note">Bản UMD (<code>six-js.umd.js</code>) là một file gộp duy nhất — Mọi  <span class="c-accent">Plugin</span> đã nằm sẵn trong đó.

      <h2 id="tree-shaking">3. Tree shaking &amp; plugin subpath</h2>
      <p>Bản build ESM (npm) tách <span class="c-accent">six</span> core và từng plugin (vd <span class="c-accent">splitText</span>) thành các chunk riêng. Import plugin qua subpath riêng để bundler chỉ gói phần bạn thực sự dùng, thay vì kéo theo toàn bộ core:</p>
      ${codeBlock(
        `import { six } from "@six-js/core";
import { splitText } from "@six-js/core/split-text";

const split = splitText(".title", { type: "chars,words" });
six.from(split.chars, { opacity: 0, y: 20, stagger: 0.02 });`,
        "js",
      )}
      <p class="note">Chỉ áp dụng cho build ESM (npm install + bundler như Vite/webpack/Rollup). Bản CDN (UMD) là một file gộp duy nhất nên không tree-shake được.</p>
    </article>
  `;
}
