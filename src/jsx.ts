export type JSXChild =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXChild[];

type Component = (props: Record<string, unknown>) => string;

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function renderChildren(children: JSXChild[]): string {
  let out = "";
  for (const child of children) {
    if (
      child === null ||
      child === undefined ||
      child === false ||
      child === true
    )
      continue;
    out += Array.isArray(child) ? renderChildren(child) : String(child);
  }
  return out;
}

// Keys the JSX transform injects for its own bookkeeping (dev-mode source maps,
// element identity) — never meant to reach the DOM as attributes.
const RESERVED_PROPS = new Set([
  "children",
  "key",
  "ref",
  "__self",
  "__source",
]);

function renderAttrs(props: Record<string, unknown> | null): string {
  if (!props) return "";
  let out = "";
  for (const [key, value] of Object.entries(props)) {
    if (
      RESERVED_PROPS.has(key) ||
      value === false ||
      value === null ||
      value === undefined
    )
      continue;
    out += value === true ? ` ${key}` : ` ${key}="${String(value)}"`;
  }
  return out;
}

export function h(
  tag: string | Component,
  props: Record<string, unknown> | null,
  ...children: JSXChild[]
): string {
  if (typeof tag === "function") return tag({ ...props, children });

  const attrs = renderAttrs(props);
  if (VOID_TAGS.has(tag)) return `<${tag}${attrs} />`;
  return `<${tag}${attrs}>${renderChildren(children)}</${tag}>`;
}

export function Fragment(props: { children?: JSXChild | JSXChild[] }): string {
  const children = Array.isArray(props.children)
    ? props.children
    : props.children !== undefined
      ? [props.children]
      : [];

  return renderChildren(children);
}
