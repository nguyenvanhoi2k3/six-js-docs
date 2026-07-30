import { codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

interface ComponentOption {
  key: string;
  label: string;
  register: string;
}

interface PluginOption {
  key: string;
  label: string;
  subpath: string;
  named: string;
  umd: string;
}

const COMPONENTS: ComponentOption[] = [
  { key: "dialog", label: "sx-dialog", register: "registerDialog" },
  { key: "slider", label: "sx-slider", register: "registerSlider" },
  { key: "marquee", label: "sx-marquee", register: "registerMarquee" },
  { key: "accordion", label: "sx-accordion", register: "registerAccordion" },
  { key: "popover", label: "sx-popover", register: "registerPopover" },
];

const PLUGINS: PluginOption[] = [
  { key: "splitText", label: "SplitText", subpath: "SplitText", named: "SplitText", umd: "SplitText.umd.js" },
  { key: "smoothScroll", label: "SmoothScroll", subpath: "SmoothScroll", named: "SmoothScroll", umd: "SmoothScroll.umd.js" },
  { key: "scrambleText", label: "ScrambleText", subpath: "ScrambleText", named: "ScrambleText", umd: "ScrambleText.umd.js" },
  { key: "burst", label: "Burst", subpath: "Burst", named: "Burst", umd: "Burst.umd.js" },
  { key: "svgMotion", label: "SvgMotion", subpath: "SvgMotion", named: "SvgMotion", umd: "SvgMotion.umd.js" },
];

type Mode = "npm" | "cdn";

interface PickerState {
  mode: Mode;
  components: Set<string>;
  allComponents: boolean;
  plugins: Set<string>;
}

function generateNpmCode(state: PickerState): string {
  const components = state.allComponents ? COMPONENTS : COMPONENTS.filter((c) => state.components.has(c.key));
  const plugins = PLUGINS.filter((p) => state.plugins.has(p.key));
  const hasComponents = state.allComponents || components.length > 0;

  const importLines = [`import { six } from "@six-js/core";`];
  if (hasComponents) {
    importLines.push(`import "@six-js/core/components.css";`);
    importLines.push(state.allComponents ? `import { registerComponents } from "@six-js/core/Components";` : `import { ${components.map((c) => c.register).join(", ")} } from "@six-js/core/Components";`);
  }
  plugins.forEach((p) => importLines.push(`import { ${p.named} } from "@six-js/core/${p.subpath}";`));

  const bodyLines: string[] = [];
  if (hasComponents) {
    if (state.allComponents) bodyLines.push(`registerComponents();`);
    else components.forEach((c) => bodyLines.push(`${c.register}();`));
    bodyLines.push("");
  }
  bodyLines.push(`// your code`);

  return `${importLines.join("\n")}\n\n${bodyLines.join("\n")}`;
}

function generateCdnCode(state: PickerState): string {
  const components = state.allComponents ? COMPONENTS : COMPONENTS.filter((c) => state.components.has(c.key));
  const plugins = PLUGINS.filter((p) => state.plugins.has(p.key));
  const hasComponents = state.allComponents || components.length > 0;
  const base = "https://cdn.jsdelivr.net/npm/@six-js/core/dist";

  const tagLines = [`<script src="${base}/six-js.umd.js"></script>`];
  if (hasComponents) tagLines.push(`<link rel="stylesheet" href="${base}/components.css" />`, `<script src="${base}/Components.umd.js"></script>`);
  plugins.forEach((p) => tagLines.push(`<script src="${base}/${p.umd}"></script>`));

  const bodyLines: string[] = [];
  if (hasComponents) {
    if (state.allComponents) bodyLines.push(`  Components.registerComponents();`);
    else components.forEach((c) => bodyLines.push(`  Components.${c.register}();`));
    bodyLines.push("");
  }
  bodyLines.push(`  six.to(".box", { x: 400, duration: 1.5, ease: "quintInOut" });`);

  return `${tagLines.join("\n")}\n\n<script>\n${bodyLines.join("\n")}\n</script>`;
}

function renderOutput(state: PickerState): string {
  if (state.mode === "npm") {
    return (
      <>
        {codeBlock(`npm install @six-js/core`, "bash")}
        {codeBlock(generateNpmCode(state), "js")}
      </>
    );
  }
  return codeBlock(generateCdnCode(state), "html");
}

export function renderInstallation(): string {
  const componentChips = COMPONENTS.map((c) => (
    <label class="install-picker__chip">
      <input type="checkbox" value={c.key} data-install-check="component" /> {c.label}
    </label>
  ));
  const pluginChips = PLUGINS.map((p) => (
    <label class="install-picker__chip">
      <input type="checkbox" value={p.key} data-install-check="plugin" /> {p.label}
    </label>
  ));

  return (
    <article class="content-pane">
      <h1>Installation</h1>

      <div class="install-picker-layout">
        <div class="install-picker">
          <div class="install-picker__group">
            <p class="install-picker__label">Install</p>
            <div class="install-picker__mode" data-install-mode>
              <button type="button" class="btn btn--ghost btn--sm is-active" data-mode="npm">
                npm / bundler
              </button>
              <button type="button" class="btn btn--ghost btn--sm" data-mode="cdn">
                CDN
              </button>
            </div>
          </div>

          <div class="install-picker__group">
            <p class="install-picker__label">Components</p>
            <div class="install-picker__chips">
              <label class="install-picker__chip install-picker__chip--all">
                <input type="checkbox" data-install-check="all-components" /> Tất cả
              </label>
              {componentChips}
            </div>
          </div>

          <div class="install-picker__group">
            <p class="install-picker__label">Plugins</p>
            <div class="install-picker__chips">{pluginChips}</div>
          </div>
        </div>

        <div class="install-picker-output" data-install-output>
          {renderOutput({ mode: "npm", components: new Set(), allComponents: false, plugins: new Set() })}
        </div>
      </div>

    </article>
  );
}

export function initInstallation(root: HTMLElement): void {
  const state: PickerState = { mode: "npm", components: new Set(), allComponents: false, plugins: new Set() };
  const output = root.querySelector<HTMLElement>("[data-install-output]")!;
  const modeButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-install-mode] [data-mode]"));
  const componentInputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-install-check="component"]'));

  function update(): void {
    output.innerHTML = renderOutput(state);
    // Individual component picks are moot (and visually disabled) once "all" is checked — reflects
    // that the generated code switches to registerComponents() regardless of what's ticked below it.
    componentInputs.forEach((input) => {
      input.disabled = state.allComponents;
      input.closest(".install-picker__chip")?.classList.toggle("is-disabled", state.allComponents);
    });
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode as Mode;
      modeButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      update();
    });
  });

  root.querySelectorAll<HTMLInputElement>("[data-install-check]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.dataset.installCheck === "all-components") {
        state.allComponents = input.checked;
        update();
        return;
      }
      const set = input.dataset.installCheck === "component" ? state.components : state.plugins;
      if (input.checked) set.add(input.value);
      else set.delete(input.value);
      update();
    });
  });
}
