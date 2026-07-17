import "@six-js/core/style.css";
import "./styles/base.css";
import { enableElements } from "@six-js/core";
import { renderHeader } from "./layout/header/header";
import { mountThemeToggle } from "./layout/header/theme";
import { renderFooter } from "./layout/footer/footer";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  ${renderHeader("home")}

  <header class="hero container">
    <sx-animate type="fade-up" duration="0.6">
      <h1 class="hero__title">Animation, không cần đóng gói cảm giác nặng nề.</h1>
    </sx-animate>
    <sx-animate type="fade-up" duration="0.5" delay="0.3">
      <p class="hero__tagline">
        six-js là core animation engine + web components nhẹ, để bạn dựng chuyển động mượt
        mà không phải học một framework mới.
      </p>
    </sx-animate>
    <sx-animate type="fade-up" duration="0.5" delay="0.5">
      <div class="hero__actions">
        <a class="btn btn--primary" href="/components.html">Xem Components</a>
        <a class="btn btn--ghost" href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </div>
    </sx-animate>
  </header>

  <section class="hero__boxes container">
    <sx-animate type="fade-up" cascade delay="0.8" class="hero-box hero-box--1">to()</sx-animate>
    <sx-animate type="fade-up" cascade delay="0.8" class="hero-box hero-box--2">timeline()</sx-animate>
    <sx-animate type="fade-up" cascade delay="0.8" class="hero-box hero-box--3">context()</sx-animate>
  </section>

  <section class="container home-links">
    <sx-animate type="fade-up" cascade delay="1">
      <a href="/installation.html">
        <h3>Installation →</h3>
        <p>Cách cài đặt @six-js/core qua npm, CDN, hoặc chạy từ source.</p>
      </a>
    </sx-animate>
    <sx-animate type="fade-up" cascade delay="1">
      <a href="/components.html">
        <h3>Components →</h3>
        <p>sx-dialog, sx-slider, sx-marquee, sx-animate — demo & attribute reference.</p>
      </a>
    </sx-animate>
    <sx-animate type="fade-up" cascade delay="1">
      <a href="/animatable.html">
        <h3>Animatable →</h3>
        <p>six.to(), six.timeline(), stagger, onScroll, smoothScroll(), context(), breakpoint() — toàn bộ animation engine.</p>
      </a>
    </sx-animate>
    <sx-animate type="fade-up" cascade delay="1">
      <a href="/showcase.html">
        <h3>Showcase →</h3>
        <p>Sản phẩm thực tế dựng bằng six-js.</p>
      </a>
    </sx-animate>
  </section>

  ${renderFooter()}
`;

mountThemeToggle(document);
enableElements();
