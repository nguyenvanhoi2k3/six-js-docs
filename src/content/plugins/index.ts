import { six, splitText } from "@six-js/core";
import type { ContentMap } from "../../layout/animatable-router/content-types";
import { attrsTable, codeBlock } from "../shared";

function splitDemoText(id: string, text: string): string {
  return `
    <div class="content-pane__panel" style="align-items:center;">
      <h2 id="${id}" style="margin:0;font-size:28px;">${text}</h2>
    </div>
    <div class="content-pane__panel">
      <button class="btn btn--primary btn--sm" data-run>Split &amp; reveal</button>
      <button class="btn btn--ghost btn--sm" data-revert>Revert</button>
    </div>
  `;
}

const pluginsContent: ContentMap = {
  "split-text/overview": {
    eyebrow: "Plugins",
    title: "splitText",
    lead: "Tách text của một element thành mảng chars/words/lines để animate từng phần.",
    render: () => `
      ${splitDemoText("split-overview-target", "Six-js splits text.")}

      ${codeBlock(
        `import { six, splitText } from "@six-js/core";

const split = splitText(".title", { type: "chars,words" });

six.from(split.chars, {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: 0.02,
});`,
        "js",
      )}
      <p>Trả về instance <span class="c-accent">SplitText</span> với các mảng <span class="c-accent">chars</span> / <span class="c-accent">words</span> / <span class="c-accent">lines</span> (HTMLElement[]) — tuỳ theo <span class="c-accent">type</span> khai báo — dùng trực tiếp làm target cho <span class="c-accent">six.to/from/fromTo</span>.</p>
      <p class="note">Split lại nhiều lần trên cùng một element luôn an toàn: mỗi element chỉ thuộc về một <span class="c-accent">SplitText</span> tại một thời điểm — split lần sau tự <span class="c-accent">kill()</span> instance cũ trên đúng element đó (khôi phục HTML gốc) trước khi tách lại, không bao giờ bị wrap chồng lặp.</p>
    `,
    init: (root) => {
      const target = root.querySelector<HTMLElement>("#split-overview-target")!;
      const runBtn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      const revertBtn = root.querySelector<HTMLButtonElement>("[data-revert]")!;
      let split: ReturnType<typeof splitText> | null = null;

      runBtn.addEventListener("click", () => {
        split?.revert();
        split = splitText(target, { type: "chars,words" });
        six.set(split.chars, { opacity: 0, y: 20 });
        six.to(split.chars, { opacity: 1, y: 0, duration: 0.4, stagger: 0.02 });
      });

      revertBtn.addEventListener("click", () => {
        split?.revert();
        split = null;
      });
    },
  },

  "split-text/options": {
    eyebrow: "Plugins",
    title: "Options",
    lead: "SplitTextVars — object thứ 2 truyền vào splitText(target, vars).",
    render: () => `
      ${codeBlock(
        `splitText(".title", {
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

      ${attrsTable([
        ["type", 'chuỗi kết hợp bởi dấu phẩy (hoặc mảng): "chars,words,lines"', '"chars,words,lines"'],
        ["tag", "tên thẻ HTML dùng để wrap mỗi char/word/line", '"div"'],
        ["charsClass / wordsClass / linesClass", "class gán cho mỗi span/div sinh ra — mỗi phần tử còn tự có thêm class đánh số (vd char1, char2, ...)", "—"],
        ["overflow", '"chars" | "words" | "lines" | true — bọc cấp độ đó (true = tự chọn cấp sâu nhất đang split) trong box overflow:clip để làm hiệu ứng reveal kiểu "kéo rèm"', "—"],
        ["aria", '"auto" tự set aria-label trên root + aria-hidden trên span con; "hidden" chỉ set aria-hidden; "none" bỏ qua toàn bộ', '"auto"'],
        ["skip", "selector/Element(s) cần GIỮ NGUYÊN (không tách chars/words bên trong, vd icon/thẻ &lt;b&gt; chèn giữa câu) nhưng vẫn nằm đúng vị trí trong dòng chữ đã split", "—"],
        ["wordDelimiter", 'ký tự/regex phân tách "từ" — mặc định dấu cách; đổi (vd chuỗi rỗng) để split ngôn ngữ không dùng dấu cách như tiếng Nhật/Trung', '" " (dấu cách)'],
        ["reduceWhiteSpace", "gộp khoảng trắng liên tiếp thành 1 trước khi split", "true"],
        ["specialChars", "mảng chuỗi hoặc regex — nhóm các chuỗi ký tự đặc biệt (emoji ghép, dấu kết hợp...) thành đúng 1 \"char\" thay vì bị tách vụn", "—"],
        ["smartWrap", "chống từ cuối cùng của khối text bị ngắt dòng côi cút (orphan) khi không split words riêng", "false"],
        ["propIndex", "gắn thêm CSS custom property --char / --word / --line (số thứ tự, bắt đầu từ 1) lên mỗi span — stagger thuần bằng CSS mà không cần JS", "false"],
        ["prepareText(text, element)", "hook biến đổi text thô trước khi tách (vd bỏ ký tự đặc biệt tự thêm)", "—"],
        ["onSplit(self) / onRevert(self)", "callback chạy sau mỗi lần (re-)split / sau khi revert", "—"],
      ])}

      <p>Nếu chỉ cần <span class="c-accent">lines</span> mà không cần giữ lại <span class="c-accent">words</span> wrapper, chỉ khai <span class="c-accent">type: "lines"</span> — splitText tự unwrap words sau khi đã dùng chúng để đo dòng.</p>
      <p class="note">Trước đây tham số này tên là <code>mask</code> — nay đổi tên thành <code>overflow</code> (giá trị/hành vi giữ nguyên).</p>
    `,
  },

  "split-text/overflow": {
    eyebrow: "Plugins",
    title: "overflow (mask)",
    lead: 'Bọc chars/words/lines trong một box overflow:clip — dùng để làm hiệu ứng reveal kiểu "kéo rèm" mà không đổi nội dung split.chars/words/lines trỏ tới.',
    render: () => `
      ${splitDemoText("split-mask-target", "Reveal theo từng dòng, đẹp và mượt.")}

      ${codeBlock(
        `const split = splitText(".headline", {
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

      <p class="note"><code>overflow: "lines"</code> yêu cầu <code>type</code> có bao gồm <code>"lines"</code> (tương tự cho <code>"chars"</code>/<code>"words"</code>) — nếu không, phần tử tương ứng rỗng nên không có gì để bọc. Truyền <code>overflow: true</code> để splitText tự chọn cấp sâu nhất đang split (ưu tiên lines &gt; words &gt; chars).</p>
    `,
    init: (root) => {
      const target = root.querySelector<HTMLElement>("#split-mask-target")!;
      const runBtn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      const revertBtn = root.querySelector<HTMLButtonElement>("[data-revert]")!;
      let split: ReturnType<typeof splitText> | null = null;

      runBtn.addEventListener("click", () => {
        split?.revert();
        split = splitText(target, { type: "lines", overflow: "lines" });
        six.set(split.lines, { y: "100%" });
        six.to(split.lines, { y: "0%", duration: 0.6, ease: "cubicOut", stagger: 0.08 });
      });

      revertBtn.addEventListener("click", () => {
        split?.revert();
        split = null;
      });
    },
  },

  "split-text/lifecycle": {
    eyebrow: "Plugins",
    title: "split() / revert() / kill()",
    lead: "SplitText là một instance sống — quản lý vòng đời để tránh leak tween/ResizeObserver khi component unmount hoặc re-render.",
    render: () => `
      ${codeBlock(
        `const split = splitText(".title", { type: "chars" });

// split lại với vars mới (merge vào vars cũ)
split.split({ type: "chars,words" });

// khôi phục innerHTML gốc, gỡ ResizeObserver/font listener, chạy onRevert
split.revert();

// alias của revert() — cùng interface Killable như Tween/Timeline/Context
split.kill();`,
        "js",
      )}

      ${attrsTable([
        [".chars / .words / .lines / .masks", "HTMLElement[] — cập nhật lại sau mỗi lần split()", "—"],
        [".isSplit", "boolean — đang ở trạng thái đã split hay chưa", "—"],
        [".split(vars?)", "merge vars mới rồi split lại (tự revert() trạng thái split cũ trước), trả về chính instance (this)", "—"],
        [".revert() / .kill()", "khôi phục HTML gốc, gỡ toàn bộ side-effect (auto re-split, tween từ onSplit)", "—"],
      ])}

      <p>Khi <code>type</code> có <code>"lines"</code>, splitText TỰ ĐỘNG split lại khi kích thước phần tử đổi (resize) hoặc khi <code>document.fonts</code> load xong — không cần bật cờ nào, luôn bật sẵn để số dòng luôn đúng với font/kích thước thật.</p>
      <p class="note">Vì <span class="c-accent">SplitText</span> implement <span class="c-accent">Killable</span>, tạo instance bên trong <span class="c-accent">six.context()</span> (hoặc bên trong handler của <span class="c-accent">six.breakpoint()</span>) sẽ tự <span class="c-accent">revert()</span> khi scope đó bị <span class="c-accent">revert()</span>/<span class="c-accent">kill()</span> — giống hệt cách một <span class="c-accent">Tween</span> tự kill trong scope đó.</p>
    `,
  },
};

export { pluginsContent };
