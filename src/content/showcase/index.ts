import type { CodeLang } from "../shared";

export interface ShowcaseItem {
  title: string;
  site: string;
  href: string;
  gradient: string;
  code: string;
  codeLang: CodeLang;
}

export const showcaseItems: ShowcaseItem[] = [
  {
    title: "Studio Nord — Portfolio 2025",
    site: "studio-nord.example",
    href: "#",
    gradient: "linear-gradient(135deg,#7c5cff,#241f3d)",
    code: `import { SplitText } from "@six-js/core/SplitText";

const split = new SplitText(".hero-title", { type: "words,lines", overflow: "lines" });

six.from(split.lines, {
  y: "100%",
  duration: 0.8,
  ease: "cubicOut",
  stagger: 0.08,
});`,
    codeLang: "js",
  },
  {
    title: "Nova Interactive",
    site: "nova.example",
    href: "#",
    gradient: "linear-gradient(135deg,#ff6b4a,#241f3d)",
    code: `six.to(".panel", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "cubicOut",
  onScroll: {
    start: "top bottom",
    end: "top center",
  },
});`,
    codeLang: "js",
  },
  {
    title: "Atlas Type Foundry",
    site: "atlas-type.example",
    href: "#",
    gradient: "linear-gradient(135deg,#47bfff,#1c1a2b)",
    code: `import { ScrambleText } from "@six-js/core/ScrambleText";

ScrambleText(".specimen", {
  text: "ATLAS TYPE FOUNDRY",
  duration: 1.2,
  chars: "upperCase",
});`,
    codeLang: "js",
  },
  {
    title: "Kinetic Museum",
    site: "kinetic-museum.example",
    href: "#",
    gradient: "linear-gradient(135deg,#22c55e,#1c1a2b)",
    code: `import { SvgMotion } from "@six-js/core/SvgMotion";

SvgMotion(".exhibit-line", {
  mode: "draw",
  duration: 1.6,
  ease: "cubicOut",
});`,
    codeLang: "js",
  },
  {
    title: "Loop Studio",
    site: "loop.example",
    href: "#",
    gradient: "linear-gradient(135deg,#eab308,#241f3d)",
    code: `<sx-marquee direction="left" speed="60" pause-on-hover="true">
  <sx-marquee-inner>
    <sx-marquee-item><span>Loop Studio — selected work</span></sx-marquee-item>
  </sx-marquee-inner>
</sx-marquee>`,
    codeLang: "html",
  },
  {
    title: "Drift Agency",
    site: "drift.example",
    href: "#",
    gradient: "linear-gradient(135deg,#ec4899,#1c1a2b)",
    code: `<sx-slider per-view="1" effect="fade" loop autoplay interval="4">
  <sx-slider-track>
    <sx-slider-slide><div class="slide">Case study 1</div></sx-slider-slide>
    <sx-slider-slide><div class="slide">Case study 2</div></sx-slider-slide>
  </sx-slider-track>
  <sx-slider-pagination></sx-slider-pagination>
</sx-slider>`,
    codeLang: "html",
  },
];
