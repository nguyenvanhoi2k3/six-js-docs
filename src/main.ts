import "@six-js/core/style.css";
import "./styles/base.css";
import { six } from "@six-js/core";
import { renderHeader } from "./layout/header/header";
import { mountThemeToggle } from "./layout/header/theme";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("home")}

  <header class="hero container">
    <h1 class="hero__title">Animation, không cần đóng gói cảm giác nặng nề.</h1>
    <p class="hero__tagline">
      six-js là core animation engine + web components nhẹ, để bạn dựng chuyển động mượt
      mà không phải học một framework mới.
    </p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="/components.html">Xem Components</a>
      <a class="btn btn--ghost" href="https://github.com" target="_blank" rel="noopener">GitHub</a>
    </div>
  </header>

  <section class="hero__boxes container">
    <div class="hero-box hero-box--1">to()</div>
    <div class="hero-box hero-box--2">timeline()</div>
    <div class="hero-box hero-box--3">media()</div>
  </section>

  <section class="container home-links">
    <a href="/installation.html">
      <h3>Installation →</h3>
      <p>Cách cài đặt @six-js/core qua npm, CDN, hoặc chạy từ source.</p>
    </a>
    <a href="/components.html">
      <h3>Components →</h3>
      <p>sx-dialog, sx-slider, sx-marquee, sx-animate — demo & attribute reference.</p>
    </a>
    <a href="/animatable.html">
      <h3>Animatable →</h3>
      <p>six.to(), six.timeline(), stagger, onScroll, media() — toàn bộ animation engine.</p>
    </a>
    <a href="/showcase.html">
      <h3>Showcase →</h3>
      <p>Sản phẩm thực tế dựng bằng six-js.</p>
    </a>
  </section>

  <footer class="site-footer">
    <div class="container">six-js docs</div>
  </footer>
`;

mountThemeToggle(document);

six
  .timeline()
  .from(".hero__title", { opacity: 0, y: 24, duration: 0.6 })
  .from(".hero__tagline", { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
  .from(".hero__actions", { opacity: 0, y: 16, duration: 0.5 }, "-=0.3")
  .from(".hero-box", { opacity: 0, y: 20, duration: 0.5, stagger: 0.12 }, "-=0.2")
  .from(".home-links a", { opacity: 0, y: 16, duration: 0.4, stagger: 0.08 }, "-=0.2");
