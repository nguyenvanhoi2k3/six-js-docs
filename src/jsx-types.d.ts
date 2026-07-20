export {};

type JSXAttrs = Record<string, unknown>;

declare global {
  namespace JSX {
    type Element = string;

    interface ElementChildrenAttribute {
      children: unknown;
    }

    // Intentionally empty (no index signature) — IntrinsicAttributes gets intersected
    // with every element/component prop type, and an index-signature type here would
    // force every literal props object (e.g. Fragment's `{ children }`) to redundantly
    // satisfy it too.
    interface IntrinsicAttributes {}

    interface IntrinsicElements {
      a: JSXAttrs;
      article: JSXAttrs;
      aside: JSXAttrs;
      audio: JSXAttrs;
      blockquote: JSXAttrs;
      br: JSXAttrs;
      button: JSXAttrs;
      canvas: JSXAttrs;
      circle: JSXAttrs;
      code: JSXAttrs;
      defs: JSXAttrs;
      details: JSXAttrs;
      div: JSXAttrs;
      dl: JSXAttrs;
      dt: JSXAttrs;
      dd: JSXAttrs;
      em: JSXAttrs;
      figcaption: JSXAttrs;
      figure: JSXAttrs;
      footer: JSXAttrs;
      form: JSXAttrs;
      g: JSXAttrs;
      h1: JSXAttrs;
      h2: JSXAttrs;
      h3: JSXAttrs;
      h4: JSXAttrs;
      header: JSXAttrs;
      hr: JSXAttrs;
      iframe: JSXAttrs;
      img: JSXAttrs;
      input: JSXAttrs;
      label: JSXAttrs;
      li: JSXAttrs;
      main: JSXAttrs;
      nav: JSXAttrs;
      ol: JSXAttrs;
      option: JSXAttrs;
      p: JSXAttrs;
      path: JSXAttrs;
      pre: JSXAttrs;
      rect: JSXAttrs;
      section: JSXAttrs;
      select: JSXAttrs;
      small: JSXAttrs;
      source: JSXAttrs;
      span: JSXAttrs;
      strong: JSXAttrs;
      summary: JSXAttrs;
      svg: JSXAttrs;
      table: JSXAttrs;
      tbody: JSXAttrs;
      td: JSXAttrs;
      textarea: JSXAttrs;
      th: JSXAttrs;
      thead: JSXAttrs;
      tr: JSXAttrs;
      ul: JSXAttrs;
      video: JSXAttrs;

      /** Fallback for custom elements (sx-dialog, sx-slider-slide, ...) not listed above. */
      [tag: string]: JSXAttrs;
    }
  }
}
