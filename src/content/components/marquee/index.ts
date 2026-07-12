import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";

export const marquee: ComponentDoc = {
  slug: "marquee",
  eyebrow: "sx-marquee",
  title: "Marquee",
  lead: "Băng chạy vô hạn, tự nhân bản nội dung để lấp đầy chiều rộng — dừng khi hover theo mặc định.",
  demoSidebar: false,
  render: () => `
    <h2>Code</h2>
    ${codeBlock(`<sx-marquee speed="50">
  <sx-marquee-inner>
    <sx-marquee-item>Animation</sx-marquee-item>
    <sx-marquee-item>Web Components</sx-marquee-item>
    ...
  </sx-marquee-inner>
</sx-marquee>`)}

    <h2>Attributes</h2>
    ${attrsTable([
      ["direction", "left | right | up | down", "left"],
      ["speed", "tốc độ chạy, px/giây", "50"],
      ["pause-on-hover", "true | false", "true"],
      ["gap", "khoảng cách giữa các item", "16"],
      ["clone", "true | false — tự nhân bản item để lấp đầy", "true"],
    ])}
  `,

  // ---- Demos: paste/edit the raw HTML inside each renderDemo() below ----
  demos: [
    {
      renderDemo: () => `
        <sx-marquee class="marquee" speed="50">
          <sx-marquee-inner>
            <sx-marquee-item class="item">Animation</sx-marquee-item>
            <sx-marquee-item class="item">Web Components</sx-marquee-item>
            <sx-marquee-item class="item">six.to()</sx-marquee-item>
            <sx-marquee-item class="item">Timeline</sx-marquee-item>
            <sx-marquee-item class="item">ScrollTrigger</sx-marquee-item>
            <sx-marquee-item class="item">Lightweight</sx-marquee-item>
          </sx-marquee-inner>
        </sx-marquee>
      `,
    },
    {
      renderDemo: () => `
        <sx-marquee class="marquee" speed="90" direction="right">
          <sx-marquee-inner>
            <sx-marquee-item class="item">Fast</sx-marquee-item>
            <sx-marquee-item class="item">→</sx-marquee-item>
            <sx-marquee-item class="item">direction="right"</sx-marquee-item>
            <sx-marquee-item class="item">→</sx-marquee-item>
            <sx-marquee-item class="item">speed="90"</sx-marquee-item>
          </sx-marquee-inner>
        </sx-marquee>

        <div class="marquee marquee--vertical" style="display:flex;">
          <sx-marquee direction="up" speed="35" style="height:100%">
            <sx-marquee-inner>
              <sx-marquee-item class="item">up ↑</sx-marquee-item>
              <sx-marquee-item class="item">vertical</sx-marquee-item>
              <sx-marquee-item class="item">marquee</sx-marquee-item>
              <sx-marquee-item class="item">six-js</sx-marquee-item>
              <sx-marquee-item class="item">shadow DOM</sx-marquee-item>
            </sx-marquee-inner>
          </sx-marquee>
        </div>
      `,
    },
  ],
};
