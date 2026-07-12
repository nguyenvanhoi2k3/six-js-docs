export type Theme = "dark" | "light";

const STORAGE_KEY = "six-js-theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export function getInitialTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme(): Theme {
  const theme = getInitialTheme();
  applyTheme(theme);
  return theme;
}

export function toggleTheme(): Theme {
  const current: Theme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next: Theme = current === "light" ? "dark" : "light";
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore (private browsing / storage disabled)
  }
  return next;
}

export function mountThemeToggle(root: ParentNode): void {
  initTheme();
  root.querySelector<HTMLButtonElement>("[data-theme-toggle]")?.addEventListener("click", () => toggleTheme());
}
