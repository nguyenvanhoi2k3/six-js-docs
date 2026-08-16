import { Burst } from "@six-js/core/Burst";
import { Watcher } from "@six-js/core/Watcher";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

// Rich, full-page standalone demos (own dark styling, multi-section) — reused as-is from the
// old showcase-demos assets rather than ported into the docs' light-themed demo.html, so "Xem
// demo ↗" opens them directly instead of routing through the ComponentDemo tab system.
const SPLIT_TEXT_DEMO_URL = "plugin-demos/split-text.html";
const SMOOTH_SCROLL_DEMO_URL = "plugin-demos/smooth-scroll.html";
const SCRAMBLE_TEXT_DEMO_URL = "plugin-demos/scramble-text.html";
const SVG_MOTION_DEMO_URL = "plugin-demos/svg-motion.html";
const PARALLAX_DEMO_URL = "plugin-demos/parallax.html";

const pluginsContent: ContentMap = {
  "split-text/overview": {
    eyebrow: "Plugins",
    title: "SplitText",
    lead: "Tách text của một element thành mảng chars/words/lines để animate từng phần.",
    render: () => (
      <>
        {codeBlock(
          `import { six } from "@six-js/core";
import { SplitText } from "@six-js/core/SplitText";

const split = new SplitText(".title", { type: "chars,words" });

six.from(split.chars, {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: 0.02,
});`,
          "js",
        )}
        <p>
          Trả về instance <span class="c-accent">SplitText</span> với các mảng <span class="c-accent">chars</span> / <span class="c-accent">words</span> / <span class="c-accent">lines</span> (HTMLElement[])
          — tuỳ theo <span class="c-accent">type</span> khai báo — dùng trực tiếp làm target cho <span class="c-accent">six.to/from/fromTo</span>.
        </p>
        <p class="note">
          Split lại nhiều lần trên cùng một element luôn an toàn: mỗi element chỉ thuộc về một <span class="c-accent">SplitText</span> tại một thời điểm — split lần sau tự <span class="c-accent">kill()</span>{" "}
          instance cũ trên đúng element đó (khôi phục HTML gốc) trước khi tách lại, không bao giờ bị wrap chồng lặp.
        </p>
      </>
    ),
    demoUrl: SPLIT_TEXT_DEMO_URL,
  },

  "split-text/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "SplitTextVars — object thứ 2 truyền vào new SplitText(target, vars).",
    render: () => (
      <>
        {codeBlock(
          `new SplitText(".title", {
  type: "chars,words,lines",
  tag: "div",
  charsClass: "char",
  wordsClass: "word",
  linesClass: "line",
  overflow: "lines",
  aria: "auto",
  propIndex: true,
  smartWrap: true,
  skip: ".title b, .title sx-icon",
  onSplit: (self) => {
    six.from(self.lines, { opacity: 0, y: "100%", stagger: 0.08 });
  },
});`,
          "js",
        )}

        {attrsTable([
          ["type", 'chuỗi kết hợp bởi dấu phẩy (hoặc mảng): "chars,words,lines"', '"chars,words,lines"'],
          ["tag", "tên thẻ HTML dùng để wrap mỗi char/word/line", '"div"'],
          ["charsClass / wordsClass / linesClass", "class gán cho mỗi span/div sinh ra — mỗi phần tử còn tự có thêm class đánh số (vd char1, char2, ...)", "—"],
          ["overflow", '"chars" | "words" | "lines" | true — bọc cấp độ đó (true = tự chọn cấp sâu nhất đang split) trong box overflow:clip để làm hiệu ứng reveal kiểu "kéo rèm"', "—"],
          ["aria", '"auto" tự set aria-label trên root + aria-hidden trên span con; "hidden" chỉ set aria-hidden; "none" bỏ qua toàn bộ', '"auto"'],
          ["skip", "selector/Element(s) cần GIỮ NGUYÊN (không tách chars/words bên trong, vd icon/thẻ &lt;b&gt; chèn giữa câu) nhưng vẫn nằm đúng vị trí trong dòng chữ đã split", "—"],
          ["wordDelimiter", 'ký tự/regex phân tách "từ" — mặc định dấu cách; đổi (vd chuỗi rỗng) để split ngôn ngữ không dùng dấu cách như tiếng Nhật/Trung', '" " (dấu cách)'],
          ["reduceWhiteSpace", "gộp khoảng trắng liên tiếp thành 1 trước khi split", "true"],
          ["specialChars", 'mảng chuỗi hoặc regex — nhóm các chuỗi ký tự đặc biệt (emoji ghép, dấu kết hợp...) thành đúng 1 "char" thay vì bị tách vụn', "—"],
          ["smartWrap", "chống từ cuối cùng của khối text bị ngắt dòng côi cút (orphan) khi không split words riêng", "false"],
          ["propIndex", "gắn thêm CSS custom property --char / --word / --line (số thứ tự, bắt đầu từ 1) lên mỗi span — stagger thuần bằng CSS mà không cần JS", "false"],
          ["prepareText(text, element)", "hook biến đổi text thô trước khi tách (vd bỏ ký tự đặc biệt tự thêm)", "—"],
          ["onSplit(self) / onRevert(self)", "callback chạy sau mỗi lần (re-)split / sau khi revert", "—"],
        ])}

        <p>
          Nếu chỉ cần <span class="c-accent">lines</span> mà không cần giữ lại <span class="c-accent">words</span> wrapper, chỉ khai <span class="c-accent">type: "lines"</span> — SplitText tự unwrap words
          sau khi đã dùng chúng để đo dòng.
        </p>
      </>
    ),
    demoUrl: SPLIT_TEXT_DEMO_URL,
  },

  "split-text/overflow": {
    eyebrow: "Plugins",
    title: "overflow (mask)",
    lead: 'Bọc chars/words/lines trong một box overflow:clip — dùng để làm hiệu ứng reveal kiểu "kéo rèm" mà không đổi nội dung split.chars/words/lines trỏ tới.',
    render: () => (
      <>
        {codeBlock(
          `const split = new SplitText(".headline", {
  type: "lines",
  overflow: "lines",
});

six.from(split.lines, {
  y: "100%",
  duration: 0.6,
  ease: "cubicOut",
  stagger: 0.08,
});

// self.masks — mảng các phần tử wrapper vừa tạo (class gốc + hậu tố "-mask", vd "line" -> "line-mask")
console.log(split.masks);`,
          "js",
        )}

        <p class="note">
          <code>overflow: "lines"</code> yêu cầu <code>type</code> có bao gồm <code>"lines"</code> (tương tự cho <code>"chars"</code>/<code>"words"</code>) — nếu không, phần tử tương ứng rỗng nên không có gì để
          bọc. Truyền <code>overflow: true</code> để SplitText tự chọn cấp sâu nhất đang split (ưu tiên lines &gt; words &gt; chars).
        </p>
      </>
    ),
    demoUrl: SPLIT_TEXT_DEMO_URL,
  },

  "split-text/lifecycle": {
    eyebrow: "Plugins",
    title: "split() / revert() / kill()",
    lead: "SplitText là một instance sống — quản lý vòng đời để tránh leak tween/ResizeObserver khi component unmount hoặc re-render.",
    render: () => (
      <>
        {codeBlock(
          `const split = new SplitText(".title", { type: "chars" });

// split lại với vars mới (merge vào vars cũ)
split.split({ type: "chars,words" });

// khôi phục innerHTML gốc, gỡ ResizeObserver/font listener, chạy onRevert
split.revert();

// alias của revert() — cùng interface Killable như Tween/Timeline/Context
split.kill();`,
          "js",
        )}

        {attrsTable([
          [".chars / .words / .lines / .masks", "HTMLElement[] — cập nhật lại sau mỗi lần split()", "—"],
          [".isSplit", "boolean — đang ở trạng thái đã split hay chưa", "—"],
          [".split(vars?)", "merge vars mới rồi split lại (tự revert() trạng thái split cũ trước), trả về chính instance (this)", "—"],
          [".revert() / .kill()", "khôi phục HTML gốc, gỡ toàn bộ side-effect (auto re-split, tween từ onSplit)", "—"],
        ])}

        <p>
          Khi <code>type</code> có <code>"lines"</code>, SplitText TỰ ĐỘNG split lại khi kích thước phần tử đổi (resize) hoặc khi <code>document.fonts</code> load xong — không cần bật cờ nào, luôn bật sẵn để
          số dòng luôn đúng với font/kích thước thật.
        </p>
        <p class="note">
          Vì <span class="c-accent">SplitText</span> implement <span class="c-accent">Killable</span>, tạo instance bên trong <span class="c-accent">six.context()</span> (hoặc bên trong handler của{" "}
          <span class="c-accent">six.breakpoint()</span>) sẽ tự <span class="c-accent">revert()</span> khi scope đó bị <span class="c-accent">revert()</span>/<span class="c-accent">kill()</span> — giống hệt
          cách một <span class="c-accent">Tween</span> tự kill trong scope đó.
        </p>
      </>
    ),
    demoUrl: SPLIT_TEXT_DEMO_URL,
  },

  "smooth-scroll/overview": {
    eyebrow: "Plugins",
    title: "SmoothScroll",
    lead: "Cuộn mượt (inertia/damping khi lăn chuột)",
    render: () => (
      <>
        {codeBlock(
          `import { SmoothScroll } from "@six-js/core/SmoothScroll";

const smooth = new SmoothScroll({
  container: "#my-scroll-container", // mặc định window
  lerp: 0.1,                         // độ "trễ" khi cuộn bằng wheel — bỏ qua nếu dùng duration
});

smooth.scrollTo("#section-2", { offset: -20 });
smooth.scrollTo("bottom");
smooth.stop();   // đóng băng cuộn (vd khi mở modal) — chặn cả wheel lẫn touch-drag
smooth.start();
smooth.kill();`,
          "js",
        )}

        <p>
          Xem toàn bộ vars khởi tạo tại trang <a href="#smooth-scroll/options">Options</a>, và toàn bộ method/property của instance trả về tại trang <a href="#smooth-scroll/instance">Instance</a>.
        </p>
        <p class="note">Chạm (touch) được để nguyên native, không làm mượt lại bằng JS — vì momentum-scroll thật của hệ điều hành thường đã mượt sẵn.</p>
      </>
    ),
    demoUrl: SMOOTH_SCROLL_DEMO_URL,
  },

  "smooth-scroll/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "SmoothScrollVars — object truyền vào new SmoothScroll(vars).",
    render: () => (
      <>
        {attrsTable([
          ["container", "Element | selector — container cuộn (giống OnScrollVars.container)", "window"],
          ["axis", '"y" | "x"', '"y"'],
          ["lerp", "cường độ giảm chấn 0–1 khi cuộn bằng wheel (đã tinh chỉnh sẵn cho 60fps) — bỏ qua nếu đã set duration", "0.1"],
          ["duration", "giây — chuyển sang chế độ tween thời lượng cố định (thay vì giảm chấn liên tục) cho input wheel", "—"],
          ["ease", 'easing (như TweenVars.ease, xem trang <a href="ease.html#core">Ease</a>) — chỉ dùng khi có duration', '"expoOut"'],
          ["wheelMultiplier", "hệ số nhân thêm vào delta wheel", "1"],
          ["onScroll / onStart / onStop", "callback(self) mỗi lần cuộn / bắt đầu / dừng chuyển động", "—"],
        ])}

        <p class="note">
          <code>lerp</code> và <code>duration</code> loại trừ nhau — khai <code>duration</code> chuyển hẳn sang chế độ tween thời lượng cố định, <code>lerp</code> bị bỏ qua.
        </p>
      </>
    ),
    demoUrl: SMOOTH_SCROLL_DEMO_URL,
  },

  "smooth-scroll/instance": {
    eyebrow: "Plugins",
    title: "Instance",
    lead: "Instance trả về từ new SmoothScroll(vars) — điều khiển và đọc trạng thái cuộn.",
    render: () => (
      <>
        {attrsTable([
          [".scrollTo(target, opts?)", 'target: số | "top"/"bottom"/"start"/"end" | selector | Element. opts: { offset, immediate, lock, force, lerp, duration, ease, onStart, onComplete }', "—"],
          [".stop() / .start()", "đóng băng / mở lại cuộn — chặn cả wheel và kéo chạm (không chặn được việc kéo thanh scrollbar gốc)", "—"],
          ['.on/.off("scroll"|"start"|"stop", cb)', "lắng nghe sự kiện", "—"],
          [".scroll / .progress", "vị trí hiện tại (px) / tỉ lệ 0–1 theo giới hạn cuộn", "—"],
          [".velocity / .direction", "px/giây thực tế, và hướng hiện tại (1 | -1 | 0)", "—"],
          [".isScrolling / .isStopped", "đang trong quá trình easing tới đích? / đã .stop() chưa?", "—"],
          [".kill()", "gỡ toàn bộ listener/ResizeObserver, dừng ticker", "—"],
        ])}

        <p class="note">
          Mỗi lần ghi vị trí, six-js tự bắn kèm một sự kiện <code>"scroll"</code> đồng bộ (cùng frame) lên chính container — nhờ vậy <code>OnScroll</code> luôn cập nhật đúng khung hình, không bị trễ 1 frame
          chờ sự kiện scroll thật (bất đồng bộ) của trình duyệt.
        </p>
        <p class="note">
          Tương tác với <code>sx-dialog</code>: dialog khoá wheel/touch ở capture phase bằng <code>preventDefault()</code> — <code>SmoothScroll</code> tự đọc đúng cờ này (<code>event.defaultPrevented</code>)
          nên nền trang tự động bị khoá cuộn khi có dialog đang mở, không cần code thêm gì.
        </p>
        <p>
          six-js tự gắn/gỡ 3 class theo trạng thái lên gốc container (<code>document.documentElement</code> nếu container là window): <code>six-smooth</code>, <code>six-smooth-scrolling</code>,{" "}
          <code>six-smooth-stopped</code> — tiện làm hook CSS (vd đổi con trỏ chuột khi đang cuộn).
        </p>
      </>
    ),
    demoUrl: SMOOTH_SCROLL_DEMO_URL,
  },

  "scramble-text/overview": {
    eyebrow: "Plugins",
    title: "ScrambleText",
    lead: 'Xáo chữ ngẫu nhiên rồi "chốt" dần về text đích',
    render: () => (
      <>
        {codeBlock(
          `import { ScrambleText } from "@six-js/core/ScrambleText";

ScrambleText(".headline", {
  text: "ĐÃ GIẢI MÃ XONG",
  duration: 1.2,
  chars: "upperCase",
});`,
          "js",
        )}

        <p>
          Trả về <span class="c-accent">ScrambleTextAnimation</span> (hoặc <span class="c-accent">Timeline</span> nếu target khớp nhiều phần tử) — một <span class="c-accent">Animation</span> thật sự, tự{" "}
          <code>.play()</code> ngay khi tạo (trừ khi truyền <code>paused: true</code>), dùng chung API vòng đời với Tween/Timeline (play/pause/reverse/restart/kill...).
        </p>
        <p class="note">Bỏ qua <code>text</code> (hoặc truyền đúng chuỗi hiện tại) để chỉ chạy hiệu ứng "quét qua rồi giữ nguyên" trên text đã đúng sẵn, không đổi nội dung.</p>
      </>
    ),
    demoUrl: SCRAMBLE_TEXT_DEMO_URL,
  },

  "scramble-text/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "ScrambleTextVars — object thứ 2 truyền vào ScrambleText(target, vars).",
    render: () => (
      <>
        {codeBlock(
          `ScrambleText(".price", {
  text: "1.280.000đ",
  duration: 0.8,
  chars: "numeric",
  speed: 1.4,
  revealDelay: 0.1,
  oldClass: "is-scrambling",
  newClass: "is-revealed",
});`,
          "js",
        )}

        {attrsTable([
          ["mode", '"scramble" (mặc định, xáo tại chỗ) | "odometer" (mỗi ký tự tự "quay số" — xem trang mode: "odometer")', '"scramble"'],
          ["text", 'text đích cần hiện ra — bỏ qua (hoặc "{original}") dùng lại chính text hiện tại của target', "—"],
          ["duration / ease", 'thời lượng &amp; easing tổng (xem trang <a href="ease.html#core">Ease</a>)', "0.8s (six.config()) / none"],
          ["chars", '"upperCase" | "lowerCase" | "upperAndLowerCase" | "numeric" | chuỗi ký tự tuỳ ý — nguồn ký tự xáo/filler', '"upperCase"'],
          ["stagger", "trễ thêm mỗi phần tử khi target khớp nhiều element", "—"],
          ["rightToLeft", "reveal từ phải sang trái thay vì trái sang phải (mặc định)", "false"],
          ["speed", "hệ số tốc độ xáo lại filler chưa reveal", "1"],
          ["revealDelay", "giây xáo thuần trước khi bắt đầu reveal", "0"],
          ["tweenLength", "nội suy độ dài hiển thị từ text cũ sang text mới thay vì nhảy thẳng độ dài mới", "true"],
          ["oldClass / newClass", "class bọc phần chưa reveal / đã reveal (bỏ qua trên input/textarea vì value không chứa markup được)", "—"],
          ["delimiter", '"" reveal theo từng ký tự (mặc định) | " " reveal theo từng từ', '""'],
        ])}

        <p class="note">Resolving nhiều phần tử (target khớp &gt; 1 element) build một animation riêng cho mỗi phần tử rồi gộp vào một <code>Timeline</code> — pause/reverse/kill cả nhóm như một khối.</p>
      </>
    ),
    demoUrl: SCRAMBLE_TEXT_DEMO_URL,
  },

  "scramble-text/odometer": {
    eyebrow: "Plugins",
    title: 'mode: "odometer"',
    lead: "Mỗi ký tự tự quay trên một cuộn số dọc rồi dừng đúng ký tự đích — kiểu bộ đếm cơ khí (odometer), khác với xáo tại chỗ của mode mặc định.",
    render: () => (
      <>
        {codeBlock(
          `import { ScrambleText } from "@six-js/core/ScrambleText";

ScrambleText(".counter", {
  mode: "odometer",
  text: "128204",
  chars: "numeric",
  duration: 1.4,
  reelSize: 12,       // số ký tự ngẫu nhiên "lướt qua" trước khi dừng đúng
  charStagger: 0.04,  // tạo hiệu ứng sóng dừng lần lượt trái -> phải
});`,
          "js",
        )}

        {attrsTable([
          ["reelSize", "số ký tự ngẫu nhiên lướt qua trước khi dừng đúng ký tự đích", "10"],
          ["charStagger", "trễ thêm mỗi vị trí ký tự (giây) — tạo sóng dừng lần lượt thay vì cả cụm dừng cùng lúc", "0.03"],
          ["rightToLeft", "đảo chiều sóng dừng (phải sang trái)", "false"],
          ["chars / text / duration / ease", "giống mode mặc định", "—"],
        ])}
      </>
    ),
    demoUrl: SCRAMBLE_TEXT_DEMO_URL,
  },

  "burst/overview": {
    eyebrow: "Plugins",
    title: "Burst",
    lead: "Giúp tạo hiệu ứng vật lý phóng elements lên trên rồi rơi tự do (vận tốc phóng + trọng lực)",
    render: () => (
      <>
        {codeBlock(
          `import { Burst } from "@six-js/core/Burst";

likeButton.addEventListener("click", (e) => {
  Burst(e.currentTarget, {
    targets: "#heart-icon", // template bị clone ra
    clone: 24,
    spread: [-40, 40],      // bắn theo hướng từ -40deg -> 40deg
    power: [220, 420],
    gravity: 700,
  });
});`,
          "js",
        )}

        <p>
          <span class="c-accent">Burst(origin, vars)</span> có 2 chế độ qua <code>targets</code>/<code>clone</code>: mặc định (không có <code>clone</code>) phóng thẳng CHÍNH các phần tử <code>targets</code>{" "}
          đang có trên trang (vd chữ đã <code>SplitText</code> rơi vỡ ra); truyền <code>clone: N</code> để nhân bản <code>targets</code> làm N hạt dùng-một-lần, phóng ra từ vị trí <code>origin</code> — dùng cho
          hiệu ứng confetti/"like nổ tim" kinh điển.
        </p>
      </>
    ),
    demos: [
      {
        html: `<div class="content-pane__panel" style="align-items:center;justify-content:center;min-height:140px;">
  <button class="btn btn--primary" data-burst-btn>🎉 Bấm để burst</button>
  <span data-burst-icon style="display:none;">❤️</span>
</div>`,
        js: `import { Burst } from "@six-js/core/Burst";

likeButton.addEventListener("click", () => {
  Burst(likeButton, {
    targets: heartIcon,
    clone: 24,
    spread: [-40, 40],
    power: [220, 420],
    gravity: 700,
  });
});`,
        initDemo: (root) => {
          const btn = root.querySelector<HTMLButtonElement>("[data-burst-btn]")!;
          const icon = root.querySelector<HTMLElement>("[data-burst-icon]")!;

          btn.addEventListener("click", () => {
            Burst(btn, {
              targets: icon,
              clone: 24,
              spread: [-40, 40],
              power: [220, 420],
              gravity: 700,
            });
          });
        },
      },
    ],
  },

  "burst/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "BurstVars — object thứ 2 truyền vào Burst(origin, vars).",
    render: () => (
      <>
        {attrsTable([
          ["targets", "selector/Element/danh sách — phần tử bị burst. Không có clone: chính các phần tử này bị phóng trực tiếp. Có clone: dùng làm template để nhân bản", "—"],
          ["clone", "số bản sao dùng-một-lần cần tạo, phóng ra từ vị trí origin — bỏ qua (mặc định) để phóng thẳng targets", "—"],
          ["container", "nơi chèn các clone — document.body cho clone position:fixed (bám viewport); container khác cho clone position:absolute (giới hạn trong container đó)", "document.body"],
          ["spread", "[min, max] góc phóng (độ) — 0 = hướng lên, tăng dần theo chiều kim đồng hồ. Truyền 1 số thay vì mảng để mọi hạt bắn cùng 1 góc, không toả ra", "[0, 360]"],
          ["power", "[min, max] tốc độ phóng (px/giây), hoặc 1 số cố định. power: 0 nghĩa là không bắn — chỉ rơi tự do theo gravity", "[160, 380]"],
          ["gravity", "gia tốc rơi xuống (px/giây²)", "650"],
          ["scale", "[min, max] tỉ lệ kích thước, hoặc 1 số cố định — chỉ áp dụng cho hạt CLONE", "[0.5, 1.1]"],
          ["rotationSpeed", "[min, max] tốc độ xoay (độ/giây, có dấu — chiều xoay cũng ngẫu nhiên), hoặc 1 số cố định để mọi hạt xoay cùng tốc độ", "[-360, 360]"],
          ["fade", "true — fade opacity về 0 ngay khi hạt thật sự rơi khuất khỏi viewport (không phải theo hẹn giờ)", "true"],
          ["stagger", "trễ phóng thêm giữa mỗi hạt (giây)", "0"],
          ["onComplete", "callback khi mọi hạt đã xong (rơi khuất + fade xong, hoặc tắt fade thì ngay khi khuất)", "—"],
        ])}

        <p>
          Trả về <span class="c-accent">BurstController</span> — chỉ một method <code>.kill()</code> để dừng ngay lập tức (xoá hạt clone khỏi DOM; hạt trực tiếp giữ nguyên vị trí cuối cùng đã render).
        </p>
      </>
    ),
  },

  "svg-motion/draw": {
    eyebrow: "Plugins",
    title: 'mode: "draw"',
    lead: 'Animate stroke-dasharray/stroke-dashoffset để "vẽ" dần một nét SVG (hoặc ẩn dần) — hiệu ứng vẽ chữ ký, vẽ nét minh hoạ kinh điển.',
    render: () => (
      <>
        {codeBlock(
          `import { SvgMotion } from "@six-js/core/SvgMotion";

SvgMotion(".signature", {
  mode: "draw",
  duration: 1.4,
  ease: "cubicOut",
  // from mặc định "0%", to mặc định "100%" — vẽ trọn nét
});`,
          "js",
        )}

        {attrsTable([
          ["from", 'điểm bắt đầu của đoạn hiện ra — ratio ("0%"/0..1) hoặc cặp [start, end] rõ ràng', '"0%"'],
          ["to", '1 giá trị nghĩa là [0, value] (vẽ trọn từ đầu); chuỗi 2 token ("20% 80%") hoặc cặp [start, end] di chuyển độc lập 2 đầu — hiệu ứng đoạn "sao chổi" trượt dọc nét', '"100%"'],
          ["duration / ease", 'thời lượng &amp; easing (xem trang <a href="ease.html#core">Ease</a>)', "0.8s (six.config()) / none"],
          ["stagger", "trễ thêm mỗi shape khi target khớp nhiều phần tử (vd cả một chữ gồm nhiều &lt;path&gt;)", "—"],
        ])}

        <p class="note">
          Giá trị <code>from</code>/<code>to</code> không bị giới hạn 0–100% — kết hợp <code>repeat: -1</code> với một vòng lệch đúng 1 lap (vd <code>from: "0% 15%"</code> → <code>to: "100% 115%"</code>) tạo
          hiệu ứng "đuổi nhau" lặp vô hạn, không giật ở mỗi vòng lặp.
        </p>
      </>
    ),
    demoUrl: SVG_MOTION_DEMO_URL,
  },

  "svg-motion/morph": {
    eyebrow: "Plugins",
    title: 'mode: "morph"',
    lead: "Animate thuộc tính d của target sang hình dạng của một shape khác, bằng cách lấy mẫu điểm trên cả 2 rồi nội suy vị trí từng cặp điểm.",
    render: () => (
      <>
        {codeBlock(
          `import { SvgMotion } from "@six-js/core/SvgMotion";

SvgMotion(".blob", {
  mode: "morph",
  toShape: "#star-shape",
  duration: 0.8,
  ease: "quadInOut",
});`,
          "js",
        )}

        {attrsTable([
          ["toShape", 'shape đích — Element, selector, hoặc chuỗi d thô (dựng thành một &lt;path&gt; tách rời, không cần gắn vào DOM/hiển thị). Chỉ dùng cho mode: "morph"', "—"],
          ["duration / ease", 'thời lượng &amp; easing (xem trang <a href="ease.html#core">Ease</a>)', "0.8s (six.config()) / none"],
          ["precision", "số điểm lấy mẫu để xấp xỉ 2 shape — cao hơn mượt/sát hình hơn, tốn thêm một lần tính lúc khởi tạo (không tốn mỗi frame)", "120"],
        ])}

        <p class="note">
          Tự chọn hướng lấy mẫu (xoay/thứ tự điểm) của shape đích sao cho khớp tốt nhất với shape nguồn trước khi nội suy — tránh hiện tượng hình bị "xoắn" khi 2 shape lấy mẫu từ 2 điểm bắt đầu vật lý khác
          nhau trên path.
        </p>
      </>
    ),
    demoUrl: SVG_MOTION_DEMO_URL,
  },

  "svg-motion/motion-path": {
    eyebrow: "Plugins",
    title: 'mode: "path"',
    lead: "Di chuyển target dọc theo một path SVG dẫn đường (vd máy bay lượn theo đường sóng) — áp dụng như một độ lệch (delta) từ điểm đầu path, không nhảy sang toạ độ tuyệt đối của path.",
    render: () => (
      <>
        {codeBlock(
          `import { SvgMotion } from "@six-js/core/SvgMotion";

SvgMotion(".plane", {
  mode: "path",
  path: "#flight-path",
  duration: 2,
  ease: "quadInOut",
  autoRotate: 90, // cộng thêm 90deg — bù cho hướng vẽ mặc định của icon máy bay
});`,
          "js",
        )}

        {attrsTable([
          ["path", 'guide curve — SVGGeometryElement, selector trỏ tới nó, hoặc chuỗi d thô (dựng thành path tách rời, không cần hiển thị). Chỉ dùng cho mode: "path"', "—"],
          ["autoRotate", "true dùng thẳng góc tiếp tuyến của path; số cộng thêm độ lệch cố định (bù hướng vẽ gốc của artwork target)", "false"],
          ["from / to", "tiến độ bắt đầu / kết thúc dọc path, 0–1", "0 / 1"],
          ["duration / ease", 'thời lượng &amp; easing (xem trang <a href="ease.html#core">Ease</a>)', "0.8s (six.config()) / none"],
          ["stagger", "trễ thêm mỗi phần tử khi target khớp nhiều element", "—"],
        ])}

        <p class="note">
          Ghi thẳng vào cùng transform cache dùng chung mà mọi tween x/y/rotate bình thường đang dùng — chạy song song mượt với một tween transform khác trên cùng phần tử, không tween nào bị đè lên nhau.
        </p>
      </>
    ),
    demoUrl: SVG_MOTION_DEMO_URL,
  },

  "parallax/overview": {
    eyebrow: "Plugins",
    title: "Parallax",
    lead: "Các phần tử lệch theo con trỏ chuột với độ 'sâu' (depth) khác nhau — mỗi phần tử một tốc độ trôi riêng, tạo cảm giác lớp trước/lớp sau.",
    render: () => (
      <>
        {codeBlock(
          `import { Parallax } from "@six-js/core/Parallax";

// strength: px lệch tối đa (con trỏ ở mép viewport) — mỗi phần tử có thể tự
// override qua thuộc tính sx-parallax-strength (âm = lệch NGƯỢC hướng con trỏ)
Parallax(".layer", { strength: 30, lerp: 0.1 });`,
          "js",
        )}

        <p>
          <span class="c-accent">Parallax(target, vars)</span> lắng nghe <code>mousemove</code> trên toàn <code>window</code> (một listener duy nhất dùng chung dù gọi bao nhiêu lần), rồi mỗi frame lệch{" "}
          <code>x</code>/<code>y</code> từng phần tử theo vị trí con trỏ chuẩn hoá — cộng thêm vào transform hiện có, không ghi đè.
        </p>
        <p class="note">Di chuyển chuột ở bất kỳ đâu trên trang, không chỉ trong khung demo — Parallax không giới hạn theo container.</p>
      </>
    ),
    demoUrl: PARALLAX_DEMO_URL,
  },

  "parallax/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "ParallaxVars — object thứ 2 truyền vào Parallax(target, vars), cộng thêm thuộc tính sx-parallax-strength trên từng phần tử con.",
    render: () => (
      <>
        {codeBlock(
          `<div class="layer" sx-parallax-strength="-15"></div> <!-- nền, lệch NGƯỢC hướng con trỏ -->
<div class="layer" sx-parallax-strength="60"></div>  <!-- tiền cảnh, lệch mạnh -->`,
          "html",
        )}

        {attrsTable([
          ["strength", "px lệch tối đa (khi con trỏ ở mép viewport) — CHỈ áp dụng cho phần tử không có sx-parallax-strength riêng; giá trị âm đảo ngược hướng lệch", "30"],
          ["lerp", "cường độ giảm chấn 0–1 cho chuyển động đuổi theo có độ trễ — cùng field/ý nghĩa với SmoothScrollVars.lerp; 0/bỏ qua = bám thẳng theo con trỏ, không trễ", "0.1"],
        ])}

        {attrsTable([
          ["sx-parallax-strength", "attribute trên từng phần tử — override strength mặc định riêng cho phần tử đó (px, có thể âm)", "—"],
          [".kill()", "gỡ listener mousemove, trả mọi phần tử về đúng x/y gốc trước khi có parallax (không giữ nguyên độ lệch cuối cùng)", "—"],
        ])}

        <p class="note">
          Ghi vào cùng transform cache dùng chung với mọi tween x/y/rotate, nhưng KHÔNG đi qua hệ thống overwrite của Tween — một <code>six.to(el, {"{"} x: ... {"}"})</code> chạy song song trên đúng phần
          tử đang bị <span class="c-accent">Parallax</span> quản lý sẽ "đánh nhau" mỗi frame với nó. Không dùng đồng thời trên cùng target.
        </p>
        <p class="note">v1 chỉ hỗ trợ mousemove trên toàn window — chưa có chế độ scoped theo container/hover, chưa hỗ trợ touch/device-orientation.</p>
      </>
    ),
    demoUrl: PARALLAX_DEMO_URL,
  },

  "watcher/overview": {
    eyebrow: "Plugins",
    title: "Watcher",
    lead: "Theo dõi hướng, delta và tốc độ của thao tác lăn chuột (wheel) và cuộn trang (scroll) — dùng làm input để lái animation khác, vd đổi hướng/tốc độ marquee theo tốc độ cuộn.",
    render: () => (
      <>
        <div class="content-pane__panel">
          <div data-watcher-demo style="height:220px;width:100%;overflow-y:auto;border:1px solid var(--border);border-radius:8px;position:relative;">
            <div style="height:640px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;text-align:center;padding:0 16px;">
              Cuộn hoặc lăn chuột bên trong khung này ⬇
            </div>
          </div>
          <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:12px;font-size:13px;color:var(--muted);">
            <span>
              Hướng: <strong data-watcher-direction style="color:var(--accent)">—</strong>
            </span>
            <span>
              deltaY: <strong data-watcher-deltay style="color:var(--accent)">0</strong>
            </span>
            <span>
              velocityY: <strong data-watcher-velocityy style="color:var(--accent)">0</strong> px/s
            </span>
          </div>
        </div>

        {codeBlock(
          `import { Watcher } from "@six-js/core/Watcher";

Watcher({
  target: scrollContainer, // mặc định window
  onDown: (self) => console.log("cuộn xuống", self.velocityY),
  onUp: (self) => console.log("cuộn lên", self.velocityY),
  onStop: () => console.log("đã dừng cuộn"),
});`,
          "js",
        )}

        <p>
          <span class="c-accent">Watcher(vars)</span> lắng nghe cả <code>wheel</code> lẫn <code>scroll</code> trên cùng một <code>target</code> (mặc định <code>window</code>), gộp lại thành một luồng
          delta/velocity/hướng duy nhất — không cần tự phân biệt 2 nguồn sự kiện này.
        </p>
        <p class="note">
          Tự <code>enable()</code> ngay khi tạo (giống <code>Parallax</code>/<code>Burst</code>) — gọi <code>.disable()</code>/<code>.kill()</code> để tạm dừng. Trả về{" "}
          <span class="c-accent">WatcherController</span>; xem toàn bộ callback và property tại trang <a href="#watcher/options">Options</a>.
        </p>
      </>
    ),
    init: (root) => {
      const container = root.querySelector<HTMLElement>("[data-watcher-demo]")!;
      const directionEl = root.querySelector<HTMLElement>("[data-watcher-direction]")!;
      const deltaYEl = root.querySelector<HTMLElement>("[data-watcher-deltay]")!;
      const velocityYEl = root.querySelector<HTMLElement>("[data-watcher-velocityy]")!;

      Watcher({
        target: container,
        onDown: () => (directionEl.textContent = "↓ xuống"),
        onUp: () => (directionEl.textContent = "↑ lên"),
        onChangeY: (self) => {
          deltaYEl.textContent = self.deltaY.toFixed(1);
          velocityYEl.textContent = Math.abs(self.velocityY).toFixed(0);
        },
        onStop: () => {
          directionEl.textContent = "—";
          velocityYEl.textContent = "0";
        },
      });
    },
  },

  "watcher/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "WatcherVars — object truyền vào Watcher(vars).",
    render: () => (
      <>
        {attrsTable([
          ["target", "Window (mặc định) hoặc một Element/selector cuộn được cần theo dõi", "Window | Element | string", "window"],
          ["type", 'nguồn input cần theo dõi, phân tách bởi dấu phẩy — v1 chỉ nhận "wheel" và "scroll"', '"wheel" | "scroll" | "wheel,scroll"', '"wheel,scroll"'],
          ["tolerance", "ngưỡng |delta| tối thiểu trước khi các callback thay đổi được bắn", "—", "1e-9"],
          ["wheelSpeed / scrollSpeed", "hệ số nhân riêng cho delta đến từ wheel / từ vị trí cuộn", "—", "1"],
          ["onStopDelay", "số giây im lặng trước khi onStop bắn (và velocity reset về 0)", "—", "0.25"],
          ["onUp / onDown / onLeft / onRight", "callback(self) theo đúng hướng vừa đổi (trục Y cho lên/xuống, trục X cho trái/phải)", "—", "—"],
          ["onChange", "callback(self, deltaX, deltaY) mỗi khi có delta mới trên bất kỳ trục nào", "—", "—"],
          ["onChangeX / onChangeY", "callback(self) khi riêng trục X / trục Y đổi", "—", "—"],
          ["onWheel", "callback(self) mỗi khi có sự kiện wheel", "—", "—"],
          ["onStop", "callback(self) bắn một lần sau onStopDelay giây không có input mới", "—", "—"],
          ["onEnable / onDisable", "callback(self) khi enable()/disable() được gọi", "—", "—"],
          ["id", "nhãn tuỳ ý, không ảnh hưởng hành vi — tiện phân biệt khi có nhiều Watcher cùng lúc", "—", "—"],
        ])}

        <h2>Instance</h2>
        {attrsTable([
          [".deltaX / .deltaY", "delta đã gộp (wheel + scroll) của lần cập nhật gần nhất", "—"],
          [".velocityX / .velocityY", "tốc độ hiện tại (px/giây theo mỗi trục)", "—"],
          [".isEnabled", "boolean — đang lắng nghe hay đã disable()", "—"],
          [".enable() / .disable()", "bật lại / tạm ngưng lắng nghe (giữ nguyên instance, gọi enable() lại được)", "—"],
          [".kill()", "alias của disable() — cùng interface Killable với Tween/Timeline/SplitText", "—"],
        ])}

        <p class="note">
          Wheel và scroll xảy ra trong cùng một lần cập nhật (vd một sự kiện wheel và scroll event mà chính nó gây ra) không bị cộng dồn đè lên nhau — giá trị delta lớn hơn giữa 2 nguồn được dùng cho
          lần đó.
        </p>
      </>
    ),
  },
};

export { pluginsContent };
