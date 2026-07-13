export interface ComponentDemo {
  /** Only needed when demoSidebar is enabled — used as the nav link text. */
  label?: string;
  /** Just return the raw demo HTML — paste markup straight in here. */
  renderDemo?: () => string;
  /**
   * Raw HTML source for this demo. When set, demo.html renders it as three tabs
   * (Demo / HTML / CSS) instead of just the live preview from renderDemo().
   */
  html?: string;
  /** Raw CSS for this demo — shown in the CSS tab and injected live, scoped to the demo section. */
  css?: string;
  /** Only needed if the demo has JS wiring (buttons, custom attribute toggles, ...). */
  initDemo?: (root: HTMLElement) => void;
}

export interface ComponentDoc {
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  render: () => string;
  demos: ComponentDemo[];
  /** Set false to skip the local feature sidebar on demo.html (few enough demos to just scroll). */
  demoSidebar?: boolean;
}
