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
    items: [{ slug: "onScroll", label: "onScroll (ScrollTrigger)" }],
  },
  {
    slug: "scope",
    label: "Media scope",
    items: [{ slug: "media", label: "six.media()" }],
  },
  {
    slug: "utils",
    label: "Tiện ích",
    items: [
      { slug: "set", label: "six.set()" },
      { slug: "setDefaults", label: "six.setDefaults()" },
      { slug: "selectors", label: "getClass() / getId()" },
      { slug: "initElements", label: "six.initElements()" },
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
      { slug: "mask", label: "mask" },
      { slug: "lifecycle", label: "split() / revert() / kill()" },
    ],
  },
];

export function findFirstLeaf(nav: NavGroup[]): string {
  const group = nav[0];
  return `${group.slug}/${group.items[0].slug}`;
}
