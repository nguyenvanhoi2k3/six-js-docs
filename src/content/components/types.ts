export interface ComponentDemo {
  /** Only needed when demoSidebar is enabled — used as the nav link text. */
  label?: string;
  /** Just return the raw demo HTML — paste markup straight in here. */
  renderDemo: () => string;
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
