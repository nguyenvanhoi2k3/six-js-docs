export interface ShowcaseItem {
  title: string;
  subtitle: string;
  gradient: string;
  /** Path under public/ to a standalone HTML5 demo page — opened directly on click, and fetched on demand for the "Xem code" dialog. */
  demoUrl: string;
}

export const showcaseItems: ShowcaseItem[] = [
  {
    title: "SplitText",
    subtitle: "chars / words / lines + overflow mask + lifecycle",
    gradient: "linear-gradient(135deg,#7c5cff,#241f3d)",
    demoUrl: "/showcase-demos/split-text.html",
  },
  {
    title: "SmoothScroll",
    subtitle: "lerp damping + scrollTo(duration) + stop()/start()",
    gradient: "linear-gradient(135deg,#6428e0,#1c1a2b)",
    demoUrl: "/showcase-demos/smooth-scroll.html",
  },
  {
    title: "ScrambleText",
    subtitle: "scramble reveal + rightToLeft + odometer",
    gradient: "linear-gradient(135deg,#ffb454,#241f3d)",
    demoUrl: "/showcase-demos/scramble-text.html",
  },
  {
    title: "Burst",
    subtitle: "like-button confetti + SplitText char shatter",
    gradient: "linear-gradient(135deg,#ffd166,#1c1a2b)",
    demoUrl: "/showcase-demos/burst.html",
  },
  {
    title: "SvgMotion",
    subtitle: 'mode: "draw" / "morph" / "path"',
    gradient: "linear-gradient(135deg,#78a5ee,#241f3d)",
    demoUrl: "/showcase-demos/svg-motion.html",
  },
  {
    title: "Parallax",
    subtitle: "layered depth drift theo con trỏ chuột",
    gradient: "linear-gradient(135deg,#5ac8f5,#1c1a2b)",
    demoUrl: "/showcase-demos/parallax.html",
  },
];
