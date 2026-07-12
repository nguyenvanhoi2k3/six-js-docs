import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";

export const slider: ComponentDoc = {
  slug: "slider",
  eyebrow: "sx-slider",
  title: "Slider",
  lead: "Slider/carousel kéo bằng chuột hoặc chạm, hỗ trợ loop, autoplay, hiệu ứng fade, pagination/progress, và đồng bộ nhiều slider.",
  render: () => `
    <h2>Code</h2>
    ${codeBlock(`<sx-slider per-view="3" gap="16">
  <sx-slider-track>
    <sx-slider-slide>1</sx-slider-slide>
    <sx-slider-slide>2</sx-slider-slide>
    ...
  </sx-slider-track>
  <sx-slider-prev>‹</sx-slider-prev>
  <sx-slider-pagination></sx-slider-pagination>
  <sx-slider-next>›</sx-slider-next>
</sx-slider>`)}

    <h2>Attributes</h2>
    ${attrsTable([
      ["per-view", "số slide hiển thị cùng lúc", "1"],
      ["gap", "khoảng cách giữa các slide (px hoặc đơn vị CSS)", "0"],
      ["drag", "true | false — cho kéo bằng chuột/chạm", "true"],
      ["speed", "thời gian chuyển slide, tính bằng giây (vd: 0.3)", "0.3"],
      ["direction", "horizontal | vertical", "horizontal"],
      ["start-index", "index slide bắt đầu", "0"],
      ["per-move", "số slide di chuyển mỗi lần next/prev, hoặc auto", "auto"],
      ["loop", "true | false — nhân bản slide đầu/cuối để cuộn vô hạn", "false"],
      ["rewind", "true | false — nhảy về đầu/cuối khi không loop", "false"],
      ["autoplay", "bật tự động chạy", "false"],
      ["interval", "chu kỳ tự động chạy, tính bằng giây (vd: 4)", "4"],
      ["effect", "slide | fade", "slide"],
      ["sync", "name của (các) slider khác cần đồng bộ theo", "—"],
      ["breakpoints", "JSON theo container width, override các attribute trên", "—"],
      ["effect (trên sx-slider-pagination)", "bullet | number | dynamic | snake | fraction", "bullet"],
    ])}
  `,

  // ---- Demos: paste/edit the raw HTML inside each renderDemo() below ----
  demos: [
    {
      label: "Cơ bản",
      renderDemo: () => `
        <sx-slider class="slider" per-view="3" gap="16" drag="true">
          <sx-slider-track>
            <sx-slider-slide><div class="slide-box" style="background:#7c5cff">1</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ff6b4a">2</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#47bfff">3</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#22c55e">4</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#eab308">5</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ec4899">6</div></sx-slider-slide>
          </sx-slider-track>
          <div class="controls">
            <sx-slider-prev class="btn btn--ghost btn--sm">‹ Prev</sx-slider-prev>
            <sx-slider-pagination class="pagination"></sx-slider-pagination>
            <sx-slider-next class="btn btn--ghost btn--sm">Next ›</sx-slider-next>
          </div>
        </sx-slider>
      `,
    },
    {
      label: "Vòng lặp (loop)",
      renderDemo: () => `
        <sx-slider class="slider" per-view="3" gap="16" loop drag="true">
          <sx-slider-track>
            <sx-slider-slide><div class="slide-box" style="background:#7c5cff">1</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ff6b4a">2</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#47bfff">3</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#22c55e">4</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#eab308">5</div></sx-slider-slide>
          </sx-slider-track>
          <div class="controls">
            <sx-slider-prev class="btn btn--ghost btn--sm">‹ Prev</sx-slider-prev>
            <sx-slider-pagination class="pagination"></sx-slider-pagination>
            <sx-slider-next class="btn btn--ghost btn--sm">Next ›</sx-slider-next>
          </div>
        </sx-slider>
      `,
    },
    {
      label: "Tự động chạy",
      renderDemo: () => `
        <sx-slider class="slider" per-view="2" gap="16" loop autoplay interval="2" drag="true">
          <sx-slider-track>
            <sx-slider-slide><div class="slide-box" style="background:#7c5cff">1</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ff6b4a">2</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#47bfff">3</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#22c55e">4</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#eab308">5</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ec4899">6</div></sx-slider-slide>
          </sx-slider-track>
          <div class="controls">
            <sx-slider-pagination class="pagination"></sx-slider-pagination>
          </div>
        </sx-slider>
      `,
    },
    {
      label: "Hiệu ứng (fade / slide)",
      renderDemo: () => `
        <sx-slider class="slider" per-view="1" gap="0" loop effect="fade" drag="true">
          <sx-slider-track>
            <sx-slider-slide><div class="slide-box" style="background:#7c5cff">1</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ff6b4a">2</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#47bfff">3</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#22c55e">4</div></sx-slider-slide>
          </sx-slider-track>
          <div class="controls">
            <sx-slider-prev class="btn btn--ghost btn--sm">‹ Prev</sx-slider-prev>
            <sx-slider-pagination class="pagination"></sx-slider-pagination>
            <sx-slider-next class="btn btn--ghost btn--sm">Next ›</sx-slider-next>
          </div>
        </sx-slider>
      `,
    },
    {
      label: "Pagination & progress",
      renderDemo: () => `
        <sx-slider class="slider" per-view="1" gap="0" drag="true">
          <sx-slider-track>
            <sx-slider-slide><div class="slide-box" style="background:#7c5cff">1</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#ff6b4a">2</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#47bfff">3</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#22c55e">4</div></sx-slider-slide>
            <sx-slider-slide><div class="slide-box" style="background:#eab308">5</div></sx-slider-slide>
          </sx-slider-track>
          <sx-slider-progress class="progress"></sx-slider-progress>
          <div class="controls">
            <sx-slider-pagination class="pagination" effect="number"></sx-slider-pagination>
          </div>
        </sx-slider>
      `,
    },
  ],
};
