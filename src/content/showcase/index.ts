export interface ShowcaseItem {
  title: string;
  gradient: string;
  /** Path under public/ to a standalone HTML5 demo page — opened directly on click, and fetched on demand for the "Xem code" dialog. */
  demoUrl: string;
  /** Plugin/module names used inside the demo — drives the plugin filter chips on the showcase page. */
  plugins: string[];
  /** Path under public/ to a screenshot thumbnail — falls back to the gradient when omitted. */
  thumb?: string;
  /** Path under public/ to a muted looping preview clip — plays on card hover, using `thumb` as its poster. */
  thumbVideo?: string;
}

export const showcaseItems: ShowcaseItem[] = [
  {
    title: "Text Shatter",
    gradient: "linear-gradient(135deg,#ffd166,#1c1a2b)",
    demoUrl: "showcase-demos/text-shatter.html",
    plugins: ["Burst", "SplitText"],
    thumb: "showcase-thumbs/text-shatter.jpg",
    thumbVideo: "showcase-thumbs/text-shatter.mp4",
  },
  {
    title: "Horizontal Storytelling",
    gradient: "linear-gradient(135deg,#db2777,#241f3d)",
    demoUrl: "showcase-demos/horizontal-storytelling.html",
    plugins: ["OnScroll", "SmoothScroll", "SplitText"],
    thumb: "showcase-thumbs/horizontal-storytelling.jpg",
    thumbVideo: "showcase-thumbs/horizontal-storytelling.mp4",
  },
  {
    title: "Scroll Progress Ring",
    gradient: "linear-gradient(135deg,#78a5ee,#1c1a2b)",
    demoUrl: "showcase-demos/svg-scroll-progress.html",
    plugins: ["SvgMotion", "OnScroll"],
    thumb: "showcase-thumbs/scroll-progress-ring.jpg",
    thumbVideo: "showcase-thumbs/scroll-progress-ring.mp4",
  },
  {
    title: "Cart Free Fall",
    gradient: "linear-gradient(135deg,#4a6fd6,#1c1a33)",
    demoUrl: "showcase-demos/mini-cart-tween.html",
    plugins: ["Burst"],
    thumb: "showcase-thumbs/cart-free-fall.jpg",
    thumbVideo: "showcase-thumbs/cart-free-fall.mp4",
  },
];
