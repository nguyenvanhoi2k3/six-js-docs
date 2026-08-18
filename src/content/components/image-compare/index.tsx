import "./index.scss";
import { attrsTable, codeBlock, eventsTable } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

// ---- Ảnh minh hoạ dùng chung cho mọi demo bên dưới - SVG data URI, không phụ thuộc file ngoài ----

const BEFORE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23444a52'/%3E%3Cpolygon points='0,500 200,220 340,380 480,160 650,340 800,240 800,500' fill='%23636b76'/%3E%3Ccircle cx='650' cy='110' r='55' fill='%23aeb6bf'/%3E%3Ctext x='400' y='460' font-family='sans-serif' font-size='42' fill='%23e7e9ec' text-anchor='middle'%3EBEFORE%3C/text%3E%3C/svg%3E";

const AFTER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23ff7a45'/%3E%3Cpolygon points='0,500 200,220 340,380 480,160 650,340 800,240 800,500' fill='%23ffb15e'/%3E%3Ccircle cx='650' cy='110' r='55' fill='%23fff2c7'/%3E%3Ctext x='400' y='460' font-family='sans-serif' font-size='42' fill='%233a1f00' text-anchor='middle'%3EAFTER%3C/text%3E%3C/svg%3E";

const HANDLE_BADGE = `<span class="icon-badge">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 8l-4 4 4 4M17 8l4 4-4 4" />
      </svg>
    </span>`;

const beforeAfter = (): string => `  <sx-image-compare-before>
    <img src="${BEFORE_SRC}" alt="Trước" />
  </sx-image-compare-before>
  <sx-image-compare-after>
    <img src="${AFTER_SRC}" alt="Sau" />
  </sx-image-compare-after>`;

// ---- Shared CSS building blocks reused (và hiển thị đầy đủ, tự-đứng-độc-lập) trong các demo bên dưới ----

const COMPARE_CSS = `.compare-box {
  width: min(100%, 640px);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

sx-image-compare > sx-image-compare-handle {
  background: #fff;
  opacity: 0.9;
}

.icon-badge {
  width: 2.75em;
  height: 2.75em;
  border-radius: 50%;
  border: 2px solid #1a1c20;
  background: #fff;
  color: #1a1c20;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cùng 1 icon 2 chiều mọi nơi - chỉ xoay 90deg khi axis="y" thay vì đổi icon khác. */
sx-image-compare[axis="y"] .icon-badge svg {
  transform: rotate(90deg);
}`;

const CUSTOM_HANDLE_CSS = `sx-image-compare > sx-image-compare-handle.custom-handle {
  width: 3px;
  height: 100%;
  background: repeating-linear-gradient(180deg, #ffd166 0 10px, transparent 10px 20px);
}

.custom-handle .grip {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #ffd166;
  color: #1a1c20;
  display: flex;
  align-items: center;
  justify-content: center;
}`;

const RESIZABLE_CSS = `.resizable {
  width: min(100%, 640px);
  min-width: 260px;
  max-width: 100%;
  resize: horizontal;
  overflow: auto;
  border: 1px dashed #b7b3c4;
  padding: 8px;
}`;

const LOG_CSS = `.log {
  margin-top: 12px;
  width: min(100%, 420px);
  height: 120px;
  overflow-y: auto;
  background: #0f1013;
  border: 1px solid #2a2d33;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: monospace;
  font-size: 12px;
  color: #7ee787;
}`;

export const imageCompare: ComponentDoc = {
  slug: "image-compare",
  eyebrow: "sx-image-compare",
  title: "Image Compare",
  lead: "So sánh ảnh/video trước-sau bằng một thanh chia kéo được — trục ngang hoặc dọc, kéo chuột/chạm, hover, hoặc bàn phím, tự nhận aspect-ratio theo ảnh.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-image-compare>
  <sx-image-compare-before>
    <img src="/before.jpg" alt="Trước" />
  </sx-image-compare-before>
  <sx-image-compare-after>
    <img src="/after.jpg" alt="Sau" />
  </sx-image-compare-after>
  <sx-image-compare-handle></sx-image-compare-handle>
</sx-image-compare>`)}
      <p class="note">
        Cả 3 tag con — <span class="c-accent">sx-image-compare-before</span>, <span class="c-accent">sx-image-compare-after</span>, <span class="c-accent">sx-image-compare-handle</span> — đều phải tự viết tay,
        không tag nào được sinh sẵn. Thiếu tag nào thì phần tương ứng (lớp ảnh, hoặc đường chia + focus bàn phím) đơn giản là không có.
      </p>

      <h2>sx-image-compare</h2>
      {attrsTable([
        ["value", "vị trí đường chia, 0-100", "50"],
        ["axis", "x | y — chia theo chiều ngang hay dọc", "x"],
        ["disabled", "khoá tương tác, cố định ở value hiện tại", "false"],
        ["hover", "đường chia bám theo con trỏ ngay khi di chuột qua, không cần bấm giữ", "false"],
        ["step", "bước nhảy value mỗi lần bấm phím mũi tên khi đang focus vào handle (PageUp/PageDown nhảy gấp 10 lần, Home/End nhảy thẳng về 0/100)", "1"],
        ["aspect-ratio", 'ép tỷ lệ khung hình, vd "16 / 9" — bỏ trống thì tự nhận theo kích thước thật của ảnh/video đầu tiên bên trong sx-image-compare-before', "—"],
        ["breakpoints", "JSON theo container width, override axis/disabled/hover/step ở trên (value không đổi theo breakpoints — là trạng thái người dùng đang kéo, không phải layout)", "—"],
      ])}
      <p class="note">
        Ngoài attribute, mọi giá trị trên đọc/ghi trực tiếp qua property cùng tên trên element (vd <code>el.value = 30</code>, <code>el.axis = "y"</code>) đều hoạt động như nhau.
      </p>

      <h2>Event</h2>
      <p>
        Trên  <span class="c-accent">sx-image-compare</span>, kèm <code>detail.value</code>.
      </p>
      {eventsTable([
        ["sx-input", "được gọi liên tục trong lúc kéo/hover-di chuyển/bấm phím mũi tên — value đang thay đổi"],
        ["sx-change", "được gọi khi thao tác kết thúc (nhả chuột, rời hover, hoặc ngay sau mỗi lần bấm phím) — value đã chốt"],
      ])}
      <p></p>
      {codeBlock(
        `const compareEl = document.querySelector('sx-image-compare');

compareEl.addEventListener('sx-input', (e) => {
  console.log('đang kéo:', e.detail.value);
});

compareEl.addEventListener('sx-change', (e) => {
  console.log('đã chốt value:', e.detail.value);
});`,
        "js",
      )}

      <h2>Method</h2>
      {codeBlock(
        `const compareEl = document.querySelector('sx-image-compare');

// Set ngay lập tức
compareEl.setValue(50);

// Animate mượt tới value đích, trả về Promise khi animation xong
await compareEl.animateTo(80, 500, 'cubicOut');`,
        "js",
      )}
      <table class="content-pane__attrs">
        <thead>
          <tr>
            <th>Method</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>setValue(value)</td>
            <td>set value ngay lập tức, không animation</td>
          </tr>
          <tr>
            <td>animateTo(value, duration?, ease?)</td>
            <td>
              animate value tới đích — duration tính bằng ms (mặc định 400), ease là tên easing của component (xem trang <a href="ease.html#component">Ease</a>). Trả về Promise, resolve khi animation xong.
            </td>
          </tr>
        </tbody>
      </table>
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Cơ bản",
      html: `<div class="compare-box">
  <sx-image-compare>
${beforeAfter()}
    <sx-image-compare-handle>
      ${HANDLE_BADGE}
    </sx-image-compare-handle>
  </sx-image-compare>
</div>
<p class="note">Kéo đường chia, click để nhảy tới, hoặc Tab vào rồi dùng phím mũi tên.</p>`,
      css: COMPARE_CSS,
    },
    {
      label: 'axis="y"',
      html: `<div class="compare-box" style="width:min(100%,420px)">
  <sx-image-compare axis="y" value="35">
${beforeAfter()}
    <sx-image-compare-handle>
      ${HANDLE_BADGE}
    </sx-image-compare-handle>
  </sx-image-compare>
</div>`,
      css: COMPARE_CSS,
    },
    {
      label: "hover",
      html: `<div class="compare-box">
  <sx-image-compare hover value="30">
${beforeAfter()}
    <sx-image-compare-handle>
      ${HANDLE_BADGE}
    </sx-image-compare-handle>
  </sx-image-compare>
</div>
`,
      css: COMPARE_CSS,
    },
    {
      label: "disabled",
      html: `<div class="compare-box">
  <sx-image-compare disabled value="65">
${beforeAfter()}
    <sx-image-compare-handle>
      ${HANDLE_BADGE}
    </sx-image-compare-handle>
  </sx-image-compare>
</div>
`,
      css: COMPARE_CSS,
    },
    {
      label: "Custom handle",
      html: `<div class="compare-box">
  <sx-image-compare value="60">
${beforeAfter()}
    <sx-image-compare-handle class="custom-handle">
      <span class="grip">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 8l-4 4 4 4M17 8l4 4-4 4" />
        </svg>
      </span>
    </sx-image-compare-handle>
  </sx-image-compare>
</div>
`,
      css: `${COMPARE_CSS}

${CUSTOM_HANDLE_CSS}`,
    },
    {
      label: "aspect-ratio",
      html: `<div style="display:flex;gap:16px;flex-wrap:wrap">
  <div>
    <p class="note" style="margin-bottom:8px">Không khai báo — tự nhận theo ảnh (800×500)</p>
    <div class="compare-box" style="width:min(100%,300px)">
      <sx-image-compare>
${beforeAfter()}
        <sx-image-compare-handle></sx-image-compare-handle>
      </sx-image-compare>
    </div>
  </div>
  <div>
    <p class="note" style="margin-bottom:8px">aspect-ratio="1 / 1"</p>
    <div class="compare-box" style="width:min(100%,300px)">
      <sx-image-compare aspect-ratio="1 / 1">
${beforeAfter()}
        <sx-image-compare-handle></sx-image-compare-handle>
      </sx-image-compare>
    </div>
  </div>
</div>`,
      css: COMPARE_CSS,
    },
    {
      label: "breakpoints",
      html: `<div class="resizable">
  <sx-image-compare axis="y" breakpoints="{500: {axis: 'x'}}" style="border-radius:10px;overflow:hidden">
${beforeAfter()}
    <sx-image-compare-handle>
      ${HANDLE_BADGE}
    </sx-image-compare-handle>
  </sx-image-compare>
</div>
`,
      css: `${COMPARE_CSS}

${RESIZABLE_CSS}`,
    },
    {
      label: "Điều khiển bằng JS",
      html: `<div class="compare-box">
  <sx-image-compare id="jsCompare" value="50">
${beforeAfter()}
    <sx-image-compare-handle>
      ${HANDLE_BADGE}
    </sx-image-compare-handle>
  </sx-image-compare>
</div>
<div class="content-pane__panel">
  <button class="btn btn--ghost btn--sm" data-to-0>animateTo(0)</button>
  <button class="btn btn--ghost btn--sm" data-to-100>animateTo(100)</button>
  <button class="btn btn--ghost btn--sm" data-set-50>setValue(50) — không animation</button>
</div>
<div class="log" data-compare-log></div>`,
      css: `${COMPARE_CSS}

${LOG_CSS}`,
      js: `const compareEl = document.getElementById('jsCompare');

compareEl.addEventListener('sx-input', (e) => console.log('sx-input', e.detail.value));
compareEl.addEventListener('sx-change', (e) => console.log('sx-change', e.detail.value));

document.querySelector('[data-to-0]').addEventListener('click', () => compareEl.animateTo(0));
document.querySelector('[data-to-100]').addEventListener('click', () => compareEl.animateTo(100));
document.querySelector('[data-set-50]').addEventListener('click', () => compareEl.setValue(50));`,
      initDemo: (root) => {
        const compareEl = root.querySelector<any>("#jsCompare")!;
        const log = root.querySelector<HTMLElement>("[data-compare-log]")!;
        const write = (msg: string) => {
          const line = document.createElement("div");
          line.textContent = msg;
          log.appendChild(line);
          log.scrollTop = log.scrollHeight;
        };
        for (const name of ["sx-input", "sx-change"]) {
          compareEl.addEventListener(name, (e: CustomEvent<{ value: number }>) => write(`${name} -> value=${e.detail.value.toFixed(1)}`));
        }
        root.querySelector("[data-to-0]")!.addEventListener("click", () => compareEl.animateTo(0));
        root.querySelector("[data-to-100]")!.addEventListener("click", () => compareEl.animateTo(100));
        root.querySelector("[data-set-50]")!.addEventListener("click", () => compareEl.setValue(50));
      },
    },
  ],
};
