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
  {
    title: "Scroll Text Fill",
    gradient: "linear-gradient(135deg,#5eead4,#1c1a2b)",
    demoUrl: "showcase-demos/scroll-text-fill.html",
    plugins: ["OnScroll", "SplitText"],
    thumb: "showcase-thumbs/scroll-text-fill.jpg",
    thumbVideo: "showcase-thumbs/scroll-text-fill.mp4",
  },
  {
    title: "Cursor Chase",
    gradient: "linear-gradient(135deg,#6b7bff,#1c1a2b)",
    demoUrl: "showcase-demos/cursor-chase.html",
    plugins: [],
    thumb: "showcase-thumbs/cursor-chase.jpg",
    thumbVideo: "showcase-thumbs/cursor-chase.mp4",
  },
  {
    title: "Horizontal Scroll Gallery",
    gradient: "linear-gradient(135deg,#f97316,#1c1a2b)",
    demoUrl: "showcase-demos/horizontal-scroll-gallery.html",
    plugins: ["OnScroll", "SmoothScroll"],
    thumb: "showcase-thumbs/horizontal-scroll-gallery.jpg",
    thumbVideo: "showcase-thumbs/horizontal-scroll-gallery.mp4",
  },
  {
    title: "Magnetic Buttons",
    gradient: "linear-gradient(135deg,#a78bfa,#1c1a2b)",
    demoUrl: "showcase-demos/magnetic-button.html",
    plugins: [],
    thumb: "showcase-thumbs/magnetic-button.jpg",
    thumbVideo: "showcase-thumbs/magnetic-button.mp4",
  },
  {
    title: "Gift Box Burst",
    gradient: "linear-gradient(135deg,#ffb4b4,#1c1a2b)",
    demoUrl: "showcase-demos/gift-box-burst.html",
    plugins: ["Burst"],
    thumb: "showcase-thumbs/gift-box-burst.jpg",
    thumbVideo: "showcase-thumbs/gift-box-burst.mp4",
  },
  {
    title: "Video Play Onscroll",
    gradient: "linear-gradient(135deg,#c6ffb4,#1c1a2b)",
    demoUrl: "showcase-demos/video-onscroll.html",
    plugins: ["OnScroll", "SmoothScroll"],
    thumb: "showcase-thumbs/video-onscroll.jpg",
    thumbVideo: "showcase-thumbs/video-onscroll.mp4",
  },
  {
    title: "Marquee Direction Onscroll",
    gradient: "linear-gradient(135deg,#fb7185,#1c1a2b)",
    demoUrl: "showcase-demos/marquee-direction-onscroll.html",
    plugins: ["Watcher", "SmoothScroll", "SplitText", "OnScroll"],
    thumb: "showcase-thumbs/marquee-direction-onscroll.jpg",
    thumbVideo: "showcase-thumbs/marquee-direction-onscroll.mp4",
  },
  {
    title: "Zigzag Gallery Parallax",
    gradient: "linear-gradient(135deg,#38bdf8,#1c1a2b)",
    demoUrl: "showcase-demos/zigzag-gallery-parallax.html",
    plugins: ["OnScroll", "SmoothScroll"],
    thumb: "showcase-thumbs/zigzag-gallery-parallax.jpg",
    thumbVideo: "showcase-thumbs/zigzag-gallery-parallax.mp4",
  },
];
