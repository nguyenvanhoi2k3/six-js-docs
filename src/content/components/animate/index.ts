import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";

export const animate: ComponentDoc = {
  slug: "animate",
  eyebrow: "sx-animate",
  title: "Animate",
  lead: "sx-animate phát hiện khi phần tử xuất hiện trong viewport (IntersectionObserver) rồi chạy Web Animations API để fade + dịch chuyển vào vị trí.",
  demoSidebar: false,
  render: () => `
    <h2>Code</h2>
    ${codeBlock(`<sx-animate type="fade-up" duration="0.4" strength="30">
  <div>Content</div>
</sx-animate>`)}

    <h2>Attributes</h2>
    ${attrsTable([
      [
        "type",
        "fade | fade-up | fade-down | fade-left | fade-right",
        "fade-up",
      ],
      ["strength", "khoảng cách dịch chuyển (px)", "30"],
      ["duration", "số giây (vd: 0.4)", "0.5"],
      ["delay", "số giây", "0.05"],
      ["easing", "tên easing", "none"],
      ["replay", "chạy lại mỗi khi phần tử vào lại viewport", "false"],
      [
        "cascade",
        "Gộp các phần tử sx-animate cùng cha (parentElement) vào một hàng đợi, phát lần lượt cách nhau 120ms theo thứ tự DOM khi cùng vào viewport, thay vì chạy play() ngay lập tức.",
        "false",
      ],
    ])}
    <p class="note">Component tự tôn trọng <span class="c-accent">prefers-reduced-motion: reduce</span> (bỏ animation, set thẳng trạng thái cuối) — không có attribute riêng để bật/tắt việc này.</p>
  `,

  // ---- Demos: paste/edit the raw HTML inside each renderDemo() below ----
  demos: [
    {
      renderDemo: () => `
      <div class="space flex-center">
        <sx-animate type="fade" duration="1">
        <h1>Scroll down</h1> 
        </sx-animate>
      </div>
        <div class="grid flex-center gap-20">
          <sx-animate type="fade" class="box noise">fade</sx-animate>
          <sx-animate type="fade" class="box noise">fade</sx-animate>
          <sx-animate type="fade" class="box noise">fade</sx-animate>
          <sx-animate type="fade" class="box noise">fade</sx-animate>
        </div>

        <div class="grid flex-center gap-20">
          <sx-animate type="fade-up" class="box noise">fade up</sx-animate>
          <sx-animate type="fade-up" class="box noise">fade up</sx-animate>
          <sx-animate type="fade-up" class="box noise">fade up</sx-animate>
          <sx-animate type="fade-up" class="box noise">fade up</sx-animate>
        </div>

        <div class="grid flex-center gap-20">
          <sx-animate type="fade-left" class="box noise">fade left</sx-animate>
          <sx-animate type="fade-left" class="box noise">fade left</sx-animate>
          <sx-animate type="fade-left" class="box noise">fade left</sx-animate>
          <sx-animate type="fade-left" class="box noise">fade left</sx-animate>
        </div>

        <div class="grid flex-center gap-20">
          <sx-animate type="fade-right" class="box noise">fade right</sx-animate>
          <sx-animate type="fade-right" class="box noise">fade right</sx-animate>
          <sx-animate type="fade-right" class="box noise">fade right</sx-animate>
          <sx-animate type="fade-right" class="box noise">fade right</sx-animate>
        </div>

        <div class="grid flex-center gap-20">
          <sx-animate type="fade-down" class="box noise">fade down</sx-animate>
          <sx-animate type="fade-down" class="box noise">fade down</sx-animate>
          <sx-animate type="fade-down" class="box noise">fade down</sx-animate>
          <sx-animate type="fade-down" class="box noise">fade down</sx-animate>
        </div>

        
      `,
    },
    {
      renderDemo: () => `
        <div class="grid flex-center gap-20">
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
        </div>
        <div class="grid flex-center gap-20">
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
        </div>
        <div class="grid flex-center gap-20">
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
          <sx-animate cascade class="box box--yellow noise">cascade</sx-animate>
        </div>
      `,
    },
    {
      renderDemo: () => `
        <div class="grid flex-center gap-20">
          <sx-animate replay cascade class="box box--blue noise">replay</sx-animate>
          <sx-animate replay cascade class="box box--blue noise">replay</sx-animate>
          <sx-animate replay cascade class="box box--blue noise">replay</sx-animate>
          <sx-animate replay cascade class="box box--blue noise">replay</sx-animate>
        </div>
        <div class="space flex-center">
        <h1>End</h1>
        </div>
      `,
    },
  ],
};
