import { six } from "@six-js/core";
import { h } from "../../jsx";

// Mirrors `EASES` in six-js/src/easing/easing.ts — the Tween engine's own ease table, used by
// six.to/from/fromTo/timeline/six.config() and every plugin that forwards `ease` to a Tween.
const CORE_EASES: string[] = [
  "none",
  "linear",
  "quadIn",
  "quadOut",
  "quadInOut",
  "cubicIn",
  "cubicOut",
  "cubicInOut",
  "quartIn",
  "quartOut",
  "quartInOut",
  "quintIn",
  "quintOut",
  "quintInOut",
  "sineIn",
  "sineOut",
  "sineInOut",
  "expoIn",
  "expoOut",
  "expoInOut",
  "circIn",
  "circOut",
  "circInOut",
  "backIn",
  "backOut",
  "backInOut",
  "bounceIn",
  "bounceOut",
  "bounceInOut",
  "elasticIn",
  "elasticOut",
  "elasticInOut",
  "smooth",
  "spring",
  "jelly",
];

// Mirrors `CSS_EASINGS` in six-js/src/components/shared/easing.ts — a separate, component-only
// named-ease table (resolved via resolveCssEasing()) used by the `ease` attribute of sx-dialog
// and sx-popover, which animate via plain CSS transitions rather than the Tween engine.
const COMPONENT_EASES: [name: string, css: string][] = [
  ["linear", "linear"],
  ["quadIn", "cubic-bezier(0.11, 0, 0.5, 0)"],
  ["quadOut", "cubic-bezier(0.5, 1, 0.89, 1)"],
  ["quadInOut", "cubic-bezier(0.45, 0, 0.55, 1)"],
  ["cubicIn", "cubic-bezier(0.32, 0, 0.67, 0)"],
  ["cubicOut", "cubic-bezier(0.33, 1, 0.68, 1)"],
  ["cubicInOut", "cubic-bezier(0.65, 0, 0.35, 1)"],
  ["quartIn", "cubic-bezier(0.5, 0, 0.75, 0)"],
  ["quartOut", "cubic-bezier(0.25, 1, 0.5, 1)"],
  ["quartInOut", "cubic-bezier(0.76, 0, 0.24, 1)"],
  ["quintIn", "cubic-bezier(0.64, 0, 0.78, 0)"],
  ["quintOut", "cubic-bezier(0.22, 1, 0.36, 1)"],
  ["quintInOut", "cubic-bezier(0.83, 0, 0.17, 1)"],
  ["strongIn", "cubic-bezier(0.64, 0, 0.78, 0)"],
  ["strongOut", "cubic-bezier(0.22, 1, 0.36, 1)"],
  ["strongInOut", "cubic-bezier(0.83, 0, 0.17, 1)"],
  ["sineIn", "cubic-bezier(0.12, 0, 0.39, 0)"],
  ["sineOut", "cubic-bezier(0.61, 1, 0.88, 1)"],
  ["sineInOut", "cubic-bezier(0.37, 0, 0.63, 1)"],
  ["expoIn", "cubic-bezier(0.7, 0, 0.84, 0)"],
  ["expoOut", "cubic-bezier(0.16, 1, 0.3, 1)"],
  ["expoInOut", "cubic-bezier(0.87, 0, 0.13, 1)"],
  ["circIn", "cubic-bezier(0.55, 0, 1, 0.45)"],
  ["circOut", "cubic-bezier(0, 0.55, 0.45, 1)"],
  ["circInOut", "cubic-bezier(0.85, 0, 0.15, 1)"],
  ["backIn", "cubic-bezier(0.36, 0, 0.66, -0.56)"],
  ["backOut", "cubic-bezier(0.34, 1.56, 0.64, 1)"],
  ["backInOut", "cubic-bezier(0.68, -0.6, 0.32, 1.6)"],
  ["bounceIn", "ease-in"],
  ["bounceOut", "ease-out"],
  ["bounceInOut", "ease-in-out"],
];

const TRAVEL_PX = 200;
const DEMO_MS = 1200;

function demoPanel(isCore: boolean): string {
  return (
    <div class="ease-demo">
      <div class="ease-demo__track">
        {isCore ? <div class="demo-animate-box ease-demo__box" data-ease-core-box></div> : <div class="demo-animate-box ease-demo__box" data-ease-component-box></div>}
      </div>
    </div>
  );
}

function coreChips(): string {
  const chips = CORE_EASES.map((name) => (
    <button type="button" class="ease-chip" data-ease-core={name}>
      {name}
    </button>
  ));

  return <div class="ease-chips">{chips}</div>;
}

function componentChips(): string {
  const chips = COMPONENT_EASES.map(([name, css]) => (
    <button type="button" class="ease-chip" data-ease-component={name} data-ease-component-css={css} title={css}>
      {name}
    </button>
  ));

  return <div class="ease-chips">{chips}</div>;
}

export function renderEase(): string {
  return (
    <article class="content-pane">
      <span class="content-pane__eyebrow"></span>
      <h1>Ease</h1>
      <p class="content-pane__lead">
        six-js dùng hai bảng easing tách biệt: một cho Tween engine, một riêng cho các web component chạy CSS
      </p>

      <div class="ease-grid">
        <section class="ease-col" id="core">
          <h2>Core (Tween)</h2>
          {demoPanel(true)}
          {coreChips()}
        </section>

        <section class="ease-col" id="component">
          <h2>Component</h2>
          {demoPanel(false)}
          {componentChips()}
        </section>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
      </div>
    </article>
  );
}

export function initEase(root: HTMLElement): void {
  const coreBox = root.querySelector<HTMLElement>("[data-ease-core-box]")!;
  const componentBox = root.querySelector<HTMLElement>("[data-ease-component-box]")!;

  function runCore(name: string): void {
    six.set(coreBox, { x: 0, overwrite: true });
    six.to(coreBox, { x: TRAVEL_PX, duration: DEMO_MS / 1000, ease: name, overwrite: true });
  }

  function runComponent(css: string): void {
    componentBox.getAnimations().forEach((anim) => anim.cancel());
    componentBox.animate([{ transform: "translateX(0)" }, { transform: `translateX(${TRAVEL_PX}px)` }], { duration: DEMO_MS, easing: css, fill: "forwards" });
  }

  const coreButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-ease-core]"));
  coreButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      coreButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      runCore(btn.dataset.easeCore!);
    });
  });

  const componentButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-ease-component]"));
  componentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      componentButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      runComponent(btn.dataset.easeComponentCss!);
    });
  });
}
