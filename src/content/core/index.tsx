import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

function playgroundBox(label: string): string {
  return (
    <div class="content-pane__panel" style="align-items:center;">
      <div class="demo-animate-box" data-tw-box style="width:100px;flex:none;">
        {label}
      </div>
    </div>
  );
}

// Kept in sync with the `.from()` durations/overlaps built in the "sequence/timeline" demo's
// init() below, so the track ticks line up with where each child tween actually starts.
const TL_DEMO_DUR = 0.5;
const TL_DEMO_OVERLAP = 0.3;
const TL_DEMO_STARTS = [0, TL_DEMO_DUR - TL_DEMO_OVERLAP, 2 * (TL_DEMO_DUR - TL_DEMO_OVERLAP)];
const TL_DEMO_TOTAL = TL_DEMO_STARTS[2] + TL_DEMO_DUR;

const tweenCommonAttrs = attrsTable([
  ["duration", "thời gian, tính bằng giây", "number", "0.8 (six.config())"],
  ["ease", 'tên easing (xem trang <a href="/ease.html#core">Ease</a>) hoặc hàm easing tuỳ chỉnh', "string | (t: number) => number", '"none" (six.config())'],
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

const coreContent: ContentMap = {
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
          <code>overwrite: true</code> huỷ toàn bộ tween cũ đang chiếm target (mọi property của nó, không chỉ property trùng); <code>overwrite: "auto"</code> chỉ gỡ đúng property trùng khỏi tween cũ — các
          property khác của nó vẫn chạy tiếp. Không áp dụng cho tween dùng <code>keyframes</code>.
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
    lead: "Ngược với to(): khai báo giá trị bắt đầu trong vars, six-js tự lấy giá trị HIỆN TẠI của target (đọc ngay lúc tạo tween) làm điểm đến.",
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
          <code>scale</code> là shorthand — tự mở rộng thành cả <code>scaleX</code> và <code>scaleY</code> (mỗi cái có track/overwrite riêng).
        </p>
        <p>
          Một property có thể chỉ khai trong <code>fromVars</code> hoặc chỉ trong <code>toVars</code> — đầu nào thiếu sẽ tự đọc giá trị hiện tại của target cho đúng đầu đó, giống hệt to()/from() dùng riêng
          cho property đó.
        </p>
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

        <p class="note">Giá trị cuối của một chặng tự trở thành điểm bắt đầu (from) của chặng kế tiếp — six-js truyền thẳng giá trị đó chứ không đọc lại DOM</p>
        <p class="note">
          Tween dùng <code>keyframes</code> không hỗ trợ <code>overwrite</code> và không bắn sự kiện onStart/onComplete riêng cho từng chặng — chỉ sự kiện của tween ngoài cùng được bắn.
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
    lead: "six-js tự nhận diện loại thuộc tính (transform, màu, chuỗi phức hợp, biến CSS, thuộc tính DOM thường...) và đơn vị đo dựa trên giá trị bạn truyền — không cần khai loại thủ công.",
    render: () => (
      <>
        <h2>Transform</h2>
        {attrsTable([
          ["x, y, z", 'translate — px mặc định; truyền chuỗi "N%" cho x/y để dịch theo % kích thước chính nó (tương tự xPercent/yPercent)', "px"],
          ["rotate, rotateX, rotateY", "góc xoay", "deg"],
          ["scale", "shorthand — tự mở rộng thành scaleX + scaleY", "1"],
          ["scaleX, scaleY", "tỉ lệ theo từng trục", "1"],
          ["skewX, skewY", "góc nghiêng", "deg"],
        ])}
        <p>Mỗi thuộc tính transform animate độc lập, kể cả khi nằm ở nhiều tween khác nhau chạy chồng lên nhau — không cần tự dựng chuỗi transform hay lo ghi đè mất giá trị đã set trước đó:</p>
        {codeBlock(
          `six.to(".card", { x: 120, duration: 0.6 });
six.to(".card", { rotate: 8, scale: 1.05, duration: 0.4, delay: 0.15 }); // chạy song song, x không bị ảnh hưởng`,
          "js",
        )}

        <h2>Màu sắc</h2>
        <p>
          Tự nhận diện: <code>backgroundColor, color, borderColor, outlineColor, fill, stroke, stopColor</code> — hỗ trợ hex, <code>rgb()/rgba()</code> (cả cú pháp dấu phẩy lẫn cú pháp space hiện đại) và tên
          màu CSS.
        </p>

        <h2>Chuỗi phức hợp</h2>
        <p>Animate thẳng các thuộc tính dạng chuỗi nhiều giá trị, kể cả khi có màu nhúng bên trong — không cần tách số ra tween tay:</p>
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
          ["--my-var", "biến CSS tuỳ chỉnh — tự nhận numeric hay discrete dựa trên giá trị hiện tại/giá trị truyền vào", "—"],
          ["style property khác", "numeric (đơn vị px mặc định, trừ opacity/zIndex/flexGrow/flexShrink/order/fontWeight — không đơn vị) nếu giá trị là số, ngược lại discrete (đổi tức thời ở cuối)", "px"],
          ["scrollTop, currentTime, volume, ...", "thuộc tính JS number thường (không phải style, không qua CSSOM) — six-js gán thẳng vào field đó", "—"],
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
          Danh sách đầy đủ kèm mô tả dáng từng easing tại trang <a href="/ease.html#core">Ease</a>.
        </p>
      
        <p class="note">
          Truyền tên easing không tồn tại (sai chính tả) sẽ tự rơi về <code>"quadOut"</code> chứ không throw lỗi. Cũng có thể truyền thẳng hàm{" "}
          <code>(t: number) =&gt; number</code> (t và kết quả trong khoảng 0–1) thay vì tên có sẵn.
        </p>
      </>
    ),
  },

  "sequence/timeline": {
    eyebrow: "Core",
    title: "six.timeline()",
    lead: 'Gộp nhiều tween vào một hàng thời gian, canh nhau bằng vị trí tương đối ("-=0.2", "<", nhãn label...). Bản thân timeline cũng là một Animation — play/pause/reverse/repeat/boomerang y hệt một tween.',
    render: () => (
      <>
        <div class="tl-demo">
          <div class="tl-demo__stage">
            <div class="demo-animate-box" data-tl-box style="width:88px;flex:none;">
              Bước 1
            </div>
            <span class="tl-demo__arrow" aria-hidden="true">
            </span>
            <div class="demo-animate-box" data-tl-box style="width:88px;flex:none;">
              Bước 2
            </div>
            <span class="tl-demo__arrow" aria-hidden="true">
            </span>
            <div class="demo-animate-box" data-tl-box style="width:88px;flex:none;">
              Bước 3
            </div>
          </div>

          <div class="tl-demo__track">
            <div class="tl-demo__track-fill" data-tl-fill></div>
            {TL_DEMO_STARTS.map((t) => (
              <div class="tl-demo__tick" style={`left:${(t / TL_DEMO_TOTAL) * 100}%`}></div>
            ))}
            <div class="tl-demo__tick tl-demo__tick--label" style="left:100%">
              <span class="tl-demo__tick-text">done</span>
            </div>
            <div class="tl-demo__playhead" data-tl-playhead></div>
          </div>
        </div>

        <div class="content-pane__panel" style="align-items:center;">
          <button class="btn btn--primary btn--sm" data-play>
            ▶ Play
          </button>
          <button class="btn btn--ghost btn--sm" data-reverse>
            ⟲ Reverse
          </button>
          <button class="btn btn--ghost btn--sm" data-pause>
            ⏸ Pause
          </button>
          <button class="btn btn--ghost btn--sm" data-restart>
            ↺ Restart
          </button>
          <span class="tl-demo__status" data-tl-status>
            Sẵn sàng
          </span>
        </div>

        {codeBlock(
          `// mỗi bước một hiệu ứng khác nhau — đây là chỗ timeline khác stagger:
// stagger lặp lại CÙNG một tween lệch delay, timeline ghép các tween KHÁC NHAU vào một trục thời gian
const tl = six
  .timeline()
  .from(".box-1", { opacity: 0, x: -60, duration: 0.5, ease: "cubicOut" })
  .from(".box-2", { opacity: 0, scale: 0.4, rotate: -25, duration: 0.5, ease: "backOut" }, "-=0.3")
  .from(".box-3", { opacity: 0, y: -40, duration: 0.5, ease: "quadOut" }, "-=0.3")
  .addLabel("done")
  .call(() => console.log("timeline xong"), "done");

// timeline cũng là một Animation — play/pause/reverse/restart y hệt tween
tl.pause();
tl.reverse();
tl.restart();`,
          "js",
        )}

        <h2>Tham số vị trí (position) — đối số cuối của to/from/fromTo/set/call/add/addLabel</h2>
        {attrsTable([
          ["(bỏ trống)", "nối tiếp ngay sau khi tween/label thêm trước đó kết thúc", "—"],
          ["số giây", "vị trí tuyệt đối trên timeline", "—"],
          ['"<" / "<+=0.2" / "<-=0.2"', "cùng lúc bắt đầu với tween thêm trước đó (kèm lệch thêm nếu có)", "—"],
          ['">" / ">+=0.2"', "ngay sau khi tween thêm trước đó KẾT THÚC (kèm lệch thêm nếu có)", "—"],
          ['"+=0.5" / "-=0.5"', "lệch so với vị trí cuối hiện tại của timeline (cursor)", "—"],
          ['"tênLabel" / "tênLabel+=0.3"', "vị trí của label đã addLabel() (kèm lệch thêm nếu có)", "—"],
        ])}

        <h2>Methods</h2>
        {attrsTable([
          [".to/.from/.fromTo(target, vars, position?)", "thêm tween con — vars nhận thêm stagger, không nhận onScroll riêng (đặt onScroll ở six.timeline({ onScroll }) cho cả timeline)", "—"],
          [".set(target, vars, position?)", "tween duration 0 — set giá trị ngay khi timeline chạy tới vị trí đó", "—"],
          [".call(fn, position?)", "chèn một callback (không animate gì) vào đúng vị trí đó", "—"],
          [".add(childAnimation, position?)", "gắn thẳng một Tween/Timeline đã tạo sẵn (vd lồng timeline khác) vào vị trí đó", "—"],
          [".addLabel(name, position?)", "đặt tên cho một vị trí để tham chiếu lại bằng chuỗi position sau này", "—"],
          [".getLabelTime(name)", "đọc lại thời điểm (giây) của một label", "—"],
        ])}

        <h2>Vars khi tạo timeline</h2>
        {attrsTable([
          ["defaults", "merge (ưu tiên thấp nhất) vào mọi .to/.from/.fromTo thêm vào timeline này — khỏi lặp lại duration/ease ở từng lời gọi", "TweenVars", "—"],
          ["onScroll", "biến CẢ timeline thành scroll-driven — bắt buộc tự khai trigger (timeline không có target mặc định để suy ra)", "OnScrollVars", "—"],
        ])}
        <p></p>
        {codeBlock(
          `const tl = six.timeline({ defaults: { duration: 0.4, ease: "quadOut" } });
tl.to(".a", { x: 100 })
.to(".b", { x: 100 }, "<"); // cả 2 dùng chung duration/ease ở trên`,
          "js",
        )}

        <p>
          Timeline kế thừa toàn bộ <a href="#tween/to">API vòng đời của Animation</a>, và nhận cả <code>repeat</code>/<code>repeatDelay</code>/<code>boomerang</code>/<code>delay</code> giống một tween — lặp
          lại/đảo chiều cả cụm animation bên trong như một khối duy nhất.
        </p>
        <p class="note">
          Có thể lồng timeline trong timeline bằng <code>.add(timelineKhac, position)</code> — thời gian được truyền xuống dạng phép biến đổi toạ độ, nên pause/reverse ở timeline cha vẫn tính đúng cho
          timeline con bên trong.
        </p>
      </>
    ),
    init: (root) => {
      const boxes = Array.from(root.querySelectorAll<HTMLElement>("[data-tl-box]"));
      const fill = root.querySelector<HTMLElement>("[data-tl-fill]")!;
      const playhead = root.querySelector<HTMLElement>("[data-tl-playhead]")!;
      const status = root.querySelector<HTMLElement>("[data-tl-status]")!;
      const playBtn = root.querySelector<HTMLButtonElement>("[data-play]")!;
      const reverseBtn = root.querySelector<HTMLButtonElement>("[data-reverse]")!;
      const pauseBtn = root.querySelector<HTMLButtonElement>("[data-pause]")!;
      const restartBtn = root.querySelector<HTMLButtonElement>("[data-restart]")!;

      const setStatus = (text: string) => {
        status.textContent = text;
      };

      const tl = six
        .timeline({ paused: true })
        .from(boxes[0], { opacity: 0, x: -60, duration: TL_DEMO_DUR, ease: "cubicOut" })
        .from(boxes[1], { opacity: 0, scale: 0.4, rotate: -25, duration: TL_DEMO_DUR, ease: "backOut" }, `-=${TL_DEMO_OVERLAP}`)
        .from(boxes[2], { opacity: 0, y: -40, duration: TL_DEMO_DUR, ease: "quadOut" }, `-=${TL_DEMO_OVERLAP}`)
        .addLabel("done")
        .call(() => setStatus("Hoàn tất"), "done");

      // Đặt playhead về đúng trạng thái "from" của cả 3 box ngay từ đầu, thay vì đợi bấm Play mới hiện.
      tl.seek(0);

      tl.on("update", () => {
        const p = (tl.totalProgress() as number) * 100;
        fill.style.width = `${p}%`;
        playhead.style.left = `${p}%`;
      });
      tl.on("start", () => setStatus("Đang chạy"));
      tl.on("reverseComplete", () => setStatus("Về đầu"));

      playBtn.addEventListener("click", () => {
        tl.play();
        setStatus("Đang chạy");
      });
      reverseBtn.addEventListener("click", () => {
        tl.reverse();
        setStatus("Đang đảo chiều");
      });
      pauseBtn.addEventListener("click", () => {
        tl.pause();
        setStatus("Tạm dừng");
      });
      restartBtn.addEventListener("click", () => {
        tl.restart();
        setStatus("Đang chạy");
      });
    },
  },

  "sequence/stagger": {
    eyebrow: "Core",
    title: "stagger",
    lead: "Truyền stagger vào vars của to/from/fromTo khi target khớp nhiều phần tử — mỗi phần tử là một Tween riêng, chỉ khác nhau delay so le.",
    render: () => (
      <>
        <div class="content-pane__panel" style="align-items:center;">
          {[1, 2, 3, 4, 5].map((n) => (
            <div class="demo-animate-box stagger-box" style="width:64px;height:64px;flex:none;">
              {n}
            </div>
          ))}
        </div>
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy stagger
          </button>
        </div>

        {codeBlock(
          `six.to(".stagger-box", {
  y: -16,
  duration: 0.4,
  stagger: 0.08,       // mỗi phần tử trễ hơn phần tử trước 0.08s
  boomerang: true,
});

// dạng object — đổi thứ tự lan toả
six.to(".stagger-box", {
  y: -16,
  duration: 0.4,
  stagger: { each: 0.08, from: "center" },
});`,
          "js",
        )}

        {attrsTable([
          ["number", "độ trễ cố định (giây) nhân theo thứ tự index trong target", "—"],
          ["{ each }", "độ trễ (giây) mỗi bước — bắt buộc khi dùng dạng object", "—"],
          ['{ from: "start" }', "lan toả từ phần tử đầu tiên (mặc định)", '"start"'],
          ['{ from: "end" }', "lan toả từ phần tử cuối cùng", "—"],
          ['{ from: "center" }', "lan toả từ giữa ra hai bên", "—"],
          ["{ from: number }", "lan toả từ đúng index đó ra hai bên (vd from: 2)", "—"],
        ])}

        <p>
          Khi truyền <code>stagger</code> trực tiếp vào <code>six.to()</code>/<code>from()</code>/<code>fromTo()</code> (không qua timeline), kết quả trả về là một <code>Timeline</code> gộp toàn bộ tween con —
          pause/reverse/kill cả nhóm được như một khối, thay vì một mảng Tween rời rạc.
        </p>
        <p class="note">
          stagger cũng dùng được bên trong <code>timeline.to/from/fromTo(...)</code> — cú pháp y hệt, chỉ khác là các tween con được thêm vào đúng vị trí đó trên timeline thay vì trên root.
        </p>
      </>
    ),
    init: (root) => {
      const boxes = Array.from(root.querySelectorAll<HTMLElement>(".stagger-box"));
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.to(boxes, { y: -16, duration: 0.4, stagger: 0.08, boomerang: true });
      });
    },
  },

  "scroll/onScroll": {
    eyebrow: "Core",
    title: "onScroll (OnScroll)",
    lead: "Truyền onScroll vào vars của to/from/fromTo/timeline để biến animation thành scroll-driven — thay vì phát theo thời gian, nó phát theo vị trí cuộn của trang (hoặc một container bất kỳ).",
    render: () => (
      <>
        <div class="content-pane__panel">
          <div data-scroll-demo style="height:340px;width:100%;overflow-y:auto;border:1px solid var(--border);border-radius:8px;position:relative;">
            <div style="height:420px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;">Cuộn xuống bên trong khung này ⬇</div>
            <div class="demo-animate-box" data-scroll-box-fade style="width:130px;margin:0 auto 220px;">
              x + rotate
            </div>
            <div class="demo-animate-box" data-scroll-box-pop style="width:130px;margin:0 auto 220px;">
              scale + rotate
            </div>
            <div data-scroll-progress-track style="width:70%;margin:0 auto 360px;">
              <div style="height:8px;border-radius:999px;background:var(--surface-2);overflow:hidden;">
                <div data-scroll-progress style="height:100%;width:0%;background:linear-gradient(90deg,var(--primary),var(--accent));"></div>
              </div>
              <p style="text-align:center;color:var(--muted);font-size:12px;margin:8px 0 0;">scrub 1:1 theo % cuộn (sync: true)</p>
            </div>
          </div>
        </div>

        {codeBlock(
          `six.to(".box", {
  opacity: 1,
  x: 0,
  rotate: 0,
  duration: 1,
  ease: "cubicOut",
  onScroll: {
    container: "#my-scroll-container", // mặc định là window
    start: "top bottom", // bắt đầu chạy animation khi top của trigger chạm bottom của viewport
    end: "top center", // kết thúc khi top của trigger chạm center của viewport
  },
});`,
          "js",
        )}

        <p>
          Mỗi tween tự chọn cách phát riêng qua <code>onScroll</code> — toggle một lần khi cuộn qua ngưỡng (2 box phía trên), hoặc scrub bám sát % cuộn bằng <code>sync: true</code> (progress bar phía dưới):
        </p>
        {codeBlock(
          `six.to(".progress-bar", {
  width: "100%",
  onScroll: {
    trigger: ".progress-track",
    start: "top bottom",
    end: "bottom top",
    sync: true, // chạy animation theo cuộn chuột
  },
});`,
          "js",
        )}

        <p>
        Tạo trực tiếp bằng <code>OnScroll.create(vars)</code>:
        </p>
        {codeBlock(
          `import { OnScroll } from "@six-js/core/OnScroll";

OnScroll.create({
  trigger: ".section",
  start: "top center",
  onEnter: () => console.log("vào khung hình"),
  onLeave: () => console.log("rời khung hình"),
});`,
          "js",
        )}

        <h2>Vars</h2>
        {attrsTable([
          ["trigger", "phần tử làm mốc đo vị trí. Qua six.to(...): mặc định là target, không bắt buộc khai", "Element | selector", "—"],
          ["container", "container cuộn (nested overflow)", "Element | selector", "window"],
          [
            "start / end",
            'chuỗi "&lt;edge trigger&gt; &lt;edge viewport&gt;", cộng thêm được "+=N"/"-=N", hoặc hàm trả về 1 trong 2 dạng trên',
            "top|center|bottom|left|right|N%|Npx | number | (self) => string | number",
            '"top bottom" / "bottom top"',
          ],
          ["axis", "đổi sang đo theo trục ngang cho track cuộn ngang", '"x" | "y"', '"y"'],
          [
            "sync",
            "false = chỉ toggle play() khi cuộn qua start (xem ghi chú bên dưới); true = scrub 1:1 theo % cuộn; number (giây) = scrub có làm mượt (ease expoOut) trong từng đó giây mỗi lần cuộn",
            "boolean | number",
            "false",
          ],
          ["sticky", "ghim phần tử trong suốt quãng [start, end], đúng vị trí tự nhiên của nó (không nhảy lên top viewport)", "true (ghim chính trigger) | Element | selector", "false"],
          [
            "syncTo",
            "Cho phép trigger hoạt động với các hiệu ứng cuộn được tạo bằng animation, chẳng hạn horizontal scrolling hoặc storytelling sections, nơi nội dung được di chuyển bằng tween/timeline thay vì bằng thanh cuộn của trình duyệt.",
            "Animation",
            "—",
          ],
          ["debug / id", "debug vẽ 4 vạch start/end (2 theo trang, 2 theo viewport) để canh chỉnh; id gắn nhãn phân biệt khi có nhiều trigger trên màn hình", "boolean / string", "false / —"],
          ["onEnter / onLeave / onEnterBack / onLeaveBack", "callback theo từng hướng cuộn qua start/end", "(self) => void", "—"],
          ["onUpdate", "chỉ bắn khi đang ở trong [start, end], hoặc đúng frame vào/ra — không bắn liên tục khi cuộn ở chỗ khác trên trang", "(self) => void", "—"],
          ["onRefresh", "bắn mỗi khi refresh() đo lại vị trí", "(self) => void", "—"],
        ])}

        <p class="note">
          <strong>Mặc định khi không có sync</strong>: chỉ cuộn XUÔI qua <code>start</code> mới gọi <code>.play()</code> animation; cuộn ngược qua start, hoặc cuộn qua end theo cả hai hướng, KHÔNG tự gọi{" "}
          <code>.reverse()</code>/<code>.pause()</code> — chỉ callback tương ứng được bắn. Muốn animation tự lùi lại khi cuộn ngược lên, tự gọi animation.reverse() trong <code>onLeaveBack</code>.
        </p>
        <p class="note">
          <code>sticky</code> có thể ghim một phần tử KHÁC với trigger — trigger chỉ dùng để đo quãng cuộn, <code>sticky</code> chỉ định phần tử thực sự bị ghim.
        </p>
        <p class="note">
          Sau khi DOM/layout đổi (ảnh load xong, thêm/xoá nội dung làm lệch vị trí), gọi <code>OnScroll.refresh()</code> (refresh toàn bộ instance đang có) hoặc giữ lại instance trả về từ{" "}
          <code>OnScroll.create()</code> để tự gọi <code>.refresh()</code> riêng nó.
        </p>
      </>
    ),
    init: (root) => {
      const container = root.querySelector<HTMLElement>("[data-scroll-demo]")!;

      const fadeBox = root.querySelector<HTMLElement>("[data-scroll-box-fade]")!;
      six.set(fadeBox, { opacity: 0, x: -80, rotate: -15 });
      six.to(fadeBox, {
        opacity: 1,
        x: 0,
        rotate: 0,
        duration: 0.6,
        ease: "cubicOut",
        onScroll: { container, start: "top bottom", end: "top center" },
      });

      const popBox = root.querySelector<HTMLElement>("[data-scroll-box-pop]")!;
      six.set(popBox, { opacity: 0, scale: 0.5, rotate: -12 });
      six.to(popBox, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.6,
        ease: "backOut",
        onScroll: { container, start: "top bottom", end: "top center" },
      });

      const progressTrack = root.querySelector<HTMLElement>("[data-scroll-progress-track]")!;
      const progressBar = root.querySelector<HTMLElement>("[data-scroll-progress]")!;
      six.to(progressBar, {
        width: "100%",
        onScroll: { container, trigger: progressTrack, start: "top bottom", end: "bottom top", sync: true },
      });
    },
  },

  "scope/context": {
    eyebrow: "Core",
    title: "six.context()",
    lead: "Scope dọn dẹp chung: mọi Tween/Timeline (hoặc bất kỳ thứ gì có .kill()) tạo ra bên trong sẽ tự được scope này capture, để dọn hàng loạt bằng một lần revert()/kill().",
    render: () => (
      <>
        {codeBlock(
          `const scope = six.context((self) => {
  // mọi six.to/from/fromTo/timeline gọi đồng bộ ở đây
  // sẽ tự bị scope "bắt" và kill khi scope.revert()/kill()
  six.to(".hero", { x: 40, duration: 0.4 });

  // tự thêm những thứ khác cần dọn (ResizeObserver, event listener...) qua self.add()
  const ro = new ResizeObserver(() => {});
  ro.observe(document.body);
  self.add({ kill: () => ro.disconnect() });
});

// dọn dẹp toàn bộ khi component unmount, có thể run() lại sau đó
scope.revert();

// giống revert() nhưng đánh dấu scope đã "chết" — run() sau đó sẽ throw
scope.kill();

// bọc một callback chạy SAU (event listener, timeout...) để animation tạo bên trong
// nó vẫn được scope này capture — auto-capture chỉ hoạt động trong lúc run() còn đang chạy
button.addEventListener("click", scope.scope(() => {
  six.to(".hero", { x: 80, duration: 0.3 });
}));`,
          "js",
        )}

        {attrsTable([
          ["context(fn?)", "tạo Context mới; nếu truyền fn, gọi run(fn) ngay lập tức", "—"],
          ["scope.run(fn)", "đặt scope này làm scope đang active trong lúc fn chạy — mọi animation tạo bên trong tự được capture", "—"],
          ["scope.scope(fn)", "bọc fn thành một hàm mới — mỗi lần hàm đó được GỌI (dù là sau này, từ event listener/timeout), animation tạo bên trong vẫn tự capture vào scope này", "—"],
          ["scope.add(target)", "tự thêm một Killable (bất kỳ thứ gì có .kill()) vào danh sách sẽ bị dọn khi revert", "—"],
          ["scope.revert()", "gọi kill() trên toàn bộ đối tượng đã capture rồi xoá danh sách — scope vẫn dùng lại được (run() tiếp)", "—"],
          ["scope.kill()", "revert() + đánh dấu scope đã chết — gọi run() sau đó sẽ throw", "—"],
          ["scope.isDead", "getter — true sau khi đã kill()", "—"],
        ])}

        <p class="note">
          Cần chạy lại theo breakpoint (bật/tắt animation theo <code>window.matchMedia</code>)? Dùng <a href="#scope/breakpoint">six.breakpoint()</a> thay vì tự lắng nghe{" "}
          <code>matchMedia(...).addEventListener("change", ...)</code> tay — breakpoint() được xây trên chính Context này nên vẫn auto-capture y hệt.
        </p>
      </>
    ),
  },

  "scope/breakpoint": {
    eyebrow: "Core",
    title: "six.breakpoint()",
    lead: "Gắn việc setup/teardown animation theo trạng thái CSS media query, tự chạy lại khi điều kiện đổi — khỏi phải tự lắng nghe window.matchMedia() rồi if/else + kill() tay.",
    render: () => (
      <>
        <div class="bp-demo-layout">
          <div>
            <div class="bp-demo-frame" data-bp-frame>
              <div class="demo-animate-box" data-bp-box style="width:96px;height:96px;flex:none;">
                Desktop
              </div>
              <p style="margin:10px 0 0;font-family:var(--font-mono);font-size:13px;color:var(--text);" data-bp-note>
                đang khớp "isDesktop" — quay chậm, vô hạn
              </p>
            </div>
          </div>
          <div>
            {codeBlock(
              `const frame = document.querySelector(".bp-demo-frame");
const box = frame.querySelector(".box");
const note = frame.querySelector(".note");

const DESKTOP_MIN_WIDTH = 260; 
let isDesktop = null;

function applyState(desktop) {
  if (isDesktop === desktop) return; // đã ở đúng trạng thái, khỏi chạy lại
  isDesktop = desktop;

  box.textContent = desktop ? "Desktop" : "Mobile";
  note.textContent = desktop ? '"isDesktop"' : '"isMobile"';

  six.set(box, { scale: 1 });
  six.to(box, {
    scale: 0.8,
    duration: desktop ? 1 : 0.5, // desktop pulse chậm hơn mobile
    repeat: -1,
    boomerang: true,
    ease: "none",
    overwrite: true, // huỷ tween cũ mỗi lần đổi trạng thái, tránh chồng tween
  });
}

// ResizeObserver thay cho window.matchMedia — theo dõi bề rộng của CHÍNH khung này
const resizeObserver = new ResizeObserver(([entry]) => {
  applyState(entry.contentRect.width >= DESKTOP_MIN_WIDTH);
});
resizeObserver.observe(frame);`,
              "js",
            )}
          </div>
        </div>

        <p></p>
        {codeBlock(
          `const bp = six.breakpoint();

bp.add(
  { isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" },
  (ctx) => {
    // chạy ngay lần đầu, rồi chạy lại mỗi khi có điều kiện đổi (miễn còn ít nhất 1 cái match)
    // mọi six.to/from/fromTo/timeline gọi đồng bộ ở đây tự bị ctx (Context) capture
    six.to(".hero", { x: ctx.matches.isDesktop ? 40 : 0, duration: 0.4 });

    // (tuỳ chọn) trả về teardown — chạy trước lần chạy lại kế tiếp
    return () => six.set(".hero", { x: 0 });
  },
);

// một điều kiện đơn — không cần object map
bp.add("(min-width: 768px)", () => {
  six.to(".sidebar", { x: 0, duration: 0.3 });
});

bp.revert(); // dọn phần đang active nhưng vẫn tiếp tục lắng nghe — điều kiện đổi sau đó vẫn chạy lại
bp.kill();   // dọn + gỡ hẳn listener — add() sau đó sẽ throw

// sugar cho bp.add() khi chỉ cần một cặp điều kiện/callback ngay từ đầu:
six.breakpoint("(min-width: 1024px)", () => {
  /* ... */
});`,
          "js",
        )}

        {attrsTable([
          ["breakpoint()", "tạo instance rỗng, add() sau", "—"],
          ["breakpoint(conditions, callback)", "sugar cho breakpoint().add(conditions, callback)", "—"],
          [".add(conditions, callback)", "conditions: 1 chuỗi query, hoặc object map { tên: query }. callback(ctx) chạy khi match, có thể return cleanup", "—"],
          ["ctx.matches", "object map { tên: boolean } — chỉ có ý nghĩa khi conditions là object map (nhiều query cùng lúc)", "—"],
          [".revert()", "dọn phần đang active của MỌI add() (kill animation đã capture, chạy cleanup) — vẫn tiếp tục lắng nghe media query", "—"],
          [".kill()", "revert() + gỡ hẳn mọi MediaQueryList listener — instance chết hẳn, add() sau sẽ throw", "—"],
        ])}

        <p class="note">
          Mỗi <code>.add()</code> có một <code>Context</code> riêng (soft revert khi điều kiện đổi, không detach listener) — vì vậy tạo instance breakpoint bên trong một <code>six.context()</code> đang active
          thì cả cụm cũng tự bị scope ngoài capture, dọn một lượt khi scope ngoài <code>revert()</code>/<code>kill()</code>.
        </p>
        <p>
          Chỉ cần MỘT breakpoint đơn (bật trên ngưỡng, tắt dưới ngưỡng)? Dùng thẳng dạng sugar <code>six.breakpoint(query, callback)</code> khỏi cần gọi <code>.add()</code> tách rời.
        </p>

        <h2>ctx.scope() — capture animation tạo SAU lượt chạy đầu, không phải chỉ lúc callback đang chạy</h2>
        <p>
          Animation tạo đồng bộ ngay trong callback tự được <code>ctx</code> capture. Nhưng animation tạo bên trong một event listener gắn từ callback đó — chạy SAU, khi <code>ctx</code> không còn là scope
          đang active — thì KHÔNG tự capture, trừ khi bọc qua <code>ctx.scope(fn)</code>. Bấm "Pulse A" rồi "Pulse B" cho cả hai quay vô hạn, rồi bấm "Kill" để so sánh:
        </p>
        <div class="content-pane__panel" style="align-items:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div class="demo-animate-box" data-bp-pulse-a style="width:72px;height:72px;flex:none;">
              A
            </div>
            <button class="btn btn--ghost btn--sm" data-bp-pulse-a-btn>
              Pulse A (không capture)
            </button>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div class="demo-animate-box" data-bp-pulse-b style="width:72px;height:72px;flex:none;">
              B
            </div>
            <button class="btn btn--ghost btn--sm" data-bp-pulse-b-btn>
              Pulse B (ctx.scope())
            </button>
          </div>
        </div>
        <div class="content-pane__panel" style="align-items:center;">
          <button class="btn btn--primary btn--sm" data-bp-kill>
            Kill breakpoint này
          </button>
          <span style="font-family:var(--font-mono);font-size:13px;color:var(--muted);" data-bp-status>
            Bấm Pulse A / Pulse B để bắt đầu
          </span>
        </div>
        {codeBlock(
          `six.breakpoint("(min-width: 1px)", (ctx) => {
  btnA.addEventListener("click", () => {
    six.to(boxA, { rotate: 360, duration: 3, repeat: -1, ease: "none" }); // KHÔNG capture — ctx đã hết active từ lâu
  });

  btnB.addEventListener("click", ctx.scope(() => {
    six.to(boxB, { rotate: 360, duration: 3, repeat: -1, ease: "none" }); // capture vào ctx nhờ bọc qua ctx.scope()
  }));
});`,
          "js",
        )}
      </>
    ),
    init: (root) => {
      const frame = root.querySelector<HTMLElement>("[data-bp-frame]")!;
      const box = root.querySelector<HTMLElement>("[data-bp-box]")!;
      const note = root.querySelector<HTMLElement>("[data-bp-note]")!;

      // six.breakpoint() thật luôn bám window.matchMedia — không có khái niệm "theo bề rộng của
      // một khung/container". Khung kéo-giãn ở đây chỉ mô phỏng cùng ý tưởng (setup đổi khi cắt
      // qua một ngưỡng) bằng ResizeObserver, để không bắt người xem phải resize cả trình duyệt.
      const DESKTOP_MIN_WIDTH = 260;
      let isDesktop: boolean | null = null;

      const applyState = (desktop: boolean) => {
        if (isDesktop === desktop) return;
        isDesktop = desktop;
        box.textContent = desktop ? "Desktop" : "Mobile";
        note.textContent = desktop ? '"isDesktop"' : '"isMobile"';
        
        six.set(box, { scale: 1 });

        if (desktop) {
          six.to(box, { scale: 0.8, duration: 1, repeat: -1, ease: "none", overwrite: true, boomerang: true });
        } else {
          six.to(box, { scale: 0.8, duration: 0.5, repeat: -1, boomerang: true, ease: "none", overwrite: true });
        }
      };

      const resizeObserver = new ResizeObserver((entries) => {
        applyState(entries[0].contentRect.width >= DESKTOP_MIN_WIDTH);
      });
      resizeObserver.observe(frame);

      const boxA = root.querySelector<HTMLElement>("[data-bp-pulse-a]")!;
      const boxB = root.querySelector<HTMLElement>("[data-bp-pulse-b]")!;
      const btnA = root.querySelector<HTMLButtonElement>("[data-bp-pulse-a-btn]")!;
      const btnB = root.querySelector<HTMLButtonElement>("[data-bp-pulse-b-btn]")!;
      const killBtn = root.querySelector<HTMLButtonElement>("[data-bp-kill]")!;
      const status = root.querySelector<HTMLElement>("[data-bp-status]")!;

      const scopeDemoBp = six.breakpoint("(min-width: 1px)", (ctx) => {
        const onPulseA = () => {
          six.to(boxA, { rotate: 360, duration: 3, repeat: -1, ease: "none" });
        };
        btnA.addEventListener("click", onPulseA);

        const onPulseB = ctx.scope(() => {
          six.to(boxB, { rotate: 360, duration: 3, repeat: -1, ease: "none" });
        });
        btnB.addEventListener("click", onPulseB);

        status.textContent = "Đang sống — bấm Pulse A, Pulse B rồi Kill để so sánh";

        return () => {
          btnA.removeEventListener("click", onPulseA);
          btnB.removeEventListener("click", onPulseB);
        };
      });

      killBtn.addEventListener("click", () => {
        scopeDemoBp.kill();
        status.textContent = "Đã kill — A vẫn quay (tạo ngoài capture), B dừng ngay (bị ctx.scope() capture)";
      });

      // Router chỉ innerHTML-thay nội dung khi chuyển trang, không tự gọi cleanup nào — cả
      // ResizeObserver lẫn breakpoint() bên dưới đều sống mãi (và box vẫn quay/nhấp nháy vô hạn)
      // nếu không tự dọn khi rời trang.
      window.addEventListener(
        "hashchange",
        () => {
          resizeObserver.disconnect();
          six.to(box, { opacity: 1, duration: 0, overwrite: true });
          scopeDemoBp.kill();
        },
        { once: true },
      );
    },
  },

  "utils/set": {
    eyebrow: "Core",
    title: "six.set()",
    lead: "Áp giá trị ngay lập tức, không có animation (tween với duration 0) — dùng để đặt trạng thái khởi tạo.",
    render: () => (
      <>
        {playgroundBox("set()")}
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy six.set()
          </button>
        </div>

        {codeBlock(`six.set(".box", { rotate: 45, backgroundColor: "#ff6b4a" });`, "js")}
      </>
    ),
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      let toggled = false;
      btn.addEventListener("click", () => {
        toggled = !toggled;
        six.set(box, toggled ? { rotate: 45, backgroundColor: "#ff6b4a" } : { rotate: 0, backgroundColor: "" });
      });
    },
  },

  "utils/config": {
    eyebrow: "Core",
    title: "six.config()",
    lead: "Đặt duration/ease mặc định toàn cục cho mọi to/from/fromTo/timeline gọi sau đó, khỏi phải lặp lại ở từng lời gọi.",
    render: () => (
      <>
        {codeBlock(
          `six.config({
  duration: 0.5,
  ease: "quadOut",
});

// từ đây trở đi, không truyền duration/ease vẫn dùng giá trị trên
six.to(".box", { x: 100 });`,
          "js",
        )}
        <p class="note">
          Mặc định <code>duration: 0.8</code>, <code>ease: "none"</code> (none alias linear).
        </p>
      </>
    ),
  },

  "utils/helpers": {
    eyebrow: "Core",
    title: "six.utils",
    lead: "Namespace gộp các hàm tiện ích dùng chung: chuẩn hoá target, chọn phần tử theo id/class, giới hạn số, lấy giá trị ngẫu nhiên.",
    render: () => (
      <>
        {codeBlock(
          `six.utils.arrayOf(".card");             // -> Element[] — chuẩn hoá selector/Element/NodeList/mảng thành Element[]
six.utils.getById("hero");              // -> HTMLElement | null (truyền id thuần, không có "#")
six.utils.getByClass("card");           // -> Element[] (truyền class thuần, không có ".")
six.utils.clamp(0, 100, 120);           // -> 100
const clamp01 = six.utils.clamp(0, 1);  // bỏ value -> trả về hàm curry (value) => number
six.utils.random(1, 10);                // -> số thực ngẫu nhiên trong [1, 10]
six.utils.random(1, 10, 1);             // -> snap theo bước 1 (số nguyên)
six.utils.random([1, 2, 3]);            // -> 1 phần tử ngẫu nhiên trong mảng`,
          "js",
        )}

        {attrsTable([
          ["arrayOf(target, scope?)", "chuẩn hoá mọi kiểu target six-js chấp nhận (selector, Element, NodeList, mảng...) thành Element[] — chính logic six-js dùng nội bộ cho to/from/fromTo", "—"],
          ["getById(id)", "document.getElementById — id thuần, không có dấu #", "—"],
          ["getByClass(className, scope?)", "document.getElementsByClassName — class thuần, không có dấu . ; scope mặc định là document", "—"],
          ["clamp(min, max, value?)", "giới hạn value trong [min, max]; bỏ value sẽ trả về hàm curry (value) => number", "—"],
          ["random(min, max, snap?, asFn?)", "số ngẫu nhiên trong [min, max], snap làm tròn theo bước, asFn=true trả về hàm sinh số thay vì 1 giá trị", "—"],
          ["random(array)", "trả về 1 phần tử ngẫu nhiên trong mảng", "—"],
        ])}
      </>
    ),
  },
};

export { coreContent };
