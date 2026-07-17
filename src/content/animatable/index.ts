import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/animatable-router/content-types";
import { attrsTable, codeBlock } from "../shared";

function playgroundBox(label: string): string {
  return `
    <div class="content-pane__panel" style="align-items:center;">
      <div class="demo-animate-box" data-tw-box style="width:100px;flex:none;">${label}</div>
    </div>
  `;
}

const tweenCommonAttrs = attrsTable([
  ["duration", "thời gian, tính bằng giây", "0.8 (six.config())"],
  ["ease", 'tên easing (xem trang "Thuộc tính & Easing") hoặc hàm (t: number) => number', '"none" (tuyến tính, six.config())'],
  ["delay", "giây trước khi tween thực sự chạy", "0"],
  ["repeat", "số lần lặp lại (-1 = vô hạn)", "0"],
  ["repeatDelay", "khoảng nghỉ giữa các lần lặp (giây)", "0"],
  ["boomerang", "true | false — lặp có đảo chiều (yoyo)", "false"],
  ["paused", "true — tạo tween ở trạng thái tạm dừng, tự .play() sau", "false"],
  ["overwrite", 'true | "auto" | false — huỷ (true) hoặc gỡ đúng property đang trùng ("auto") trên tween khác cùng target', "false"],
  ["stagger", "number | { each, from } — khi target khớp nhiều phần tử (xem trang stagger)", "—"],
  ["onScroll", "{ trigger?, scroller?, start, end, sync, sticky, ... } — biến tween thành scroll-driven (xem trang onScroll)", "—"],
  ["onStart / onUpdate / onComplete / onRepeat / onReverseComplete", "() => void — callback vòng đời", "—"],
]);

let smoothDemoInstance: ReturnType<typeof six.smoothScroll> | null = null;

const animatableContent: ContentMap = {
  "tween/to": {
    eyebrow: "Animatable",
    title: "six.to()",
    lead: "Tween các thuộc tính của target từ giá trị hiện tại đến giá trị bạn khai báo trong vars.",
    render: () => `
      ${playgroundBox("to()")}
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy six.to()</button>
      </div>

      ${codeBlock(
        `six.to(".box", {
  x: 160,
  rotate: 12,
  duration: 0.6,
  ease: "backOut",
});`,
        "js",
      )}

      <h2>Vars dùng chung cho to / from / fromTo</h2>
      ${tweenCommonAttrs}

      <p class="note">Trả về <code>Tween</code> (hoặc <code>Timeline</code> nếu có <code>stagger</code>) — instance có đủ API của <code>Animation</code>: <code>.play() .pause() .resume() .reverse() .restart() .seek(t) .progress() .totalProgress() .kill()</code>, và <code>.on("start"|"update"|"complete"|"repeat"|"reverseComplete", cb)</code>.</p>
      <p class="note"><code>overwrite: true</code> huỷ toàn bộ tween cũ đang chiếm target (mọi property của nó, không chỉ property trùng); <code>overwrite: "auto"</code> chỉ gỡ đúng property trùng khỏi tween cũ — các property khác của nó vẫn chạy tiếp. Không áp dụng cho tween dùng <code>keyframes</code>.</p>
      <p>Xem những thuộc tính nào animate được và toàn bộ bảng easing tại trang <a href="#tween/properties">Thuộc tính &amp; Easing</a>.</p>
    `,
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
    eyebrow: "Animatable",
    title: "six.from()",
    lead: "Ngược với to(): khai báo giá trị bắt đầu trong vars, six-js tự lấy giá trị HIỆN TẠI của target (đọc ngay lúc tạo tween) làm điểm đến.",
    render: () => `
      ${playgroundBox("from()")}
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy six.from()</button>
      </div>

      ${codeBlock(
        `six.from(".box", {
  opacity: 0,
  y: 40,
  duration: 0.5,
  ease: "quadOut",
});`,
        "js",
      )}

      <p class="note">Giá trị đích được chốt ngay khi tween khởi tạo (constructor tự render frame 0 đồng bộ) — nếu style hiện tại của target đổi <em>sau</em> đó, tween vẫn nhắm tới giá trị đã chốt từ đầu, không đọc lại DOM giữa chừng.</p>
      <p>Muốn replay lại một demo/hiệu ứng from() nhiều lần, nhớ <code>six.set()</code> target về trạng thái ban đầu trước khi gọi <code>from()</code> lần nữa (xem <code>init</code> của demo này).</p>
    `,
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
    eyebrow: "Animatable",
    title: "six.fromTo()",
    lead: "Khai báo tường minh cả hai đầu: fromVars và toVars, không phụ thuộc giá trị hiện tại của target.",
    render: () => `
      ${playgroundBox("fromTo()")}
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy six.fromTo()</button>
      </div>

      ${codeBlock(
        `six.fromTo(
  ".box",
  { scale: 0.5, opacity: 0.4 },
  { scale: 1, opacity: 1, duration: 0.5, ease: "cubicOut" },
);`,
        "js",
      )}

      <p class="note"><code>scale</code> là shorthand — tự mở rộng thành cả <code>scaleX</code> và <code>scaleY</code> (mỗi cái có track/overwrite riêng).</p>
      <p>Một property có thể chỉ khai trong <code>fromVars</code> hoặc chỉ trong <code>toVars</code> — đầu nào thiếu sẽ tự đọc giá trị hiện tại của target cho đúng đầu đó, giống hệt to()/from() dùng riêng cho property đó.</p>
    `,
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.fromTo(box, { scale: 0.5, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.5, ease: "cubicOut" });
      });
    },
  },

  "tween/keyframes": {
    eyebrow: "Animatable",
    title: "keyframes",
    lead: "Truyền keyframes vào vars của six.to() để chạy nhiều chặng giá trị nối tiếp nhau trên cùng một tween, thay vì phải nối nhiều six.to() bằng timeline.",
    render: () => `
      ${playgroundBox("keyframes")}
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy keyframes</button>
      </div>

      ${codeBlock(
        `// Dạng mảng — mỗi phần tử là một chặng, "duration"/"ease" riêng (tuỳ chọn)
six.to(".box", {
  duration: 1.2, // tổng thời lượng nếu chặng không tự khai duration riêng
  keyframes: [
    { x: 120, duration: 0.4 },
    { y: -40, ease: "backOut" },
    { x: 0, y: 0, rotate: 360 },
  ],
});

// Dạng phần trăm — vị trí "N%" tính theo tổng duration của tween
six.to(".box", {
  duration: 1.2,
  keyframes: {
    "0%": { x: 0, y: 0 },
    "40%": { x: 120, ease: "backOut" },
    "100%": { x: 0, y: 0, rotate: 360 },
  },
});`,
        "js",
      )}

      ${attrsTable([
        ["duration (trên từng chặng)", "thời lượng riêng của chặng — bỏ qua sẽ chia đều phần thời gian còn lại cho các chặng chưa khai", "chia đều / 0.5s"],
        ["ease (trên từng chặng)", "ease riêng cho đoạn nối tới chặng đó — bỏ qua dùng ease chung của tween", "ease chung"],
        ["duration (trên tween)", "tổng thời lượng — bắt buộc phải khai nếu dùng dạng phần trăm", "0.5"],
      ])}

      <p class="note">Giá trị cuối của một chặng tự trở thành điểm bắt đầu (from) của chặng kế tiếp — six-js truyền thẳng giá trị đó chứ không đọc lại DOM, nên việc build track "lười" (lazy, không nhất thiết đúng thứ tự chặng) giữa các chặng không gây sai lệch.</p>
      <p class="note">Tween dùng <code>keyframes</code> không hỗ trợ <code>overwrite</code> (bị bỏ qua) và không bắn sự kiện onStart/onComplete riêng cho từng chặng — chỉ sự kiện của tween ngoài cùng được bắn.</p>
    `,
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.set(box, { x: 0, y: 0, rotate: 0 });
        six.to(box, {
          duration: 1.2,
          keyframes: [{ x: 120, duration: 0.4 }, { y: -40, ease: "backOut" }, { x: 0, y: 0, rotate: 360 }],
        });
      });
    },
  },

  "tween/properties": {
    eyebrow: "Animatable",
    title: "Thuộc tính & Easing",
    lead: "six-js tự nhận diện loại thuộc tính (transform, màu, chuỗi phức hợp, biến CSS, thuộc tính DOM thường...) và đơn vị đo dựa trên giá trị bạn truyền — không cần khai loại thủ công.",
    render: () => `
      <h2>Transform</h2>
      ${attrsTable([
        ["x, y, z", 'translate — px mặc định; truyền chuỗi "N%" cho x/y để dịch theo % kích thước chính nó (tương tự xPercent/yPercent)', "px"],
        ["rotate, rotateX, rotateY", "góc xoay", "deg"],
        ["scale", "shorthand — tự mở rộng thành scaleX + scaleY", "1"],
        ["scaleX, scaleY", "tỉ lệ theo từng trục", "1"],
        ["skewX, skewY", "góc nghiêng", "deg"],
      ])}
      <p class="note">Toàn bộ transform của một phần tử được gộp và ghi vào <em>một</em> chuỗi <code>transform</code> duy nhất mỗi frame. six-js đọc <code>matrix()</code>/<code>matrix3d()</code> đã có sẵn trên phần tử ngay lần đầu chạm tới nó, để không "nuốt mất" transform bạn đã set từ trước theo cách khác.</p>

      <h2>Màu sắc</h2>
      <p>Tự nhận diện: <code>backgroundColor, color, borderColor, outlineColor, fill, stroke, stopColor</code> — hỗ trợ hex, <code>rgb()/rgba()</code> (cả cú pháp dấu phẩy lẫn cú pháp space hiện đại) và tên màu CSS.</p>

      <h2>Chuỗi phức hợp (nội suy theo token)</h2>
      <p><code>boxShadow, textShadow, borderRadius, clipPath, filter, backgroundPosition, backgroundSize, objectPosition</code> — six-js tách từng số (và màu nhúng bên trong) trong chuỗi rồi nội suy đúng theo vị trí. Nếu chuỗi đầu/cuối có cấu trúc token khác nhau, six-js tự hạ xuống kiểu "đổi tức thời ở cuối tween" thay vì nội suy nửa vời.</p>

      <h2>Biến CSS, style thường, thuộc tính khác</h2>
      ${attrsTable([
        ["--my-var", "biến CSS tuỳ chỉnh — tự nhận numeric hay discrete dựa trên giá trị hiện tại/giá trị truyền vào", "—"],
        ["style property khác", "numeric (đơn vị px mặc định, trừ opacity/zIndex/flexGrow/flexShrink/order/fontWeight — không đơn vị) nếu giá trị là số, ngược lại discrete (đổi tức thời ở cuối)", "px"],
        ["scrollTop, currentTime, volume, ...", "thuộc tính JS number thường (không phải style, không qua CSSOM) — six-js gán thẳng vào field đó", "—"],
        ["còn lại (SVG cx/cy, data-*, ...)", "rơi về setAttribute(prop, value)", "—"],
      ])}
      <p class="note">Một thuộc tính có sẵn trên phần tử nhưng không phải kiểu <code>number</code> thuần (vd <code>cx</code>/<code>cy</code> trên SVG là <code>SVGAnimatedLength</code>) sẽ KHÔNG bị gán đè trực tiếp — six-js tự chuyển sang <code>setAttribute</code> để tránh ghi sai kiểu dữ liệu.</p>

      <h2>Đơn vị đo</h2>
      <p>Numeric property hỗ trợ <code>px, rem, em, vh, vw, %</code> — quy đổi qua đo đạc thật (font-size gốc / font-size của chính phần tử, kích thước viewport, <code>clientWidth</code>/<code>clientHeight</code> của phần tử cha), không phải tỉ lệ cố định. Riêng góc xoay (<code>deg/rad/turn</code>) không quy đổi qua px.</p>

      <h2>Giá trị tương đối</h2>
      ${codeBlock(
        `six.to(".box", { x: "+=50" });     // cộng thêm 50 vào giá trị hiện tại
six.to(".box", { x: "-=50" });     // trừ đi 50
six.to(".box", { scaleX: "*=2" }); // nhân đôi
six.to(".box", { scaleX: "/=2" }); // chia đôi`,
        "js",
      )}

      <h2>Bảng easing (ease: "...")</h2>
      ${codeBlock(
        `// Mỗi họ có 3 biến thể In / Out / InOut, vd quadIn, quadOut, quadInOut:
quad · cubic · quart · quint · sine · expo · circ · back · bounce · elastic

// Không cong:
none    // tuyến tính — mặc định gốc khi không truyền ease và chưa gọi six.config()
linear  // alias của none

// Chữ ký riêng của six-js (không theo tên thư viện nào khác):
smooth  // easeInOut rất mượt, không "coast" ở 2 đầu (quintic smootherstep)
spring  // damped-spring, overshoot rồi tắt dần (~1.75 dao động)
jelly   // giống spring nhưng lỏng & tắt chậm hơn (~1.25 dao động)`,
        "js",
      )}
      <p class="note">Truyền tên easing không tồn tại (sai chính tả) sẽ tự rơi về <code>"quadOut"</code> chứ không throw lỗi — kiểm tra kỹ tên nếu thấy easing "lạ". Cũng có thể truyền thẳng hàm <code>(t: number) => number</code> (t và kết quả trong khoảng 0–1) thay vì tên có sẵn.</p>
    `,
  },

  "sequence/timeline": {
    eyebrow: "Animatable",
    title: "six.timeline()",
    lead: 'Gộp nhiều tween vào một hàng thời gian, canh nhau bằng vị trí tương đối ("-=0.2", "<", nhãn label...). Bản thân timeline cũng là một Animation — play/pause/reverse/repeat/boomerang y hệt một tween.',
    render: () => `
      <div class="content-pane__panel" style="align-items:center;">
        <div class="demo-animate-box" data-tl-box style="width:80px;flex:none;">1</div>
        <div class="demo-animate-box" data-tl-box style="width:80px;flex:none;">2</div>
        <div class="demo-animate-box" data-tl-box style="width:80px;flex:none;">3</div>
      </div>
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy timeline</button>
      </div>

      ${codeBlock(
        `six
  .timeline()
  .from(".box-1", { opacity: 0, y: 24, duration: 0.5 })
  .from(".box-2", { opacity: 0, y: 24, duration: 0.5 }, "-=0.3")
  .from(".box-3", { opacity: 0, y: 24, duration: 0.5 }, "-=0.3")
  .addLabel("done")
  .call(() => console.log("timeline xong"), "done");`,
        "js",
      )}

      <h2>Tham số vị trí (position) — đối số cuối của to/from/fromTo/set/call/add/addLabel</h2>
      ${attrsTable([
        ["(bỏ trống)", "nối tiếp ngay sau khi tween/label thêm trước đó kết thúc", "—"],
        ["số giây", "vị trí tuyệt đối trên timeline", "—"],
        ['"<" / "<+=0.2" / "<-=0.2"', "cùng lúc bắt đầu với tween thêm trước đó (kèm lệch thêm nếu có)", "—"],
        ['">" / ">+=0.2"', "ngay sau khi tween thêm trước đó KẾT THÚC (kèm lệch thêm nếu có)", "—"],
        ['"+=0.5" / "-=0.5"', "lệch so với vị trí cuối hiện tại của timeline (cursor)", "—"],
        ['"tênLabel" / "tênLabel+=0.3"', "vị trí của label đã addLabel() (kèm lệch thêm nếu có)", "—"],
      ])}

      <h2>Methods</h2>
      ${attrsTable([
        [".to/.from/.fromTo(target, vars, position?)", "thêm tween con — vars nhận thêm stagger, không nhận onScroll riêng (đặt onScroll ở six.timeline({ onScroll }) cho cả timeline)", "—"],
        [".set(target, vars, position?)", "tween duration 0 — set giá trị ngay khi timeline chạy tới vị trí đó", "—"],
        [".call(fn, position?)", "chèn một callback (không animate gì) vào đúng vị trí đó", "—"],
        [".add(childAnimation, position?)", "gắn thẳng một Tween/Timeline đã tạo sẵn (vd lồng timeline khác) vào vị trí đó", "—"],
        [".addLabel(name, position?)", "đặt tên cho một vị trí để tham chiếu lại bằng chuỗi position sau này", "—"],
        [".getLabelTime(name)", "đọc lại thời điểm (giây) của một label", "—"],
      ])}

      <h2>Vars khi tạo timeline</h2>
      ${attrsTable([
        ["defaults", "TweenVars merge (ưu tiên thấp nhất) vào mọi .to/.from/.fromTo thêm vào timeline này — khỏi lặp lại duration/ease ở từng lời gọi", "—"],
        ["onScroll", "biến CẢ timeline thành scroll-driven — bắt buộc tự khai trigger (timeline không có target mặc định để suy ra)", "—"],
      ])}
      ${codeBlock(
        `const tl = six.timeline({ defaults: { duration: 0.4, ease: "quadOut" } });
tl.to(".a", { x: 100 }).to(".b", { x: 100 }, "<"); // cả 2 dùng chung duration/ease ở trên`,
        "js",
      )}

      <p class="note">Timeline kế thừa toàn bộ API vòng đời của Animation: <code>.play() .pause() .resume() .reverse() .restart() .seek(t) .progress() .totalProgress() .kill()</code>, và nhận cả <code>repeat</code>/<code>repeatDelay</code>/<code>boomerang</code>/<code>delay</code> giống một tween — lặp lại/đảo chiều cả cụm animation bên trong như một khối duy nhất.</p>
      <p class="note">Có thể lồng timeline trong timeline bằng <code>.add(timelineKhac, position)</code> — thời gian được truyền xuống dạng phép biến đổi toạ độ, nên pause/reverse ở timeline cha vẫn tính đúng cho timeline con bên trong.</p>
    `,
    init: (root) => {
      const boxes = Array.from(root.querySelectorAll<HTMLElement>("[data-tl-box]"));
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.set(boxes, { opacity: 1, y: 0 });
        six
          .timeline()
          .from(boxes[0], { opacity: 0, y: 24, duration: 0.5 })
          .from(boxes[1], { opacity: 0, y: 24, duration: 0.5 }, "-=0.3")
          .from(boxes[2], { opacity: 0, y: 24, duration: 0.5 }, "-=0.3");
      });
    },
  },

  "sequence/stagger": {
    eyebrow: "Animatable",
    title: "stagger",
    lead: "Truyền stagger vào vars của to/from/fromTo khi target khớp nhiều phần tử — mỗi phần tử là một Tween riêng, chỉ khác nhau delay so le.",
    render: () => `
      <div class="content-pane__panel" style="align-items:center;">
        ${[1, 2, 3, 4, 5].map((n) => `<div class="demo-animate-box stagger-box" style="width:64px;height:64px;flex:none;">${n}</div>`).join("")}
      </div>
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy stagger</button>
      </div>

      ${codeBlock(
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

      ${attrsTable([
        ["number", "độ trễ cố định (giây) nhân theo thứ tự index trong target", "—"],
        ["{ each }", "độ trễ (giây) mỗi bước — bắt buộc khi dùng dạng object", "—"],
        ['{ from: "start" }', "lan toả từ phần tử đầu tiên (mặc định)", '"start"'],
        ['{ from: "end" }', "lan toả từ phần tử cuối cùng", "—"],
        ['{ from: "center" }', "lan toả từ giữa ra hai bên", "—"],
        ["{ from: number }", "lan toả từ đúng index đó ra hai bên (vd from: 2)", "—"],
      ])}

      <p>Khi truyền <code>stagger</code> trực tiếp vào <code>six.to()</code>/<code>from()</code>/<code>fromTo()</code> (không qua timeline), kết quả trả về là một <code>Timeline</code> gộp toàn bộ tween con — pause/reverse/kill cả nhóm được như một khối, thay vì một mảng Tween rời rạc.</p>
      <p class="note">stagger cũng dùng được bên trong <code>timeline.to/from/fromTo(...)</code> — cú pháp y hệt, chỉ khác là các tween con được thêm vào đúng vị trí đó trên timeline thay vì trên root.</p>
    `,
    init: (root) => {
      const boxes = Array.from(root.querySelectorAll<HTMLElement>(".stagger-box"));
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.to(boxes, { y: -16, duration: 0.4, stagger: 0.08, boomerang: true });
      });
    },
  },

  "scroll/onScroll": {
    eyebrow: "Animatable",
    title: "onScroll (OnScroll)",
    lead: "Truyền onScroll vào vars của to/from/fromTo/timeline để biến animation thành scroll-driven — thay vì phát theo thời gian, nó phát theo vị trí cuộn của trang (hoặc một container bất kỳ).",
    render: () => `
      <div class="content-pane__panel">
        <div data-scroll-demo style="height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;position:relative;">
          <div style="height:160px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;">Cuộn xuống bên trong khung này ⬇</div>
          <div class="demo-animate-box" data-scroll-box style="width:110px;margin:0 auto 240px;">reveal</div>
        </div>
      </div>

      ${codeBlock(
        `six.to(".box", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  ease: "cubicOut",
  onScroll: {
    scroller: "#my-scroll-container", // mặc định là window
    start: "top bottom",              // top của .box chạm bottom của viewport/scroller
    end: "top center",
  },
});`,
        "js",
      )}

      <p>Đây là cú pháp rút gọn qua <code>six.to/from/fromTo/timeline()</code> — <code>trigger</code> tự mặc định là chính target (bỏ qua được), <code>animation</code> tự gán. Muốn dùng độc lập (không gắn animation, chỉ cần callback), tạo trực tiếp bằng <code>OnScroll.create(vars)</code>:</p>
      ${codeBlock(
        `import { OnScroll } from "@six-js/core";

OnScroll.create({
  trigger: ".section",
  start: "top center",
  onEnter: () => console.log("vào khung hình"),
  onLeave: () => console.log("rời khung hình"),
});`,
        "js",
      )}

      <h2>Vars</h2>
      ${attrsTable([
        ["trigger", "Element | selector — phần tử làm mốc đo vị trí. Qua six.to(...): mặc định là target, không bắt buộc khai", "—"],
        ["scroller", "Element | selector — container cuộn (nested overflow), mặc định window", "window"],
        [
          "start / end",
          'chuỗi "&lt;edge trigger&gt; &lt;edge viewport&gt;" (top|center|bottom|left|right|N%|Npx, cộng thêm được "+=N"/"-=N"), số, hoặc hàm trả về 1 trong 2 dạng trên',
          '"top bottom" / "bottom top"',
        ],
        ["axis", '"y" (mặc định) | "x" — đổi sang đo theo trục ngang cho track cuộn ngang', '"y"'],
        ["sync", "false = chỉ toggle play() khi cuộn qua start (xem ghi chú bên dưới); true = scrub 1:1 theo % cuộn; number (giây) = scrub có làm mượt (ease expoOut) trong từng đó giây mỗi lần cuộn", "false"],
        ["sticky", "true (ghim chính trigger) | Element | selector — ghim phần tử trong suốt quãng [start, end], đúng vị trí tự nhiên của nó (không nhảy lên top viewport)", "false"],
        ["syncTo", "một Animation khác (thường là timeline có onScroll scrub riêng) — tiến độ của trigger NÀY bám theo totalProgress() của animation đó thay vì theo cuộn thật (dựng reveal lồng trong track cuộn ngang đang bị ghim)", "—"],
        ["debug / id", "debug: true vẽ 4 vạch start/end (2 theo trang, 2 theo viewport) để canh chỉnh; id gắn nhãn phân biệt khi có nhiều trigger trên màn hình", "false"],
        ["onEnter / onLeave / onEnterBack / onLeaveBack", "callback(self) theo từng hướng cuộn qua start/end", "—"],
        ["onUpdate(self)", "chỉ bắn khi đang ở trong [start, end], hoặc đúng frame vào/ra — không bắn liên tục khi cuộn ở chỗ khác trên trang", "—"],
        ["onRefresh(self)", "bắn mỗi khi refresh() đo lại vị trí", "—"],
      ])}

      <p class="note"><strong>Mặc định khi không có sync</strong>: chỉ cuộn XUÔI qua <code>start</code> mới gọi <code>.play()</code> animation; cuộn ngược qua start, hoặc cuộn qua end theo cả hai hướng, KHÔNG tự gọi <code>.reverse()</code>/<code>.pause()</code> — chỉ callback tương ứng được bắn. Muốn animation tự lùi lại khi cuộn ngược lên, tự gọi animation.reverse() trong <code>onLeaveBack</code>.</p>
      <p class="note"><code>sticky</code> thay cho khái niệm "pin" — có thể ghim một phần tử KHÁC với trigger (trigger chỉ dùng để đo quãng cuộn, sticky chỉ định phần tử thực sự bị ghim).</p>
      <p class="note">Sau khi DOM/layout đổi (ảnh load xong, thêm/xoá nội dung làm lệch vị trí), gọi <code>OnScroll.refresh()</code> (refresh toàn bộ instance đang có) hoặc giữ lại instance trả về từ <code>OnScroll.create()</code> để tự gọi <code>.refresh()</code> riêng nó.</p>
    `,
    init: (root) => {
      const scroller = root.querySelector<HTMLElement>("[data-scroll-demo]")!;
      const box = root.querySelector<HTMLElement>("[data-scroll-box]")!;
      six.set(box, { opacity: 0, y: 40 });
      six.to(box, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "cubicOut",
        onScroll: { scroller, start: "top bottom", end: "top center" },
      });
    },
  },

  "scroll/smoothScroll": {
    eyebrow: "Animatable",
    title: "six.smoothScroll()",
    lead: "Cuộn mượt (inertia/damping khi lăn chuột) — di chuyển vị trí cuộn NGUYÊN BẢN của trang (window.scrollTo/scrollTop thật), không phải transform giả lập, nên link neo, tìm-trong-trang, IntersectionObserver, onScroll... vẫn hoạt động bình thường.",
    render: () => `
      <div class="content-pane__panel">
        <div data-smooth-demo style="height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;">
          <div style="height:640px;padding:16px;color:var(--muted);font-size:13px;">Lăn chuột (wheel) bên trong khung này để thấy độ trễ mượt — hoặc bấm nút bên dưới.</div>
        </div>
        <div class="content-pane__panel">
          <button class="btn btn--ghost btn--sm" data-scroll-top>Lên đầu</button>
          <button class="btn btn--ghost btn--sm" data-scroll-bottom>Xuống cuối</button>
        </div>
      </div>

      ${codeBlock(
        `const smooth = six.smoothScroll({
  scroller: "#my-scroll-container", // mặc định window
  lerp: 0.1,                        // độ "trễ" khi cuộn bằng wheel — bỏ qua nếu dùng duration
});

smooth.scrollTo("#section-2", { offset: -20 });
smooth.scrollTo("bottom");
smooth.stop();   // đóng băng cuộn (vd khi mở modal) — chặn cả wheel lẫn touch-drag
smooth.start();
smooth.kill();`,
        "js",
      )}

      <h2>Vars</h2>
      ${attrsTable([
        ["scroller", "Element | selector — container cuộn, mặc định window (giống OnScrollVars.scroller)", "window"],
        ["axis", '"y" | "x"', '"y"'],
        ["lerp", "cường độ giảm chấn 0–1 khi cuộn bằng wheel (đã tinh chỉnh sẵn cho 60fps) — bỏ qua nếu đã set duration", "0.1"],
        ["duration", "giây — chuyển sang chế độ tween thời lượng cố định (thay vì giảm chấn liên tục) cho input wheel", "—"],
        ["ease", "easing (như TweenVars.ease) — chỉ dùng khi có duration", '"expoOut"'],
        ["wheelMultiplier", "hệ số nhân thêm vào delta wheel", "1"],
        ["onScroll / onStart / onStop", "callback(self) mỗi lần cuộn / bắt đầu / dừng chuyển động", "—"],
      ])}

      <h2>Instance</h2>
      ${attrsTable([
        [".scrollTo(target, opts?)", 'target: số | "top"/"bottom"/"start"/"end" | selector | Element. opts: { offset, immediate, lock, force, lerp, duration, ease, onStart, onComplete }', "—"],
        [".stop() / .start()", "đóng băng / mở lại cuộn — chặn cả wheel và kéo chạm (không chặn được việc kéo thanh scrollbar gốc)", "—"],
        ['.on/.off("scroll"|"start"|"stop", cb)', "lắng nghe sự kiện", "—"],
        [".scroll / .progress", "vị trí hiện tại (px) / tỉ lệ 0–1 theo giới hạn cuộn", "—"],
        [".velocity / .direction", "px/giây thực tế, và hướng hiện tại (1 | -1 | 0)", "—"],
        [".isScrolling / .isStopped", "đang trong quá trình easing tới đích? / đã .stop() chưa?", "—"],
        [".kill()", "gỡ toàn bộ listener/ResizeObserver, dừng ticker", "—"],
      ])}

      <p class="note">Chạm (touch) được để nguyên native, không làm mượt lại bằng JS — vì momentum-scroll thật của hệ điều hành thường đã mượt sẵn.</p>
      <p class="note">Mỗi lần ghi vị trí, six-js tự bắn kèm một sự kiện <code>"scroll"</code> đồng bộ (cùng frame) lên chính scroller — nhờ vậy <code>OnScroll</code> luôn cập nhật đúng khung hình, không bị trễ 1 frame chờ sự kiện scroll thật (bất đồng bộ) của trình duyệt.</p>
      <p class="note">Tương tác với <code>sx-dialog</code>: dialog khoá wheel/touch ở capture phase bằng <code>preventDefault()</code> — <code>smoothScroll</code> tự đọc đúng cờ này (<code>event.defaultPrevented</code>) nên nền trang tự động bị khoá cuộn khi có dialog đang mở, không cần code thêm gì.</p>
      <p>six-js tự gắn/gỡ 3 class theo trạng thái lên gốc scroller (<code>document.documentElement</code> nếu scroller là window): <code>six-smooth</code>, <code>six-smooth-scrolling</code>, <code>six-smooth-stopped</code> — tiện làm hook CSS (vd đổi con trỏ chuột khi đang cuộn).</p>
    `,
    init: (root) => {
      const scroller = root.querySelector<HTMLElement>("[data-smooth-demo]")!;
      smoothDemoInstance?.kill();
      smoothDemoInstance = six.smoothScroll({ scroller, lerp: 0.12 });
      root.querySelector<HTMLButtonElement>("[data-scroll-top]")!.addEventListener("click", () => smoothDemoInstance?.scrollTo("top"));
      root.querySelector<HTMLButtonElement>("[data-scroll-bottom]")!.addEventListener("click", () => smoothDemoInstance?.scrollTo("bottom"));
    },
  },

  "scope/context": {
    eyebrow: "Animatable",
    title: "six.context()",
    lead: "Scope dọn dẹp chung: mọi Tween/Timeline (hoặc bất kỳ thứ gì có .kill()) tạo ra bên trong sẽ tự được scope này capture, để dọn hàng loạt bằng một lần revert()/kill().",
    render: () => `
      ${codeBlock(
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

      ${attrsTable([
        ["context(fn?)", "tạo Context mới; nếu truyền fn, gọi run(fn) ngay lập tức", "—"],
        ["scope.run(fn)", "đặt scope này làm scope đang active trong lúc fn chạy — mọi animation tạo bên trong tự được capture", "—"],
        ["scope.scope(fn)", "bọc fn thành một hàm mới — mỗi lần hàm đó được GỌI (dù là sau này, từ event listener/timeout), animation tạo bên trong vẫn tự capture vào scope này", "—"],
        ["scope.add(target)", "tự thêm một Killable (bất kỳ thứ gì có .kill()) vào danh sách sẽ bị dọn khi revert", "—"],
        ["scope.revert()", "gọi kill() trên toàn bộ đối tượng đã capture rồi xoá danh sách — scope vẫn dùng lại được (run() tiếp)", "—"],
        ["scope.kill()", "revert() + đánh dấu scope đã chết — gọi run() sau đó sẽ throw", "—"],
        ["scope.isDead", "getter — true sau khi đã kill()", "—"],
      ])}

      <p class="note">Cần chạy lại theo breakpoint (bật/tắt animation theo <code>window.matchMedia</code>)? Dùng <a href="#scope/breakpoint">six.breakpoint()</a> thay vì tự lắng nghe <code>matchMedia(...).addEventListener("change", ...)</code> tay — breakpoint() được xây trên chính Context này nên vẫn auto-capture y hệt.</p>
    `,
  },

  "scope/breakpoint": {
    eyebrow: "Animatable",
    title: "six.breakpoint()",
    lead: "Gắn việc setup/teardown animation theo trạng thái CSS media query, tự chạy lại khi điều kiện đổi — khỏi phải tự lắng nghe window.matchMedia() rồi if/else + kill() tay.",
    render: () => `
      ${codeBlock(
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

      ${attrsTable([
        ["breakpoint()", "tạo instance rỗng, add() sau", "—"],
        ["breakpoint(conditions, callback)", "sugar cho breakpoint().add(conditions, callback)", "—"],
        [".add(conditions, callback)", "conditions: 1 chuỗi query, hoặc object map { tên: query }. callback(ctx) chạy khi match, có thể return cleanup", "—"],
        ["ctx.matches", "object map { tên: boolean } — chỉ có ý nghĩa khi conditions là object map (nhiều query cùng lúc)", "—"],
        [".revert()", "dọn phần đang active của MỌI add() (kill animation đã capture, chạy cleanup) — vẫn tiếp tục lắng nghe media query", "—"],
        [".kill()", "revert() + gỡ hẳn mọi MediaQueryList listener — instance chết hẳn, add() sau sẽ throw", "—"],
      ])}

      <p class="note">Mỗi <code>.add()</code> có một <code>Context</code> riêng (soft revert khi điều kiện đổi, không detach listener) — vì vậy tạo instance breakpoint bên trong một <code>six.context()</code> đang active thì cả cụm cũng tự bị scope ngoài capture, dọn một lượt khi scope ngoài <code>revert()</code>/<code>kill()</code>.</p>
      <p>Chỉ cần MỘT breakpoint đơn (bật trên ngưỡng, tắt dưới ngưỡng)? Dùng thẳng dạng sugar <code>six.breakpoint(query, callback)</code> khỏi cần gọi <code>.add()</code> tách rời.</p>
    `,
  },

  "utils/set": {
    eyebrow: "Animatable",
    title: "six.set()",
    lead: "Áp giá trị ngay lập tức, không có animation (tween với duration 0) — dùng để đặt trạng thái khởi tạo.",
    render: () => `
      ${playgroundBox("set()")}
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy six.set()</button>
      </div>

      ${codeBlock(`six.set(".box", { rotate: 45, backgroundColor: "#ff6b4a" });`, "js")}
    `,
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
    eyebrow: "Animatable",
    title: "six.config()",
    lead: "Đặt duration/ease mặc định toàn cục cho mọi to/from/fromTo/timeline gọi sau đó, khỏi phải lặp lại ở từng lời gọi.",
    render: () => `
      ${codeBlock(
        `six.config({
  duration: 0.5,
  ease: "quadOut",
});

// từ đây trở đi, không truyền duration/ease vẫn dùng giá trị trên
six.to(".box", { x: 100 });`,
        "js",
      )}
      <p class="note">Mặc định</code> <code>duration: 0.8</code>, <code>ease: "none"</code> (none alias linear).</p>
      
    `,
  },

  "utils/helpers": {
    eyebrow: "Animatable",
    title: "six.utils",
    lead: "Namespace gộp các hàm tiện ích dùng chung: chuẩn hoá target, chọn phần tử theo id/class, giới hạn số, lấy giá trị ngẫu nhiên.",
    render: () => `
      ${codeBlock(
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

      ${attrsTable([
        ["arrayOf(target, scope?)", "chuẩn hoá mọi kiểu target six-js chấp nhận (selector, Element, NodeList, mảng...) thành Element[] — chính logic six-js dùng nội bộ cho to/from/fromTo", "—"],
        ["getById(id)", "document.getElementById — id thuần, không có dấu #", "—"],
        ["getByClass(className, scope?)", "document.getElementsByClassName — class thuần, không có dấu . ; scope mặc định là document", "—"],
        ["clamp(min, max, value?)", "giới hạn value trong [min, max]; bỏ value sẽ trả về hàm curry (value) => number", "—"],
        ["random(min, max, snap?, asFn?)", "số ngẫu nhiên trong [min, max], snap làm tròn theo bước, asFn=true trả về hàm sinh số thay vì 1 giá trị", "—"],
        ["random(array)", "trả về 1 phần tử ngẫu nhiên trong mảng", "—"],
      ])}
    `,
  },

  "utils/enableElements": {
    eyebrow: "Animatable",
    title: "enableElements()",
    lead: "Đăng ký toàn bộ web components (sx-dialog, sx-slider, sx-marquee, sx-animate, ...) — gọi một lần, an toàn khi gọi lại nhiều lần.",
    render: () => `
      ${codeBlock(
        `import { six, enableElements } from "@six-js/core";
import "@six-js/core/style.css";

enableElements();`,
        "js",
      )}
      <p class="note">Trước đây là <code>six.initElements()</code> — nay là <code>enableElements()</code>, một hàm export riêng (không còn nằm trên <code>six</code>).</p>
      <p>Chỉ gọi <code>enableElements()</code> nếu trang có dùng web components. Nếu chỉ dùng API JS thuần (to/from/timeline/...), có thể bỏ qua bước này.</p>
    `,
  },
};

export { animatableContent };
