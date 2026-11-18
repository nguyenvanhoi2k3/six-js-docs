import { VERSION } from "@six-js/core";
import { h } from "../../jsx";

export type ActiveSection = "installation" | "components" | "core" | "ease" | "plugins" | "showcase" | "checklist" | "notes";

/** Tool tiện ích gom vào menu "Tools" để thanh header không bị dài. */
const TOOLS: { section: ActiveSection; href: string; label: string; desc: string }[] = [
  { section: "checklist", href: "checklist.html", label: "Shopify requirements", desc: "Checklist duyệt Theme Store" },
  { section: "notes", href: "notes.html", label: "Notes", desc: "Ghi chú dùng chung" },
];

// Đóng menu Tools khi bấm ra ngoài hoặc nhấn Esc (<details> tự mở/đóng khi bấm vào summary).
document.addEventListener("click", (e) => {
  document.querySelectorAll<HTMLDetailsElement>(".site-header__dropdown[open]").forEach((menu) => {
    if (!menu.contains(e.target as Node)) menu.open = false;
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll<HTMLDetailsElement>(".site-header__dropdown[open]").forEach((menu) => {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  });
});

export function renderHeader(active: ActiveSection): string {
  const link = (section: ActiveSection, href: string, label: string) => (
    <a href={href} class={section === active ? "is-active" : undefined}>
      {label}
    </a>
  );

  return (
    <header class="site-header">
      <a class="site-header__brand" href="installation.html">
        <img class="logo_icon" src="sixjs_logo_fav_56x56.svg" alt="" width="885" height="252" />
        <img class="logo_text logo_text--light" src="sixjs_logo_text.png" alt="" width="885" height="252" />
        <img class="logo_text logo_text--dark" src="sixjs_logo_darkmode.png" alt="" width="885" height="252" />
      </a>

      <div class="site-header__menu">
        <nav class="site-header__nav">
          {link("installation", "installation.html", "Installation")}
          {link("components", "components.html", "Components")}
          {link("core", "core.html", "Core")}
          {link("ease", "ease.html", "Easing")}
          {link("plugins", "plugins.html", "Plugins")}
          {link("showcase", "showcase.html", "Showcase")}
        </nav>

        {/* Nằm ngoài .site-header__nav vì nav có overflow-x (cuộn ngang trên mobile) sẽ cắt mất dropdown. */}
        <details class="site-header__dropdown">
          <summary class={TOOLS.some((t) => t.section === active) ? "is-active" : undefined}>Tools</summary>
          <div class="site-header__dropdown-panel">
            {TOOLS.map((tool) => (
              <a href={tool.href} class={tool.section === active ? "is-active" : undefined}>
                <span class="site-header__dropdown-label">{tool.label}</span>
                <span class="site-header__dropdown-desc">{tool.desc}</span>
              </a>
            ))}
          </div>
        </details>
      </div>

      <div class="site-header__actions">
        <span class="site-header__version" title="Phiên bản">
          v{VERSION}
        </span>
        <button class="site-header__icon-btn" data-theme-toggle type="button" aria-label="Chuyển giao diện sáng / tối">
          <svg class="icon-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 1.8v2.1M10 16.1v2.1M18.2 10h-2.1M3.9 10H1.8M15.6 4.4l-1.5 1.5M5.9 14.1l-1.5 1.5M15.6 15.6l-1.5-1.5M5.9 5.9 4.4 4.4" />
          </svg>
          <svg class="icon-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 12.3A7.5 7.5 0 0 1 7.7 2.5a7.5 7.5 0 1 0 9.8 9.8Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
