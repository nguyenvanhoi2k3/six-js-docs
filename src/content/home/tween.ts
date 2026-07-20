import { six } from "@six-js/core";
import { SplitText } from "@six-js/core/SplitText";
import { SvgMotion } from "@six-js/core/SvgMotion";
import { Parallax } from "@six-js/core/Parallax";

export function initHome() {
  interface StarfieldOptions {
    count?: number; // số sao
    connect?: number; // khoảng cách nối 2 sao (px)
    color?: string; // rgb accent, vd "145,132,217"
  }

  interface Star {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
  }

  /** Nền sao trôi tự do, KHÔNG phản ứng con trỏ. Trả về hàm cleanup. */
  function startStarfield(
    host: HTMLElement,
    canvas: HTMLCanvasElement,
    opts: StarfieldOptions = {},
  ): () => void {
    const { count = 60, connect = 110, color = "145,132,217" } = opts;

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = reduce ? Math.round(count * 0.4) : count;
    let W = 0,
      H = 0,
      raf = 0;

    const resize = (): void => {
      const r = host.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const stars: Star[] = [];
    for (let i = 0; i < N; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 2,
      });
    }

    window.addEventListener("resize", resize);

    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);

      for (const p of stars) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.8)`;
        ctx.fill();
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = stars[i],
            b = stars[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < connect) {
            ctx.strokeStyle = `rgba(${color},${0.16 * (1 - d / connect)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return (): void => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }

  const stage = document.getElementById("stage") as HTMLElement;
  const canvas = document.getElementById("stars") as HTMLCanvasElement;
  const stop = startStarfield(stage, canvas, { count: 60, connect: 110 });
  // stop(); // khi unmount

  const kicker = document.querySelector<HTMLElement>(".hero-kicker");
  const split = new SplitText(".hero-text--2, .hero-text--3", {
    type: "chars,words,lines",
    overflow: "lines",
  });
  const underline = document.querySelector<SVGPathElement>(".hero-title__underline path");

  // Underline SVG lives outside the split lines (SplitText's line masks use
  // overflow:clip for the reveal effect, which was cropping the SVG's bottom
  // edge), so its position is synced to the highlighted text manually.
  const heroTitle = document.querySelector<HTMLElement>(".hero-title");
  const highlight = document.querySelector<HTMLElement>("[data-hero-highlight]");
  const underlineSvg = document.querySelector<SVGSVGElement>("[data-hero-underline]");

  const syncUnderlinePosition = (): void => {
    if (!heroTitle || !highlight || !underlineSvg) return;
    const titleBox = heroTitle.getBoundingClientRect();
    const textBox = highlight.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(highlight).fontSize);
    underlineSvg.style.left = `${textBox.left - titleBox.left}px`;
    underlineSvg.style.top = `${textBox.bottom - titleBox.top - fontSize * 0.14}px`;
    underlineSvg.style.width = `${textBox.width}px`;
  };
  syncUnderlinePosition();
  window.addEventListener("resize", syncUnderlinePosition);
  document.fonts?.ready.then(syncUnderlinePosition);

  six.set(split.chars, { y: "120%", opacity: 0 });
  if (underline) SvgMotion(underline, { mode: "draw", to: "0%", duration: 0 });

  const heroTl = six.timeline();
  if (kicker) heroTl.from(kicker, { opacity: 0, x: -12, duration: 0.4 });
  heroTl.to(
    split.chars,
    { y: 0, opacity: 1, duration: 0.6, ease: "backOut", stagger: 0.02 },
    kicker ? "-=0.15" : 0,
  );
  if (underline) {
    heroTl.call(() => {
      SvgMotion(underline, { mode: "draw", duration: 0.5, ease: "smooth" });
    }, "-=0.2");
  }

  const chipBox = document.querySelector<HTMLElement>("[data-hero-chip-box]");
  if (chipBox) {
    six.to(chipBox, {
      x: 62,
      rotate: 360,
      duration: 1.4,
      repeat: -1,
      repeatDelay: 0.5,
      boomerang: true,
      ease: "smooth",
    });
  }

  const blobPath = document.querySelector<SVGPathElement>("[data-hero-blob-path]");
  if (blobPath) {
    // Circle → rounded square → rounded triangle — deliberately different silhouettes, not just blob wobble.
    const shapes = [
      "M176,100 C176,142.02 142.02,176 100,176 C57.98,176 24,142.02 24,100 C24,57.98 57.98,24 100,24 C142.02,24 176,57.98 176,100 Z",
      "M52,24 L148,24 Q176,24 176,52 L176,148 Q176,176 148,176 L52,176 Q24,176 24,148 L24,52 Q24,24 52,24 Z",
      "M107,32.1 L162.3,127.9 Q169.3,140 155.3,140 L44.7,140 Q30.7,140 37.7,127.9 L93,32.1 Q100,20 107,32.1 Z",
    ];
    let shapeIndex = 0;
    const morphNext = (): void => {
      shapeIndex = (shapeIndex + 1) % shapes.length;
      SvgMotion(blobPath, {
        mode: "morph",
        toShape: shapes[shapeIndex],
        duration: 0.6,
        delay: 0.4,
        ease: "quadInOut",
        onComplete: morphNext,
      });
    };
    morphNext();
  }

  const wanderEls = document.querySelectorAll<HTMLElement>("[data-hero-wander]");
  wanderEls.forEach((el, i) => {
    const range = 36 + Math.random() * 34;
    const wander = (): void => {
      six.to(el, {
        x: (Math.random() - 0.5) * 2 * range,
        y: (Math.random() - 0.5) * 2 * range,
        rotate: (Math.random() - 0.5) * 18,
        duration: 1.1 + Math.random() * 1.1,
        ease: "smooth",
        onComplete: wander,
      });
    };
    window.setTimeout(wander, i * 260);
  });

  // Parallax targets the WRAPPER around each wandering shape (index.tsx), not the shape itself —
  // Parallax() writes into the same transform cache six.to() uses but bypasses the Tween overwrite
  // system, so it would fight the wander tween above every frame if it shared the same element.
  Parallax("[data-hero-parallax]", { lerp: 0.12 });

  six.from(".hero-fade-up",{y: 30, opacity: 0, delay: 0.4, duration: 0.4, ease: "quadOut", stagger: 0.3})
}
