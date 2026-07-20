import "./index.scss";
import { h, Fragment } from "../../jsx";

export { initHome } from "./tween";

export function renderHome(): string {
  return (
    <>
      <div id="home-page">
        <div
          id="stage"
          style="position:relative;overflow:hidden;background:var(--color-bg)"
        >
          <div class="aurora" aria-hidden="true">
            <span class="blob b1"></span>
            <span class="blob b2"></span>
            <span class="blob b3"></span>
          </div>
          <canvas
            id="stars"
            style="position:absolute;inset:0;width:100%;height:100%;z-index:1;opacity:.5"
          ></canvas>
          
          <div class="hero hero-layout">
            <div class="hero-grid">
              <div class="hero-content">
                <p class="hero-kicker hero-text--1">
                  <span class="hero-kicker__rule" aria-hidden="true"></span>
                  The 6 kilobyte animation engine
                </p>

                <h1 class="hero-title">
                  <span class="hero-text--2">Animate anything.</span>
                  <span class="hero-text--3">
                    Ship{" "}
                    <span class="hero-title__highlight" data-hero-highlight>
                      six kilobytes.
                    </span>
                  </span>
                  <svg
                    class="hero-title__underline"
                    data-hero-underline
                    width="330"
                    height="16"
                    viewBox="0 0 330 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M3 10C66 3 142 3 198 8S300 13 327 6" />
                  </svg>
                </h1>

                <p class="hero-desc hero-fade-up">
                  A dependency-free motion library for the web — tweens, timelines, animate onscroll, split text and
                  physics. One familiar API, 60fps everywhere.
                </p>

                <div class="hero-actions hero-fade-up">
                  <a href="/installation.html" class="btn btn--primary">
                    Start animating
                  </a>
                  <a href="/showcase.html" class="btn btn--ghost">
                    See the demos
                  </a>
                </div>

                <div class="hero-snippet hero-fade-up">
                  <code class="hero-snippet__code">{`six.to(box, { x: 62, rotate: 360 })`}</code>
                  <span class="hero-snippet__stage" aria-hidden="true">
                    <span class="hero-snippet__box" data-hero-chip-box></span>
                  </span>
                </div>
              </div>

              <div class="hero-shapes" aria-hidden="true">
                <div class="hero-shapes__orbit">
                  <span class="hero-shapes__dot"></span>
                </div>
                <svg class="hero-shape hero-shape--blob" viewBox="0 0 200 200" width="184" height="184" aria-hidden="true">
                  <defs>
                    <linearGradient id="hero-blob-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stop-color="var(--primary)" />
                      <stop offset="1" stop-color="color-mix(in srgb, var(--primary) 55%, black)" />
                    </linearGradient>
                  </defs>
                  <path
                    data-hero-blob-path
                    d="M176,100 C176,142.02 142.02,176 100,176 C57.98,176 24,142.02 24,100 C24,57.98 57.98,24 100,24 C142.02,24 176,57.98 176,100 Z"
                    fill="url(#hero-blob-gradient)"
                  />
                </svg>
                <div class="hero-shape-wrap" data-hero-parallax sx-parallax-strength="40">
                  <div class="hero-shape hero-shape--square-lg" data-hero-wander></div>
                </div>
                <div class="hero-shape-wrap" data-hero-parallax sx-parallax-strength="28">
                  <div class="hero-shape hero-shape--circle-outline" data-hero-wander></div>
                </div>
                <div class="hero-shape-wrap" data-hero-parallax sx-parallax-strength="32">
                  <div class="hero-shape hero-shape--square-md" data-hero-wander></div>
                </div>
                <div class="hero-shape-wrap" data-hero-parallax sx-parallax-strength="20">
                  <div class="hero-shape hero-shape--circle-sm" data-hero-wander></div>
                </div>
                <div class="hero-shape-wrap" data-hero-parallax sx-parallax-strength="16">
                  <div class="hero-shape hero-shape--square-outline-sm" data-hero-wander></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
