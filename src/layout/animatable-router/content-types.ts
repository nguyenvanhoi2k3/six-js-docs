export interface ContentEntry {
  eyebrow: string;
  title: string;
  lead: string;
  render: () => string;
  init?: (root: HTMLElement) => void;
}

export type ContentMap = Record<string, ContentEntry>;

export function placeholderEntry(eyebrow: string, title: string): ContentEntry {
  return {
    eyebrow,
    title,
    lead: "Trang demo cho mục này đang được xây dựng.",
    render: () => `<div class="content-pane__placeholder">Nội dung đang được cập nhật — quay lại sau nhé.</div>`,
  };
}
