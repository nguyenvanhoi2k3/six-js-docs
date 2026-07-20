import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

export const marquee: ComponentDoc = {
  slug: "marquee",
  eyebrow: "sx-marquee",
  title: "Marquee",
  lead: "Băng chạy vô hạn, tự nhân bản nội dung để lấp đầy chiều rộng — dừng khi hover theo mặc định.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-marquee>
  <sx-marquee-inner>
    <sx-marquee-item>
      <span>🔥 Lorem ipsum dolor sit amet consectetur adipisicing!</span>
    </sx-marquee-item>
  </sx-marquee-inner>
</sx-marquee>`)}

      <h2>Attributes</h2>
      {attrsTable([
        ["direction", "left | right | up | down", "left"],
        ["speed", "tốc độ chạy, px/giây", "50"],
        ["pause-on-hover", "true | false", "true"],
        ["gap", "khoảng cách giữa các item", "16"],
        ["clone", "true | false — tự nhân bản item để lấp đầy", "true"],
      ])}
    </>
  ),

  // ---- Demos: paste/edit the raw HTML inside each renderDemo() below ----
  demos: [
    {
      renderDemo: () => (
        <div style="margin-top: 50px;">
          <sx-marquee class="marquee">
            <sx-marquee-inner>
              <sx-marquee-item>
                <span>🔥 Tin tức mới nhất: Hot sale tháng 11!</span>
              </sx-marquee-item>
            </sx-marquee-inner>
          </sx-marquee>
        </div>
      ),
    },
    {
      renderDemo: () => (
        <>
          <h3>direction="right" speed="120"</h3>
          <sx-marquee class="marquee" direction="right" speed="120">
            <sx-marquee-inner>
              <sx-marquee-item>
                <span>🔥 Tin tức mới nhất: Hot sale tháng 11!</span>
              </sx-marquee-item>
            </sx-marquee-inner>
          </sx-marquee>
        </>
      ),
    },
    {
      renderDemo: () => (
        <>
          <h3>clone="false"</h3>
          <sx-marquee class="marquee" clone="false" speed="200">
            <sx-marquee-inner>
              <sx-marquee-item>
                <span>Khi clone false nội dung sẽ không bị lặp lại</span>
              </sx-marquee-item>
            </sx-marquee-inner>
          </sx-marquee>
        </>
      ),
    },
    {
      renderDemo: () => (
        <>
          <h3>direction="up" pause-on-hover="false"</h3>
          <sx-marquee direction="up" pause-on-hover="false" speed="70" style="height: 400px; border: 1px solid #ddd;">
            <sx-marquee-inner>
              <sx-marquee-item>
                <div class="card">
                  <div class="card-header">
                    <img class="card-avt" src="https://i.pravatar.cc/150?img=32" alt="" />
                    <div class="card-name">Emily Johnson</div>
                  </div>
                  <div>I'm thoroughly impressed with Marquee's performance and ease of use. It made implementing complex scrolling texts a breeze, and the support for TypeScript is top-notch.</div>
                </div>
              </sx-marquee-item>
              <sx-marquee-item>
                <div class="card">
                  <div class="card-header">
                    <img class="card-avt" src="https://i.pravatar.cc/150?img=31" alt="" />
                    <div class="card-name">Dan Gale</div>
                  </div>
                  <div>I'm thoroughly impressed with Marquee's performance and ease of use. It made implementing complex scrolling texts a breeze, and the support for TypeScript is top-notch.</div>
                </div>
              </sx-marquee-item>
            </sx-marquee-inner>
          </sx-marquee>
        </>
      ),
    },
  ],
};
