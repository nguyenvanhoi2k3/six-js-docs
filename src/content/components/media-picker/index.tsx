import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const DEMO_CSS = `.media-picker-demo {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.swatches {
  display: flex;
  gap: 8px;
}

.swatches label {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: block;
  cursor: pointer;
  border: 2px solid transparent;
}

.swatches input:checked + label {
  border-color: #1a1c20;
}

.swatches input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.preview {
  width: 160px;
  height: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: sans-serif;
  transition: background-color 0.2s;
}`;

export const mediaPicker: ComponentDoc = {
  slug: "media-picker",
  eyebrow: "sx-media-picker",
  title: "Media Picker",
  lead: "Bọc quanh 1 nhóm swatch radio/checkbox mang data-media-id, bắn sự kiện trên window để 1 sx-slider[media-sync] ở nơi khác cùng trang nhảy ảnh theo swatch đang chọn.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-media-picker name="product-gallery">
  <label><input type="radio" name="color" data-media-id="1001" checked> Đỏ</label>
  <label><input type="radio" name="color" data-media-id="1002"> Xanh</label>
</sx-media-picker>

<!-- ở nơi khác trong trang -->
<sx-slider media-sync="product-gallery" effect="fade">
  <sx-slider-track>
    <sx-slider-slide data-media-id="1001">...</sx-slider-slide>
    <sx-slider-slide data-media-id="1002">...</sx-slider-slide>
  </sx-slider-track>
</sx-slider>`)}
      <p class="note">
        <span class="c-accent">sx-media-picker</span> và <span class="c-accent">sx-slider</span> không cần nằm cạnh nhau hay lồng nhau — chỉ cần khớp <code>name</code>/<code>media-sync</code>, giao tiếp qua sự kiện trên{" "}
        <code>window</code>, giống cách <span class="c-accent">sx-dialog-trigger</span>/<span class="c-accent">sx-popover-trigger</span> trỏ tới dialog/popover bằng <code>name</code>.
      </p>
      <p class="note">Không tự broadcast swatch đang checked sẵn khi mới connect — chỉ bắn khi người dùng thật sự đổi lựa chọn, tránh ảnh nhấp nháy sai lúc tải trang.</p>

      <h2>Attributes</h2>
      {attrsTable([["name", "khớp với media-sync của sx-slider cần điều khiển", "—"]])}
      <p class="note">Mỗi input con cần <code>data-media-id</code> để biết broadcast id nào khi được chọn.</p>

      <h2>Event</h2>
      {eventsTable([['sx-media-select (trên window)', "khi 1 swatch được chọn — detail: { name, mediaId }"]])}
    </>
  ),

  demos: [
    {
      label: "Đổi ảnh preview theo swatch",
      html: `<div class="media-picker-demo">
  <sx-media-picker name="demo-gallery" class="swatches">
    <label><input type="radio" name="demo-color" data-media-id="1001" checked /><span style="background:#ff7a45;display:block;width:100%;height:100%;border-radius:50%"></span></label>
    <label><input type="radio" name="demo-color" data-media-id="1002" /><span style="background:#4a7dff;display:block;width:100%;height:100%;border-radius:50%"></span></label>
    <label><input type="radio" name="demo-color" data-media-id="1003" /><span style="background:#47c98a;display:block;width:100%;height:100%;border-radius:50%"></span></label>
  </sx-media-picker>

  <div id="demoPreview" class="preview" style="background:#ff7a45">media #1001</div>
</div>
<p class="note">Demo thay preview trực tiếp (thay cho sx-slider thật) để thấy rõ sự kiện "sx-media-select" bắn ra khi đổi swatch.</p>`,
      css: DEMO_CSS,
      js: `window.addEventListener('sx-media-select', (e) => {
  if (e.detail.name !== 'demo-gallery') return;
  console.log('đổi sang media', e.detail.mediaId);
});`,
      initDemo: (root) => {
        const preview = root.querySelector<HTMLElement>("#demoPreview")!;
        const colors: Record<string, string> = { "1001": "#ff7a45", "1002": "#4a7dff", "1003": "#47c98a" };
        window.addEventListener("sx-media-select", (e: any) => {
          if (e.detail.name !== "demo-gallery") return;
          preview.style.background = colors[e.detail.mediaId] ?? "#999";
          preview.textContent = `media #${e.detail.mediaId}`;
        });
      },
    },
  ],
};
