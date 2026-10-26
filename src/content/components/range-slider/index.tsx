import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const BOX_CSS = `.range-box {
  width: min(100%, 420px);
  padding: 32px 12px 12px;
}`;

export const rangeSlider: ComponentDoc = {
  slug: "range-slider",
  eyebrow: "sx-range-slider",
  title: "Range Slider",
  lead: "Thanh trượt 2 đầu (min/max) — tự dựng toàn bộ DOM bên trong, chỉ cần khai báo attribute, gần giống cách dùng <input type=\"range\">.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-range-slider min="0" max="1000" step="10" value="[200, 800]"></sx-range-slider>`)}
      <p class="note">Không cần viết tay track/handle bên trong — tự dựng ở lần connect đầu tiên.</p>

      <h2>Attributes</h2>
      {attrsTable([
        ["min", "giá trị nhỏ nhất", "0"],
        ["max", "giá trị lớn nhất", "min + 100"],
        ["step", "bước nhảy", "1"],
        ["value", 'JSON 2 phần tử, vd "[200, 800]" — tự kẹp vào [min, max] và tự hoán đổi nếu khai sai thứ tự', "[min, max]"],
        ["disabled", "khoá tương tác", "false"],
      ])}
      <p class="note">
        Mọi giá trị trên cũng đọc/ghi được qua property cùng tên (vd <code>el.value = [100, 500]</code>, <code>el.min = -50</code>).
      </p>

      <h2>Event</h2>
      <p>Kèm <code>detail.min</code> / <code>detail.max</code>.</p>
      {eventsTable([
        ["sx-range-slider-input", "liên tục trong lúc kéo/bấm phím mũi tên — giá trị đang thay đổi"],
        ["sx-range-slider-change", "khi thao tác kết thúc (nhả chuột, hoặc ngay sau mỗi lần bấm phím) — giá trị đã chốt"],
      ])}
      <p></p>
      {codeBlock(
        `const rangeEl = document.querySelector('sx-range-slider');

rangeEl.addEventListener('sx-range-slider-input', (e) => {
  console.log('đang kéo:', e.detail.min, e.detail.max);
});

rangeEl.addEventListener('sx-range-slider-change', (e) => {
  console.log('đã chốt:', e.detail.min, e.detail.max);
});`,
        "js",
      )}

      <h2>Method</h2>
      {attrsTable([[".setValue(min, max)", "set cả 2 đầu ngay lập tức, không bắn event — giống gán input.value", "—"]])}

      <h2>Styling</h2>
      <p>Toàn bộ giao diện style sẵn qua CSS custom property, không cần viết CSS mới để đổi màu/kích thước:</p>
      {attrsTable([
        ["--sx-range-slider-track-height", "độ dày track", "0.3rem"],
        ["--sx-range-slider-handle-size", "kích thước handle (hình tròn)", "1.8rem"],
        ["--sx-range-slider-track-color", "màu track nền", "rgba(0,0,0,.15)"],
        ["--sx-range-slider-progress-color", "màu đoạn giữa 2 handle", "currentColor"],
        ["--sx-range-slider-handle-color", "màu nền handle", "currentColor"],
        ["--sx-range-slider-handle-border-color", "màu viền handle", "#fff"],
      ])}
    </>
  ),

  demoSidebar: true,

  demos: [
    {
      label: "Cơ bản",
      html: `<div class="range-box">
  <sx-range-slider min="0" max="1000" step="10" value="[200, 800]"></sx-range-slider>
</div>`,
      css: BOX_CSS,
    },
    {
      label: "Màu tuỳ chỉnh",
      html: `<div class="range-box">
  <sx-range-slider min="0" max="100" value="[20, 60]" style="color:#ff7a45"></sx-range-slider>
</div>
<p class="note">currentColor — đổi màu bằng CSS "color" thường, không cần biết tên custom property.</p>`,
      css: BOX_CSS,
    },
    {
      label: "disabled",
      html: `<div class="range-box">
  <sx-range-slider min="0" max="100" value="[30, 70]" disabled></sx-range-slider>
</div>`,
      css: BOX_CSS,
    },
    {
      label: "Điều khiển bằng JS",
      html: `<div class="range-box">
  <sx-range-slider id="jsRange" min="0" max="1000" step="10" value="[200, 800]"></sx-range-slider>
</div>
<div class="content-pane__panel">
  <button class="btn btn--ghost btn--sm" data-reset>setValue(0, 1000)</button>
</div>
<div class="log" data-range-log></div>`,
      css: `${BOX_CSS}

.log {
  margin-top: 12px;
  width: min(100%, 420px);
  height: 100px;
  overflow-y: auto;
  background: #0f1013;
  border: 1px solid #2a2d33;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: monospace;
  font-size: 12px;
  color: #7ee787;
}`,
      js: `const rangeEl = document.getElementById('jsRange');

rangeEl.addEventListener('sx-range-slider-change', (e) => {
  console.log('đã chốt:', e.detail.min, e.detail.max);
});

document.querySelector('[data-reset]').addEventListener('click', () => {
  rangeEl.setValue(0, 1000);
});`,
      initDemo: (root) => {
        const rangeEl = root.querySelector<any>("#jsRange")!;
        const log = root.querySelector<HTMLElement>("[data-range-log]")!;
        const write = (msg: string) => {
          const line = document.createElement("div");
          line.textContent = msg;
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
        };
        rangeEl.addEventListener("sx-range-slider-change", (e: CustomEvent<{ min: number; max: number }>) =>
          write(`sx-range-slider-change -> [${e.detail.min}, ${e.detail.max}]`),
        );
        root.querySelector("[data-reset]")!.addEventListener("click", () => rangeEl.setValue(0, 1000));
      },
    },
  ],
};
