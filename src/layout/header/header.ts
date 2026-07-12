import { VERSION } from "@six-js/core";

export type ActiveSection = "home" | "installation" | "components" | "animatable" | "showcase";

export function renderHeader(active: ActiveSection): string {
  const link = (section: ActiveSection, href: string, label: string) =>
    `<a href="${href}"${section === active ? ' class="is-active"' : ""}>${label}</a>`;

  return `
    <header class="site-header">
      <a class="site-header__brand" href="/index.html">
        <img class="logo_icon" src="/sixjs_logo_fav_56x56.svg" alt="" width="885" height="252" />
        <img class="logo_text" src="/sixjs_logo_text.png" alt="" width="885" height="252" />
      </a>

      <nav class="site-header__nav">
        ${link("installation", "/installation.html", "Installation")}
        ${link("components", "/components.html", "Components")}
        ${link("animatable", "/animatable.html", "Animatable")}
        ${link("showcase", "/showcase.html", "Showcase")}
      </nav>

      <div class="site-header__actions">
        <span class="site-header__version" title="Phiên bản">v${VERSION}</span>
        <button class="site-header__icon-btn" data-theme-toggle type="button" aria-label="Chuyển giao diện sáng / tối">
          <svg class="icon-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <circle cx="10" cy="10" r="3.5"/>
            <path d="M10 1.8v2.1M10 16.1v2.1M18.2 10h-2.1M3.9 10H1.8M15.6 4.4l-1.5 1.5M5.9 14.1l-1.5 1.5M15.6 15.6l-1.5-1.5M5.9 5.9 4.4 4.4"/>
          </svg>
          <svg class="icon-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 12.3A7.5 7.5 0 0 1 7.7 2.5a7.5 7.5 0 1 0 9.8 9.8Z"/>
          </svg>
        </button>
      </div>
    </header>
  `;
}
