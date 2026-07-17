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
        `import { six, enableElements } from "@six-js/core";

// Nếu dùng các custom elements (vd: sx-animate)
import "@six-js/core/style.css";
enableElements();

six.to(".box", { x: 400, duration: 1.5, ease: "quintInOut" });`,
        "js",
      )}

      <h2>2. CDN </h2>
      ${codeBlock(
        `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@six-js/core/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/@six-js/core/dist/six-js.umd.js"></script>

<script>
  const { six, enableElements } = SixJS;

  enableElements();

  six.to(".box", { x: 400, duration: 1.5, ease: "quintInOut" });
</script>`,
        "html",
      )}
    </article>
  `;
}
