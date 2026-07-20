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
].sort((a, b) => a.label.localeCompare(b.label));

export const coreNav: NavGroup[] = [
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
    items: [{ slug: "onScroll", label: "onScroll (OnScroll)" }],
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
    ],
  },
];

export const pluginsNav: NavGroup[] = [
  {
    slug: "split-text",
    label: "SplitText",
    items: [
      { slug: "overview", label: "Tổng quan" },
      { slug: "options", label: "Options" },
      { slug: "overflow", label: "overflow (mask)" },
      { slug: "lifecycle", label: "split() / revert() / kill()" },
    ],
  },
  {
    slug: "smooth-scroll",
    label: "SmoothScroll",
    items: [
      { slug: "overview", label: "Tổng quan" },
      { slug: "options", label: "Options" },
      { slug: "instance", label: "Instance" },
    ],
  },
  {
    slug: "scramble-text",
    label: "ScrambleText",
    items: [
      { slug: "overview", label: "Tổng quan" },
      { slug: "options", label: "Options" },
      { slug: "odometer", label: 'mode: "odometer"' },
    ],
  },
  {
    slug: "burst",
    label: "Burst",
    items: [
      { slug: "overview", label: "Tổng quan" },
      { slug: "options", label: "Options" },
    ],
  },
  {
    slug: "svg-motion",
    label: "SvgMotion",
    items: [
      { slug: "draw", label: 'mode: "draw"' },
      { slug: "morph", label: 'mode: "morph"' },
      { slug: "motion-path", label: 'mode: "path"' },
    ],
  },
  {
    slug: "parallax",
    label: "Parallax",
    items: [
      { slug: "overview", label: "Tổng quan" },
      { slug: "options", label: "Options" },
    ],
  },
];

export function findFirstLeaf(nav: NavGroup[]): string {
  const group = nav[0];
  return `${group.slug}/${group.items[0].slug}`;
}
