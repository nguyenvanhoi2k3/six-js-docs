import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";
import { playgroundBox } from "./shared";

const tweenCommonAttrs = attrsTable([
  ["duration", "thời gian, tính bằng giây", "number", "0.8 (six.config())"],
  ["ease", 'tên easing (xem trang <a href="ease.html#core">Ease</a>) hoặc hàm easing tuỳ chỉnh', "string | (t: number) => number", '"none" (six.config())'],
  ["delay", "giây trước khi tween thực sự chạy", "number", "0"],
  ["repeat", "số lần lặp lại", "number (-1 = vô hạn)", "0"],
  ["repeatDelay", "khoảng nghỉ giữa các lần lặp (giây)", "number", "0"],
  ["boomerang", "lặp có đảo chiều (yoyo)", "true | false", "false"],
  ["paused", "tạo tween ở trạng thái tạm dừng, tự .play() sau", "true | false", "false"],
  ["overwrite", 'huỷ (true) hoặc gỡ đúng property đang trùng ("auto") trên tween khác cùng target', 'true | "auto" | false', "false"],
  ["stagger", "khi target khớp nhiều phần tử (xem trang stagger)", "number | { each, from }", "—"],
  ["onScroll", "biến tween thành scroll-driven (xem trang onScroll)", "{ trigger?, container?, start, end, sync, sticky, ... }", "—"],
  ["onStart / onUpdate / onComplete / onRepeat / onReverseComplete", "callback vòng đời", "() => void", "—"],
]);

const animationLifecycleAttrs = attrsTable([
  [".play()", "chạy từ vị trí hiện tại", "—"],
  [".pause()", "tạm dừng, giữ nguyên vị trí", "—"],
  [".resume()", "chạy tiếp sau pause(), giữ nguyên chiều đang chạy", "—"],
  [".reverse()", "đảo chiều chạy", "—"],
  [".restart()", "chạy lại từ đầu", "—"],
  [".seek(t)", "nhảy tới thời điểm t (giây)", "—"],
  [".progress() / .totalProgress()", "đọc/set tiến độ 0–1 của một lần lặp / toàn bộ (kể cả repeat)", "—"],
  [".kill()", "huỷ, gỡ khỏi ticker", "—"],
  [".on(event, cb) / .off(event, cb)", 'event: "start" | "update" | "complete" | "repeat" | "reverseComplete"', "—"],
]);

export const tweenContent: ContentMap = {
  "tween/to": {
    eyebrow: "Core",
    title: "six.to()",
    lead: "Tween các thuộc tính của target từ giá trị hiện tại đến giá trị bạn khai báo trong vars.",
    render: () => (
      <>
        {playgroundBox("to()")}
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy six.to()
          </button>
        </div>

        {codeBlock(
          ` // box translateX 160px và rotate 12deg
six.to(".box", {
  x: 160,
  rotate: 12,
  duration: 0.6,
  ease: "backOut",
});`,
          "js",
        )}

        <h2>Vars dùng chung cho to / from / fromTo</h2>
        {tweenCommonAttrs}

        <p>
          Trả về <code>Tween</code> (hoặc <code>Timeline</code> nếu có <code>stagger</code>) — cả hai đều là một <code>Animation</code>, dùng chung bộ method vòng đời sau:
        </p>
        <h2>API vòng đời (Tween / Timeline)</h2>
        {animationLifecycleAttrs}

        <p class="note">
          <code>true</code> huỷ toàn bộ tween cũ trên target; <code>"auto"</code> chỉ gỡ property trùng, các property khác của tween cũ vẫn chạy tiếp.
        </p>
        <p>
          Xem những thuộc tính nào animate được và toàn bộ bảng easing tại trang <a href="#tween/properties">Thuộc tính &amp; Easing</a>.
        </p>
      </>
    ),
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      let toggled = false;
      btn.addEventListener("click", () => {
        toggled = !toggled;
        six.to(box, { x: toggled ? 160 : 0, rotate: toggled ? 12 : 0, duration: 0.6, ease: "backOut" });
      });
    },
  },

  "tween/from": {
    eyebrow: "Core",
    title: "six.from()",
    lead: "Ngược với to(): bạn khai báo giá trị bắt đầu, six-js tự lấy giá trị hiện tại của target làm điểm đến.",
    render: () => (
      <>
        {playgroundBox("from()")}
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy six.from()
          </button>
        </div>

        {codeBlock(
          `
          // box translateT từ 40px về trạng thái ban đầu
six.from(".box", {
  opacity: 0,
  y: 40,
  duration: 0.5,
  ease: "quadOut",
});`,
          "js",
        )}
      </>
    ),
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.set(box, { opacity: 1, y: 0 });
        six.from(box, { opacity: 0, y: 40, duration: 0.5, ease: "quadOut" });
      });
    },
  },

  "tween/fromTo": {
    eyebrow: "Core",
    title: "six.fromTo()",
    lead: "Khai báo tường minh cả hai đầu: fromVars và toVars, không phụ thuộc giá trị hiện tại của target.",
    render: () => (
      <>
        {playgroundBox("fromTo()")}
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy six.fromTo()
          </button>
        </div>

        {codeBlock(
          `six.fromTo(
  ".box",
  { scale: 0.5, opacity: 0.4 },
  { scale: 1, opacity: 1, duration: 0.5, ease: "cubicOut" },
);`,
          "js",
        )}

        <p class="note">
          <code>scale</code> là shorthand cho cả <code>scaleX</code> và <code>scaleY</code>.
        </p>
        <p>Bỏ qua một property ở đầu nào đó (chỉ khai trong fromVars hoặc toVars) thì six-js tự lấy giá trị hiện tại của target cho đầu còn thiếu.</p>
      </>
    ),
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.fromTo(box, { scale: 0.5, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.5, ease: "cubicOut" });
      });
    },
  },

  "tween/keyframes": {
    eyebrow: "Core",
    title: "keyframes",
    lead: "Truyền keyframes vào vars của six.to() để chạy nhiều chặng giá trị nối tiếp nhau trên cùng một tween, thay vì phải nối nhiều six.to() bằng timeline.",
    render: () => (
      <>
        {playgroundBox("keyframes")}
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy keyframes
          </button>
        </div>

        {codeBlock(
          `// Dạng mảng — mỗi phần tử là một chặng, "duration"/"ease" riêng (tuỳ chọn)
six.to(".box", {
  duration: 2, // tổng thời lượng nếu chặng không tự khai duration riêng
  keyframes: [
    { x: 120, duration: 0.4 },
    { y: -40, ease: "backOut" },
    { x: 0, y: 0, rotate: 360 },
  ],
});

// Dạng phần trăm — vị trí "N%" tính theo tổng duration của tween
six.to(".box", {
  duration: 2,
  keyframes: {
    "0%": { x: 0, y: 0 },
    "40%": { x: 120, ease: "backOut" },
    "100%": { x: 0, y: 0, rotate: 360 },
  },
});`,
          "js",
        )}

        {attrsTable([
          ["duration (trên từng chặng)", "thời lượng riêng của chặng — bỏ qua sẽ chia đều phần thời gian còn lại cho các chặng chưa khai", "number", "chia đều / 0.5s"],
          ["ease (trên từng chặng)", "ease riêng cho đoạn nối tới chặng đó — bỏ qua dùng ease chung của tween", "string", "ease chung"],
          ["duration (trên tween)", "tổng thời lượng — bắt buộc phải khai nếu dùng dạng phần trăm", "number", "0.5"],
        ])}

        <p class="note">Giá trị cuối mỗi chặng tự thành điểm bắt đầu của chặng kế tiếp.</p>
        <p class="note">
          <code>keyframes</code> không dùng được với <code>overwrite</code>, và chỉ bắn onStart/onComplete một lần cho cả tween — không tách riêng theo từng chặng.
        </p>
      </>
    ),
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.set(box, { x: 0, y: 0, rotate: 0 });
        six.to(box, {
          duration: 2,
          keyframes: [{ x: 120, duration: 0.4 }, { y: -40, ease: "backOut" }, { x: 0, y: 0, rotate: 360 }],
        });
      });
    },
  },

  "tween/properties": {
    eyebrow: "Core",
    title: "Thuộc tính & Easing",
    lead: "six-js tự nhận diện loại thuộc tính và đơn vị đo dựa trên giá trị bạn truyền — không cần khai loại thủ công.",
    render: () => (
      <>
        <h2>Transform</h2>
        {attrsTable([
          ["x, y, z", 'translate — px mặc định; truyền chuỗi "N%" cho x/y để dịch theo % kích thước chính nó', "px"],
          ["rotate, rotateX, rotateY", "góc xoay", "deg"],
          ["scale", "shorthand — tự mở rộng thành scaleX + scaleY", "1"],
          ["scaleX, scaleY", "tỉ lệ theo từng trục", "1"],
          ["skewX, skewY", "góc nghiêng", "deg"],
        ])}
        <p>Mỗi thuộc tính transform animate độc lập, kể cả khi ở nhiều tween chạy chồng nhau:</p>
        {codeBlock(
          `six.to(".card", { x: 120, duration: 0.6 });
six.to(".card", { rotate: 8, scale: 1.05, duration: 0.4, delay: 0.15 }); // chạy song song, x không bị ảnh hưởng`,
          "js",
        )}

        <h2>Màu sắc</h2>
        <p>
          Tự nhận diện <code>backgroundColor, color, borderColor, outlineColor, fill, stroke, stopColor</code> — hỗ trợ hex, <code>rgb()/rgba()</code> và tên màu CSS.
        </p>

        <h2>Chuỗi phức hợp</h2>
        <p>Animate thẳng các thuộc tính dạng chuỗi nhiều giá trị, kể cả khi có màu nhúng bên trong:</p>
        {codeBlock(
          `six.to(".card", {
  boxShadow: "0 24px 48px rgba(0,0,0,.4)",
  clipPath: "inset(0% 0% 0% 0%)",
  borderRadius: "4px",
  duration: 0.6,
  ease: "cubicOut",
});`,
          "js",
        )}
        <p class="note">
          Hỗ trợ: <code>boxShadow, textShadow, borderRadius, clipPath, filter, backgroundPosition, backgroundSize, objectPosition</code>.
        </p>

        <h2>Biến CSS, style thường, thuộc tính khác</h2>
        {attrsTable([
          ["--my-var", "biến CSS tuỳ chỉnh — tự nhận numeric hay discrete tuỳ giá trị truyền vào", "—"],
          ["style property khác", "số → numeric (mặc định đơn vị px, trừ opacity/zIndex/flexGrow/flexShrink/order/fontWeight); còn lại → đổi tức thời ở cuối tween", "px"],
          ["scrollTop, currentTime, volume, ...", "thuộc tính JS number thường, không qua style — six-js gán thẳng vào field đó", "—"],
          ["còn lại (SVG cx/cy, data-*, ...)", "rơi về setAttribute(prop, value)", "—"],
        ])}
        <p>SVG attribute animate được y hệt style thường, cùng một lời gọi:</p>
        {codeBlock(
          `six.to("circle", { cx: 120, cy: 40, r: 30, duration: 0.6 });
six.to(".box", { "--progress": 1, duration: 0.8 }); // custom property, dùng trong CSS riêng`,
          "js",
        )}

        <h2>Đơn vị đo</h2>
        <p>
          <code>px, rem, em, vh, vw, %</code> đều dùng được và quy đổi theo kích thước thật trên trang, không phải tỉ lệ cố định. Riêng góc xoay (<code>deg/rad/turn</code>) không quy đổi qua px.
        </p>

        <h2>Giá trị tương đối</h2>
        {codeBlock(
          `six.to(".box", { x: "+=50" });     // cộng thêm 50 vào giá trị hiện tại
six.to(".box", { x: "-=50" });     // trừ đi 50
six.to(".box", { scaleX: "*=2" }); // nhân đôi
six.to(".box", { scaleX: "/=2" }); // chia đôi`,
          "js",
        )}

        <h2>Ease</h2>
        <p>
          Danh sách đầy đủ kèm mô tả dáng từng easing tại trang <a href="ease.html#core">Ease</a>.
        </p>

        <p class="note">
          Tên easing sai chính tả sẽ tự rơi về <code>"quadOut"</code> thay vì throw lỗi. Cũng có thể truyền thẳng hàm <code>(t: number) =&gt; number</code> thay vì dùng tên có sẵn.
        </p>
      </>
    ),
  },
};
