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
        `import { six } from "@six-js/core";
import { splitText } from "@six-js/core/split-text";

const split = splitText(".title", { type: "chars,words" });

six.from(split.chars, {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: 0.02,
});`,
        "js",
      )}

      <p><span class="c-accent">splitText</span> không phải method trên <span class="c-accent">six</span> — import riêng như một plugin (xem <a href="/installation.html#tree-shaking">phần tree shaking</a> ở trang Installation).</p>
      <p>Trả về instance <span class="c-accent">SplitText</span> với 3 mảng <span class="c-accent">chars</span> / <span class="c-accent">words</span> / <span class="c-accent">lines</span> (HTMLElement[]) — tuỳ theo <span class="c-accent">type</span> khai báo — dùng trực tiếp làm target cho <span class="c-accent">six.to/from/fromTo</span>.</p>
      <p class="note">Gọi lại <span class="c-accent">.split()</span> nhiều lần (hoặc bật <span class="c-accent">autoSplit</span>) luôn an toàn: mỗi lần split đều khôi phục từ <span class="c-accent">innerHTML</span> gốc trước, không bị wrap chồng lặp.</p>
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
  mask: "lines",
  autoSplit: true,
  aria: "auto",
  onSplit: (self) => {
    return six.from(self.lines, { opacity: 0, y: "100%", stagger: 0.08 });
  },
});`,
        "js",
      )}

      ${attrsTable([
        ["type", 'chuỗi kết hợp bởi dấu phẩy: "chars,words,lines"', '"chars,words,lines"'],
        ["tag", "tên thẻ HTML dùng để wrap mỗi word/line", '"div"'],
        ["charsClass / wordsClass / linesClass", 'class gán cho mỗi span/div sinh ra. Thêm "++" (vd "char++") để có thêm class đánh số char0, char1, ...', "—"],
        ["mask", '"chars" | "words" | "lines" — bọc cấp độ đó trong box overflow:hidden để làm hiệu ứng reveal', "—"],
        ["autoSplit", "true — tự split lại khi resize (đổi số dòng) hoặc khi document.fonts load xong", "false"],
        ["aria", '"auto" tự set aria-label trên root + aria-hidden trên span con; "none" bỏ qua', '"auto"'],
        ["onSplit", "callback chạy sau mỗi lần (re-)split; return một Killable / Killable[] (vd Playable từ six.to) sẽ tự kill trước lần split kế tiếp", "—"],
      ])}

      <p>Nếu chỉ cần <span class="c-accent">lines</span> mà không cần giữ lại <span class="c-accent">words</span> wrapper, chỉ khai <span class="c-accent">type: "lines"</span> — splitText tự unwrap words sau khi đã dùng chúng để đo dòng.</p>
    `,
  },

  "split-text/mask": {
    eyebrow: "Plugins",
    title: "mask",
    lead: 'Bọc chars/words/lines trong một box overflow:hidden — dùng để làm hiệu ứng reveal kiểu "kéo rèm" mà không đổi nội dung split.chars/words/lines trỏ tới.',
    render: () => `
      ${splitDemoText("split-mask-target", "Reveal theo từng dòng, đẹp và mượt.")}

      ${codeBlock(
        `const split = splitText(".headline", {
  type: "lines",
  mask: "lines",
});

six.from(split.lines, {
  y: "100%",
  duration: 0.6,
  ease: "cubicOut",
  stagger: 0.08,
});`,
        "js",
      )}

      <p class="note">mask: "lines" yêu cầu type có include "lines" (tương tự cho "chars"/"words") — nếu không, splitText log warning và bỏ qua mask.</p>
    `,
    init: (root) => {
      const target = root.querySelector<HTMLElement>("#split-mask-target")!;
      const runBtn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      const revertBtn = root.querySelector<HTMLButtonElement>("[data-revert]")!;
      let split: ReturnType<typeof splitText> | null = null;

      runBtn.addEventListener("click", () => {
        split?.revert();
        split = splitText(target, { type: "lines", mask: "lines" });
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
    lead: "SplitText là một instance sống — quản lý vòng đời để tránh leak tween/resize-observer khi component unmount hoặc re-render.",
    render: () => `
      ${codeBlock(
        `const split = splitText(".title", { type: "chars" });

// split lại với vars mới (merge vào vars cũ)
split.split({ type: "chars,words" });

// khôi phục innerHTML gốc, gỡ ResizeObserver/font listener, kill tween từ onSplit
split.revert();

// alias của revert() — cùng interface Killable như Playable/SxMediaScope
split.kill();`,
        "js",
      )}

      ${attrsTable([
        [".chars / .words / .lines", "HTMLElement[] — cập nhật lại sau mỗi lần split()", "—"],
        [".split(vars?)", "merge vars mới rồi split lại, trả về chính instance (this)", "—"],
        [".revert() / .kill()", "khôi phục HTML gốc, gỡ toàn bộ side-effect (autoSplit, tween từ onSplit)", "—"],
      ])}

      <p>Vì <span class="c-accent">SplitText</span> implement <span class="c-accent">Killable</span>, tạo instance bên trong handler của <span class="c-accent">six.matchMedia()</span> sẽ tự <span class="c-accent">revert()</span> khi rời khỏi điều kiện breakpoint hoặc khi scope bị kill — giống hệt cách <span class="c-accent">Playable</span> tự kill trong scope đó.</p>
    `,
  },
};

export { pluginsContent };
