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
  ["duration", "thời gian, tính bằng giây", "0.5 (setDefaults)"],
  ["ease", "tên easing trong bảng EASINGS (vd: quadOut, backOut, strongInOut)", "quadOut"],
  ["delay", "giây, hoặc chuỗi có đơn vị", "0"],
  ["repeat", "số lần lặp lại (-1 = vô hạn)", "0"],
  ["repeatDelay", "khoảng nghỉ giữa các lần lặp (giây)", "0"],
  ["boomerang", "true | false — lặp có đảo chiều (yoyo)", "false"],
  ["stagger", "number | { each, from, ease }", "—"],
  ["overwrite", "true | \"auto\" | false — huỷ tween cũ cùng target", "false"],
  ["onScroll", "{ start, end, sync, sticky, target } — biến tween thành scroll-driven", "—"],
]);

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
    lead: "Ngược với to(): khai báo giá trị bắt đầu trong vars, six-js tự lấy giá trị hiện tại của target làm điểm đến.",
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
    `,
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
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
    `,
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      btn.addEventListener("click", () => {
        six.fromTo(box, { scale: 0.5, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.5, ease: "cubicOut" });
      });
    },
  },

  "sequence/timeline": {
    eyebrow: "Animatable",
    title: "six.timeline()",
    lead: "Gộp nhiều tween vào một hàng thời gian, canh nhau bằng vị trí tương đối (\"-=0.2\", \"<\", nhãn label...).",
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
  .from(".box-3", { opacity: 0, y: 24, duration: 0.5 }, "-=0.3");`,
        "js",
      )}

      <p>Vị trí thứ 3 chấp nhận: số giây tuyệt đối, chuỗi tương đối ("+=0.5" / "-=0.5"), "&lt;" / "&gt;" (cùng lúc / nối tiếp tween trước), hoặc nhãn label đã add bằng <code>.addLabel()</code>.</p>
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
    lead: "Truyền stagger vào vars của to/from/fromTo khi target khớp nhiều phần tử — mỗi phần tử là một Playable độc lập với delay so le.",
    render: () => `
      <div class="content-pane__panel" style="align-items:center;">
        ${[1, 2, 3, 4, 5]
          .map((n) => `<div class="demo-animate-box stagger-box" style="width:64px;height:64px;flex:none;">${n}</div>`)
          .join("")}
      </div>
      <div class="content-pane__panel">
        <button class="btn btn--primary btn--sm" data-run>Chạy stagger</button>
      </div>

      ${codeBlock(
        `six.to(".stagger-box", {
  y: -16,
  duration: 0.4,
  stagger: 0.08,
  boomerang: true,
});`,
        "js",
      )}
      <p>stagger cũng nhận object <code>{ each, from: "center" | "edges" | number, ease }</code> để đổi thứ tự lan toả thay vì chỉ tuần tự trái→phải.</p>
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
    title: "onScroll (ScrollTrigger)",
    lead: "Truyền onScroll vào vars của to/from/fromTo để biến tween thành scroll-driven, thay vì play theo thời gian.",
    render: () => `
      ${codeBlock(
        `six.to(video, {
  currentTime: video.duration,
  onScroll: {
    trigger: video,     // mặc định lấy chính target
    start: "top top",
    end: "+=2400",
    sync: 0.6,           // số = ease theo lag giây; true = seek trực tiếp mỗi frame
    sticky: true,        // ghim phần tử trong suốt quãng scroll
  },
});`,
        "js",
      )}
      ${attrsTable([
        ["start / end", "chuỗi vị trí: \"top bottom\", \"+=500\", hoặc nhãn tương đối", "—"],
        ["sync", "true (seek trực tiếp) hoặc số giây làm hằng số làm mượt (lag)", "false"],
        ["sticky", "ghim trigger element bằng position: fixed trong quãng scroll", "false"],
        ["target", "phần tử dùng làm mốc scroll, mặc định là chính tween target", "—"],
      ])}
      <p>Dùng đúng nguyên lý này, six-js có thể scrub <code>currentTime</code> của thẻ &lt;video&gt; theo vị trí cuộn trang.</p>
    `,
  },

  "scope/matchMedia": {
    eyebrow: "Animatable",
    title: "six.matchMedia()",
    lead: "Chạy handler theo breakpoint dựa trên window.matchMedia, tự kill/re-run khi rời khỏi điều kiện hoặc khi query đổi.",
    render: () => `
      ${codeBlock(
        `const scope = six.matchMedia(
  {
    isDesktop: "(min-width: 1024px)",
    isMobile: "(max-width: 1023px)",
  },
  ({ isDesktop }, scope) => {
    // handler chạy ngay lần đầu, rồi chạy lại mỗi khi kết quả match đổi
    // mọi to/from/fromTo/timeline/stagger gọi đồng bộ ở đây
    // sẽ tự bị kill trước lần chạy kế tiếp hoặc khi scope.kill()
    six.to(".hero", { x: isDesktop ? 40 : 0, duration: 0.4 });

    // (tuỳ chọn) return một teardown function, chạy trước lần re-run kế tiếp
    return () => six.set(".hero", { x: 0 });
  },
);

// dọn dẹp toàn bộ khi component unmount
scope.kill();`,
        "js",
      )}

      ${attrsTable([
        ["queries", 'chuỗi query đơn (vd "(min-width: 1024px)") hoặc object map {name: query} — quyết định matches là boolean hay { [name]: boolean }', "—"],
        ["handler(matches, scope)", "chạy đồng bộ ngay khi tạo, rồi chạy lại mỗi khi matches đổi; có thể return teardown function", "—"],
        ["scope.refresh()", "ép chạy lại handler ngay cả khi matches không đổi", "—"],
        ["scope.track(fn)", "bọc một callback để mọi tween gọi bên trong cũng được scope quản lý (dùng ngoài handler, vd trong event listener)", "—"],
        ["scope.matches", "getter — snapshot kết quả match hiện tại", "—"],
        ["scope.kill()", "huỷ toàn bộ: gỡ media query listener, kill tween đã capture, chạy teardown cuối cùng", "—"],
      ])}
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

  "utils/setDefaults": {
    eyebrow: "Animatable",
    title: "six.setDefaults()",
    lead: "Đặt duration/ease mặc định toàn cục cho mọi to/from/fromTo/timeline gọi sau đó, khỏi phải lặp lại ở từng lời gọi.",
    render: () => `
      ${codeBlock(
        `six.setDefaults({
  duration: 0.5,
  ease: "quadOut",
});

// từ đây trở đi, không truyền duration/ease vẫn dùng giá trị trên
six.to(".box", { x: 100 });`,
        "js",
      )}
    `,
  },

  "utils/selectors": {
    eyebrow: "Animatable",
    title: "getClass() / getId()",
    lead: "Hai helper querySelector tiện dụng, dùng nội bộ khi target truyền vào to/from/... là chuỗi selector.",
    render: () => `
      ${codeBlock(
        `six.getClass(".card");  // -> HTMLElement[]
six.getId("#hero");     // -> HTMLElement | null (hỗ trợ cả "hero" lẫn "#hero")`,
        "js",
      )}
    `,
  },

  "utils/initElements": {
    eyebrow: "Animatable",
    title: "six.initElements()",
    lead: "Đăng ký toàn bộ web components (sx-dialog, sx-slider, sx-marquee, sx-animate, ...) — gọi một lần, an toàn khi gọi lại nhiều lần.",
    render: () => `
      ${codeBlock(
        `import { six } from "@six-js/core";
import "@six-js/core/style.css";

six.initElements();`,
        "js",
      )}
      <p>Chỉ gọi <code>six.initElements()</code> nếu trang có dùng web components. Nếu chỉ dùng API JS thuần (to/from/timeline/...), có thể bỏ qua bước này.</p>
    `,
  },
};

export { animatableContent };
