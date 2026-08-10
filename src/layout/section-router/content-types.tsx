import { h } from "../../jsx";
import type { ComponentDemo } from "../../content/components/types";

export interface ContentEntry {
  eyebrow: string;
  title: string;
  lead: string;
  render: () => string;
  init?: (root: HTMLElement) => void;
  /** Interactive demo(s) for this page — when set, a "Xem demo ↗" button links out to a dedicated demo page instead of showing the demo inline. */
  demos?: ComponentDemo[];
  /** Path under public/ to a standalone demo HTML page — when set (instead of `demos`), the "Xem demo ↗" button opens this file directly rather than routing through demo.html. */
  demoUrl?: string;
}

export type ContentMap = Record<string, ContentEntry>;

export function placeholderEntry(eyebrow: string, title: string): ContentEntry {
  return {
    eyebrow,
    title,
    lead: "Trang demo cho mục này đang được xây dựng.",
    render: () => <div class="content-pane__placeholder">Nội dung đang được cập nhật — quay lại sau nhé.</div>,
  };
}
