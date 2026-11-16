import "./index.scss";
import "./lightbox.css";
import LIGHTBOX_CSS from "./lightbox.css?raw";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const COLORS = ["%23ff7a45", "%234a7dff", "%2347c98a", "%23c957ff", "%23ffb020", "%23ff5c8a"];

// width/height 1200 cho SVG có kích thước gốc lớn - lightbox chỉ thu nhỏ ảnh cho vừa (max-width/
// max-height), không phóng to, nên kích thước gốc nhỏ sẽ khiến ảnh trong lightbox bé tí.
const thumb = (i: number): string =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='${COLORS[i % COLORS.length]}'/%3E%3Ctext x='200' y='222' font-family='sans-serif' font-size='64' font-weight='600' fill='white' text-anchor='middle'%3E${i + 1}%3C/text%3E%3C/svg%3E`;

const LIGHTBOX_ATTRS = `dialog-class="lightbox" overlay-style="background-color: rgba(10, 11, 15, 0.8);"`;

const GRID_CSS = `.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 520px;
}

.gallery-grid sx-gallery-item {
  overflow: hidden;
  border-radius: 12px;
}

.gallery-grid img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-grid sx-gallery-item:hover img {
  transform: scale(1.06);
}

${LIGHTBOX_CSS.trim()}`;

const CAROUSEL_CSS = `.gallery-carousel {
  max-width: 560px;
}

.gallery-carousel sx-gallery-item {
  overflow: hidden;
  border-radius: 12px;
}

.gallery-carousel img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-carousel sx-gallery-item:hover img {
  transform: scale(1.06);
}

${LIGHTBOX_CSS.trim()}`;

export const gallery: ComponentDoc = {
  slug: "gallery",
  eyebrow: "sx-gallery",
  title: "Gallery",
  lead: "Lightbox dựng sẵn — ghép sx-dialog + sx-slider + pagination lại thành bộ click-để-mở ảnh phóng to, chỉ cần khai báo sx-gallery-item, không phải tự nối 3 component riêng.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-gallery>
  <sx-gallery-item>
    <img src="/thumb-1.jpg" alt="" />
  </sx-gallery-item>
  <sx-gallery-item>
    <img src="/thumb-2.jpg" alt="" />
  </sx-gallery-item>
</sx-gallery>`)}
      <p class="note">
        Click (hoặc Enter/Space khi focus) vào <span class="c-accent">sx-gallery-item</span> nào sẽ mở lightbox đúng tại ảnh đó. Layout thumbnail (grid, carousel...) tự quyết định bởi CSS bạn viết — <span class="c-accent">sx-gallery</span> không ép layout nào.
      </p>
      <p class="note">
        Muốn ảnh full-res khác với thumbnail: thêm <code>{"&lt;template data-gallery-full&gt;"}</code> bên trong từng <span class="c-accent">sx-gallery-item</span>, nội dung template sẽ được dùng làm slide trong lightbox thay vì clone thumbnail.
      </p>

      <h2>sx-gallery</h2>
      {attrsTable([
        ["name", "tên lightbox — tự sinh nếu bỏ trống", "sx-gallery-N"],
        ["effect", "hiệu ứng mở/đóng — forward xuống sx-dialog bên trong (xem trang Dialog)", "zoom"],
        ["duration", "forward xuống sx-dialog bên trong", "0.3"],
        ["overlay", 'false — tắt lớp overlay nền, forward xuống sx-dialog', "true"],
        ["overlay-style", "forward xuống sx-dialog", "—"],
        ["slider-*", 'forward xuống sx-slider của lightbox với tiền tố "slider-" bỏ đi — vd slider-loop="true" -> loop="true", slider-effect="fade"', "—"],
        ["dialog-class / close-class / prev-class / next-class / pagination-class / slide-class", "thêm class riêng vào từng phần chrome tương ứng của lightbox", "—"],
      ])}
      <p class="note">
        Nếu trong <span class="c-accent">sx-gallery</span> đã có sẵn 1 <span class="c-accent">sx-slider</span> hiển thị thumbnail (layout carousel), một số attribute hành vi của nó (
        <code>gap</code>, <code>drag</code>, <code>speed</code>, <code>rewind</code>, <code>edge-resistance</code>, <code>loop</code>, <code>snap</code>, <code>autoplay</code>, <code>interval</code>,{" "}
        <code>per-move</code>, <code>effect</code>) tự mirror sang slider của lightbox — không cần khai lại qua <code>slider-*</code>, trừ khi muốn lightbox khác với carousel ngoài trang.
      </p>

      <h2>Event</h2>
      {eventsTable([
        ["sx-gallery-open", "khi lightbox mở — detail: { name, index }"],
        ["sx-gallery-close", "khi lightbox đóng — detail: { name }"],
      ])}

      <h2>Method</h2>
      {attrsTable([
        [".open(index?)", "mở lightbox tại index (mặc định 0)", "—"],
        [".close()", "đóng lightbox", "—"],
      ])}
      <p></p>
      {codeBlock(`const galleryEl = document.querySelector('sx-gallery');

galleryEl.addEventListener('sx-gallery-open', (e) => {
  console.log('mở ảnh', e.detail.index);
});

galleryEl.open(2); // mở thẳng lightbox tại ảnh thứ 3`, "js")}
    </>
  ),

  demoSidebar: true,

  demos: [
    {
      label: "Grid",
      html: `<sx-gallery class="gallery-grid" ${LIGHTBOX_ATTRS}>
${[0, 1, 2, 3, 4, 5].map((i) => `  <sx-gallery-item><img src="${thumb(i)}" alt="Ảnh ${i + 1}" /></sx-gallery-item>`).join("\n")}
</sx-gallery>`,
      css: GRID_CSS,
    },
    {
      label: "Trong sx-slider (carousel)",
      html: `<sx-gallery class="gallery-carousel" slider-effect="fade" ${LIGHTBOX_ATTRS}>
  <sx-slider per-view="2.2" gap="12">
    <sx-slider-track>
${[0, 1, 2, 3, 4, 5]
  .map(
    (i) => `      <sx-slider-slide>
        <sx-gallery-item><img src="${thumb(i)}" alt="Ảnh ${i + 1}" /></sx-gallery-item>
      </sx-slider-slide>`,
  )
  .join("\n")}
    </sx-slider-track>
  </sx-slider>
</sx-gallery>
<p class="note">Carousel ngoài trang dùng effect kéo-trượt thường, lightbox mở ra lại dùng hiệu ứng riêng (slider-effect="fade") — 2 slider độc lập, chỉ chia sẻ list ảnh.</p>`,
      css: CAROUSEL_CSS,
    },
  ],
};
