export interface NavLeaf {
  slug: string;
  label: string;
  badge?: string;
}

export interface NavGroup {
  slug: string;
  label: string;
  items: NavLeaf[];
}

/** Flat list — one page per component, no dropdown/sub-items in the sidebar. */
export const componentsList: NavLeaf[] = [
  { slug: "dialog", label: "Dialog" },
  { slug: "slider", label: "Slider" },
  { slug: "marquee", label: "Marquee" },
  { slug: "animate", label: "Animate" },
].sort((a, b) => a.label.localeCompare(b.label));

export const animatableNav: NavGroup[] = [
  {
    slug: "tween",
    label: "Tween cơ bản",
    items: [
      { slug: "to", label: "six.to()" },
      { slug: "from", label: "six.from()" },
      { slug: "fromTo", label: "six.fromTo()" },
      { slug: "keyframes", label: "keyframes" },
      { slug: "properties", label: "Thuộc tính & Easing" },
    ],
  },
  {
    slug: "sequence",
    label: "Sắp xếp chuyển động",
    items: [
      { slug: "timeline", label: "six.timeline()" },
      { slug: "stagger", label: "stagger" },
    ],
  },
  {
    slug: "scroll",
    label: "Cuộn trang",
    items: [
      { slug: "onScroll", label: "onScroll (OnScroll)" },
      { slug: "smoothScroll", label: "six.smoothScroll()" },
    ],
  },
  {
    slug: "scope",
    label: "Scope",
    items: [
      { slug: "context", label: "six.context()" },
      { slug: "breakpoint", label: "six.breakpoint()" },
    ],
  },
  {
    slug: "utils",
    label: "Tiện ích",
    items: [
      { slug: "set", label: "six.set()" },
      { slug: "config", label: "six.config()" },
      { slug: "helpers", label: "six.utils" },
      { slug: "enableElements", label: "enableElements()" },
    ],
  },
];

export const pluginsNav: NavGroup[] = [
  {
    slug: "split-text",
    label: "splitText",
    items: [
      { slug: "overview", label: "Tổng quan" },
      { slug: "options", label: "Options" },
      { slug: "overflow", label: "overflow (mask)" },
      { slug: "lifecycle", label: "split() / revert() / kill()" },
    ],
  },
];

export function findFirstLeaf(nav: NavGroup[]): string {
  const group = nav[0];
  return `${group.slug}/${group.items[0].slug}`;
}
