import "./index.scss";
import { attrsTable, codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";

// ---- Shared CSS building blocks reused (and shown in full, self-contained form) across demos below ----

const SLIDE_CSS = `.slide {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  user-select: none;
}

sx-slider-slide[sx-slide-center] .slide {
  color: #78a5ee;
}`;

const NAV_CSS = `.prev {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}

.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}

.nav[sx-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}`;

const PAGINATION_CSS = `.pagination {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.sx-slider-pagination-bullet {
  width: 10px;
  height: 10px;
  background: #e4e4e4;
  border: 1px solid #000;
  display: block;
  border-radius: 50%;
  transition: 0.3s;
  cursor: pointer;
}

.sx-slider-pagination-bullet:hover {
  background-color: #000;
}

.sx-slider-pagination-bullet[sx-bullet-active] {
  background-color: #000;
}`;

const DYNAMIC_PAGINATION_CSS = `.dynamic-pagination {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1rem;
  margin: auto;
  width: 80px;
}

sx-slider-pagination[effect="dynamic"] {
    display: flex;
    overflow: hidden;
    position: relative;
    transition: width 0.3s ease;
  }

  sx-slider-pagination[effect="dynamic"] .sx-slider-pagination-inner {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
    will-change: transform;
  }

  sx-slider-pagination[effect="dynamic"] .sx-slider-pagination-bullet {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    border: none;
    background: #979797;
    transition: 0.3s ease;
    border-radius: 50%;
    cursor: pointer;
  }

  sx-slider-pagination[effect="dynamic"]
    .sx-slider-pagination-bullet[sx-bullet-active] {
    transform: scale(1);
    background: #000;
  }

  sx-slider-pagination[effect="dynamic"]
    .sx-slider-pagination-bullet.sx-bullet-main {
    transform: scale(1);
  }

  sx-slider-pagination[effect="dynamic"]
    .sx-slider-pagination-bullet.sx-bullet-medium {
    transform: scale(0.66);
  }

  sx-slider-pagination[effect="dynamic"]
    .sx-slider-pagination-bullet.sx-bullet-small {
    transform: scale(0.33);
  }`;

const SNAKE_PAGINATION_CSS = `sx-slider-pagination[effect="snake"] {
  /* width phải là fit-content: JS tính vị trí thanh trượt (.sx-slider-pagination-bar)
     theo activeIndex * step tính từ mép trái của chính thẻ này, nên container
     không được stretch/centered bằng justify-content — chỉ canh giữa cả khối. */
  position: absolute;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  width: fit-content;
  margin: auto;
  display: flex;
  gap: 10px;
}

sx-slider-pagination[effect="snake"] .sx-slider-pagination-bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7d7d7d;
}

sx-slider-pagination[effect="snake"] .sx-slider-pagination-bullet[sx-bullet-active] {
  background: #000;
  z-index: 1000;
}

sx-slider-pagination[effect="snake"] .sx-slider-pagination-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #000;
  pointer-events: none;
  z-index: 1;
  transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}`;

const NUMBER_PAGINATION_CSS = `sx-slider-pagination[effect="number"] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
}

sx-slider-pagination[effect="number"] .sx-slider-pagination-bullet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  color: #333;
  font-size: 12px;
  font-weight: 500;
  transition: 0.2s;
}

sx-slider-pagination[effect="number"] .sx-slider-pagination-bullet[sx-bullet-active] {
  background-color: #000;
  border-color: #000;
  color: #fff;
}`;

const FRACTION_PAGINATION_CSS = `sx-slider-pagination[effect="fraction"] {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: 12px;
  font-size: 14px;
  color: #333;
}

sx-slider-pagination[effect="fraction"] .sx-slider-pagination-current {
  color: #000;
  font-weight: 700;
}`;

const PROGRESS_CSS = `sx-slider-progress {
  display: block;
  position: relative;
  width: 100%;
  height: 4px;
  background: #96bfff6f;
  overflow: hidden;
  border-radius: 2px;
}

.sx-slider-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #78a5ee;
}`;

const mkSlides = (n: number, heights?: number[]): string =>
  Array.from({ length: n }, (_, i) => {
    const h = heights?.[i];
    return `    <sx-slider-slide>
      <div class="slide"${h ? ` style="height:${h}px"` : ""}>Slide ${i + 1}</div>
    </sx-slider-slide>`;
  }).join("\n");

const navMarkup = `  <sx-slider-prev class="nav prev">Prev</sx-slider-prev>
  <sx-slider-next class="nav next">Next</sx-slider-next>`;

export const slider: ComponentDoc = {
  slug: "slider",
  eyebrow: "sx-slider",
  title: "Slider",
  lead: "Slider/carousel kéo bằng chuột hoặc chạm, hỗ trợ loop, autoplay, hiệu ứng fade, pagination/progress, và đồng bộ nhiều slider.",
  render: () => `
    <h2>Code</h2>
    ${codeBlock(`<sx-slider
  name="slider-1"
  per-view="1"
  gap="0"
  speed="0.4"
  effect="fade"
  breakpoints="{
      360: {
        per-view: 2,
        gap: 100,
        effect: 'slide',
      },
      768: {
        per-view: 3,
        gap: 20,
      },
      1080: {
        per-view: 4,
        gap: 40
      }
    }"
>
  <sx-slider-track>
    <sx-slider-slide>
      <div class="slide">Slide 1</div>
    </sx-slider-slide>
    <sx-slider-slide>
      <div class="slide">Slide 2</div>
    </sx-slider-slide>
    <sx-slider-slide>
      <div class="slide">Slide 3</div>
    </sx-slider-slide>
  </sx-slider-track>

  <sx-slider-prev>Prev</sx-slider-prev>
  <sx-slider-next>Next</sx-slider-next>

  <sx-slider-pagination></sx-slider-pagination>

  <sx-slider-progress></sx-slider-progress>
</sx-slider>`)}

    <h2>Attributes</h2>
    ${attrsTable([
      [
        "name",
        "định danh slider — cần khi dùng sync, hoặc để prev/next/pagination/progress ở ngoài trỏ vào",
        "—",
      ],
      ["per-view", "số slide hiển thị cùng lúc", "1"],
      ["gap", "khoảng cách giữa các slide (px hoặc đơn vị CSS)", "0"],
      [
        "drag",
        "true | false | free — free là kéo trôi tự do có quán tính",
        "true",
      ],
      ["speed", "thời gian chuyển slide, tính bằng giây (vd: 0.3)", "0.3"],
      ["direction", "horizontal | vertical", "horizontal"],
      ["start-index", "index slide bắt đầu", "0"],
      ["per-move", "số slide di chuyển mỗi lần next/prev, hoặc auto", "auto"],
      [
        "loop",
        "true | false — nhân bản slide đầu/cuối để cuộn vô hạn",
        "false",
      ],
      ["rewind", "true | false — nhảy về đầu/cuối khi không loop", "false"],
      ["autoplay", "bật tự động chạy", "false"],
      ["interval", "chu kỳ tự động chạy, tính bằng giây (vd: 4)", "4"],
      ["effect", "slide | fade", "slide"],
      [
        "grab-cursor",
        "true | false — đổi con trỏ chuột thành grab/grabbing khi kéo",
        "false",
      ],
      [
        "snap",
        'true | false — chỉ dùng với drag="free", tự căn về slide gần nhất khi thả tay',
        "false",
      ],
      [
        "auto-size",
        "true | false — chiều rộng slide tự theo nội dung thay vì chia đều theo per-view",
        "false",
      ],
      [
        "centered",
        "true | false — căn slide đang active vào giữa container",
        "false",
      ],
      [
        "auto-centered",
        "true | false — như centered nhưng không chừa khoảng trống 2 đầu",
        "false",
      ],
      [
        "center-if-short",
        "true | false — tự căn giữa khi tổng slide ngắn hơn container",
        "false",
      ],
      [
        "auto-height",
        "true | false — chiều cao track tự co giãn theo slide đang active",
        "false",
      ],
      ["right-padding", "khoảng đệm bên phải track (px hoặc đơn vị CSS)", "0"],
      ["left-padding", "khoảng đệm bên trái track (px hoặc đơn vị CSS)", "0"],
      [
        "edge-resistance",
        'độ "đàn hồi" (px) khi kéo quá biên lúc không loop',
        "100",
      ],
      [
        "vertical-scroll",
        'true | false — cho cuộn bằng wheel khi direction="vertical"',
        "false",
      ],
      [
        "lock-active",
        "true | false — drag slider những giữ nguyên slide đang activ. Phục vụ trong việc xem thumbnail",
        "false",
      ],
      [
        "sync",
        "name của (các) slider khác cần đồng bộ theo, cách nhau bởi dấu phẩy",
        "—",
      ],
      [
        "breakpoints",
        "JSON theo container width, override các attribute trên",
        "—",
      ],
    ])}

    <h2>sx-slider-prev / sx-slider-next</h2>
    <p class="note">Có thể đặt bên trong <span class="c-accent">sx-slider</span>, hoặc ở ngoài (portal) và trỏ đến slider bằng attribute <span class="c-accent">name</span>.</p>
    ${codeBlock(`<sx-slider-prev name="slider-1">Prev</sx-slider-prev>
<sx-slider-next name="slider-1">Next</sx-slider-next>`)}
    ${attrsTable([
      [
        "name",
        "name của sx-slider cần điều khiển — bỏ trống nếu đặt bên trong slider đó",
        "—",
      ],
    ])}
    <p class="note">Tự động nhận attribute <span class="c-accent">sx-disabled</span> khi ở đầu/cuối danh sách (không loop, không rewind).</p>

    <h2>sx-slider-pagination</h2>
    ${codeBlock(`<sx-slider-pagination name="slider-1" effect="bullet"></sx-slider-pagination>`)}
    ${attrsTable([
      [
        "name",
        "name của sx-slider cần điều khiển — bỏ trống nếu đặt bên trong slider đó",
        "—",
      ],
      ["effect", "bullet | number | dynamic | snake | fraction", "bullet"],
    ])}
    <p class="note"><span class="c-accent">effect</span> chỉ quyết định HTML render ra (bullet/số/dynamic/snake/fraction) — vẫn cần tự viết CSS để có hiệu ứng hiển thị tương ứng.</p>

    <h2>sx-slider-progress</h2>
    <p class="note">Thanh tiến trình theo % đã cuộn. Có thể đặt bên trong <span class="c-accent">sx-slider</span>, hoặc ở ngoài (portal) và trỏ đến slider bằng attribute <span class="c-accent">name</span>.</p>
    ${codeBlock(`<sx-slider-progress name="slider-1"></sx-slider-progress>`)}
    ${attrsTable([
      [
        "name",
        "name của sx-slider cần điều khiển — bỏ trống nếu đặt bên trong slider đó",
        "—",
      ],
    ])}
  `,

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Default",
      html: `<sx-slider per-view="1" gap="16">
  <sx-slider-track>
${mkSlides(3)}
  </sx-slider-track>
${navMarkup}
</sx-slider>`,
      css: `${SLIDE_CSS}

${NAV_CSS}`,
    },
    {
      label: "Pagination",
      html: `<sx-slider gap="16">
  <sx-slider-track>
${mkSlides(3)}
  </sx-slider-track>
  <sx-slider-pagination class="pagination"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${PAGINATION_CSS}`,
    },
    {
      label: "Dynamic pagination",
      html: `<sx-slider gap="16">
  <sx-slider-track>
${mkSlides(8)}
  </sx-slider-track>
  <div class="dynamic-pagination">
  <sx-slider-pagination effect="dynamic"></sx-slider-pagination>
  </div>
</sx-slider>`,
      css: `${SLIDE_CSS}

${DYNAMIC_PAGINATION_CSS}`,
    },
    {
      label: "Progress pagination",
      html: `<sx-slider gap="16">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
  <sx-slider-progress></sx-slider-progress>
</sx-slider>`,
      css: `${SLIDE_CSS}

${PROGRESS_CSS}`,
    },
    {
      label: "Snake pagination",
      html: `<sx-slider name="snake-demo" gap="16">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
  <sx-slider-pagination name="snake-demo" effect="snake"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${SNAKE_PAGINATION_CSS}`,
    },
    {
      label: "Number pagination",
      html: `<sx-slider gap="16">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
  <sx-slider-pagination effect="number"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${NUMBER_PAGINATION_CSS}`,
    },
    {
      label: "Fraction pagination",
      html: `<sx-slider gap="16">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
  <sx-slider-pagination effect="fraction"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${FRACTION_PAGINATION_CSS}`,
    },
    {
      label: "Vertical slider",
      html: `<sx-slider direction="vertical" style="--sx-slider-height:500px" gap="12">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
  <sx-slider-prev class="nav prev">▲</sx-slider-prev>
  <sx-slider-next class="nav next">▼</sx-slider-next>
</sx-slider>`,
      css: `.slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e4e4e4;
  user-select: none;
}

sx-slider-slide[sx-slide-active] .slide,
sx-slider-slide[sx-slide-center] .slide {
  color: #78a5ee;
  font-weight: 600;
}

.prev {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
}

.next {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
}

.nav[sx-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}`,
    },
    {
      label: "Slide per view",
      html: `<sx-slider per-view="3" gap="16">
  <sx-slider-track>
${mkSlides(6)}
  </sx-slider-track>
  <sx-slider-pagination class="pagination"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${PAGINATION_CSS}`,
    },
    {
      label: "Per move",
      html: `<sx-slider per-view="3" per-move="3" gap="16">
  <sx-slider-track>
${mkSlides(7)}
  </sx-slider-track>
  <sx-slider-pagination class="pagination"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${PAGINATION_CSS}`,
    },
    {
      label: "Auto size",
      html: `<sx-slider auto-size gap="16">
  <sx-slider-track>
    <sx-slider-slide><div class="slide" style="width:600px">Slide 1</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:350px">Slide 2</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:300px">Slide 3</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:650px">Slide 4</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:350px">Slide 5</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:450px">Slide 6</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:700px">Slide 7</div></sx-slider-slide>
  </sx-slider-track>
${navMarkup}
</sx-slider>`,
      css: `.slide {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  user-select: none;
}

${NAV_CSS}`,
    },
    {
      label: "Centered",
      html: `<sx-slider auto-size centered gap="16">
  <sx-slider-track>
    <sx-slider-slide><div class="slide" style="width:600px">Slide 1</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:350px">Slide 2</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:300px">Slide 3</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:650px">Slide 4</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:350px">Slide 5</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:450px">Slide 6</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:700px">Slide 7</div></sx-slider-slide>
  </sx-slider-track>
${navMarkup}
</sx-slider>`,
      css: `.slide {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  user-select: none;
}

sx-slider-slide[sx-slide-active] .slide,
sx-slider-slide[sx-slide-center] .slide {
  color: #78a5ee;
  font-weight: 600;
}

${NAV_CSS}`,
    },
    {
      label: "Auto centered",
      html: `<sx-slider auto-size auto-centered gap="16">
  <sx-slider-track>
    <sx-slider-slide><div class="slide" style="width:600px">Slide 1</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:350px">Slide 2</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:300px">Slide 3</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:650px">Slide 4</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:350px">Slide 5</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:450px">Slide 6</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:700px">Slide 7</div></sx-slider-slide>
  </sx-slider-track>
${navMarkup}
</sx-slider>
`,
      css: `.slide {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  user-select: none;
}

sx-slider-slide[sx-slide-active] .slide,
sx-slider-slide[sx-slide-center] .slide {
  color: #78a5ee;
  font-weight: 600;
}

${NAV_CSS}`,
    },
    {
      label: "Center if short",
      html: `<sx-slider per-view="4" center-if-short gap="16">
  <sx-slider-track>
${mkSlides(3)}
  </sx-slider-track>
</sx-slider>
<p class="note">Nếu tắt <span class="c-accent">center-if-short</span>, danh sách ngắn hơn per-view sẽ căn trái thay vì căn giữa.</p>`,
      css: SLIDE_CSS,
    },
    {
      label: "Grab cursor",
      html: `<sx-slider grab-cursor gap="16">
  <sx-slider-track>
${mkSlides(4)}
  </sx-slider-track>
</sx-slider>`,
      css: `${SLIDE_CSS}

/* Con trỏ grab/grabbing khi kéo đã có sẵn từ CSS gốc của thư viện
   (sx-slider-track[grab-cursor]) — không cần khai báo thêm ở đây. */`,
    },
    {
      label: "Drag free",
      html: `<sx-slider per-view="3" grab-cursor drag="free" gap="16">
  <sx-slider-track>
${mkSlides(10)}
  </sx-slider-track>
  <sx-slider-progress></sx-slider-progress>
</sx-slider>`,
      css: `${SLIDE_CSS}

${PROGRESS_CSS}`,
    },
    {
      label: "Snap",
      html: `<sx-slider per-view="3" grab-cursor drag="free" snap gap="16">
  <sx-slider-track>
${mkSlides(10)}
  </sx-slider-track>
</sx-slider>
<p class="note">Trôi tự do (<span class="c-accent">drag="free"</span>) nhưng luôn tự căn về slide gần nhất khi thả tay.</p>`,
      css: SLIDE_CSS,
    },
    {
      label: "Loop",
      html: `<sx-slider per-view="3" loop gap="16">
  <sx-slider-track>
${mkSlides(6)}
  </sx-slider-track>
${navMarkup}
  <sx-slider-pagination class="pagination"></sx-slider-pagination>
</sx-slider>`,
      css: `${SLIDE_CSS}

${NAV_CSS}

${PAGINATION_CSS}`,
    },
    {
      label: "Auto play",
      html: `<sx-slider per-view="3" loop autoplay interval="2" gap="16">
  <sx-slider-track>
${mkSlides(6)}
  </sx-slider-track>
  <sx-slider-pagination class="pagination"></sx-slider-pagination>
</sx-slider>
`,
      css: `${SLIDE_CSS}

${PAGINATION_CSS}`,
    },
    {
      label: "Auto height",
      html: `<sx-slider name="auto-height-demo" per-view="3" auto-height gap="16">
  <sx-slider-track>
${mkSlides(7, [300, 300, 300, 400, 300, 300, 300])}
  </sx-slider-track>
</sx-slider>
<sx-slider-pagination name="auto-height-demo" class="pagination-static"></sx-slider-pagination>
<p class="note">Nên đặt <span class="c-accent">sx-slider-pagination</span> ở ngoài <span class="c-accent">sx-slider</span> khi dùng auto-height: track co giãn chiều cao liên tục, nếu pagination nằm bên trong có thể tạm thời bị nội dung slide dài hơn đè lên trong lúc chuyển cảnh.</p>`,
      css: `.slide {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  user-select: none;
}

sx-slider-slide[sx-slide-active] .slide {
  color: #78a5ee;
  font-weight: 600;
}

.pagination-static {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
}

.pagination-static .sx-slider-pagination-bullet {
  width: 10px;
  height: 10px;
  background: #e4e4e4;
  border: 1px solid #000;
  border-radius: 50%;
  transition: 0.3s;
  cursor: pointer;
}

.pagination-static .sx-slider-pagination-bullet:hover {
  background-color: #000;
}

.pagination-static .sx-slider-pagination-bullet[sx-bullet-active] {
  background-color: #000;
}`,
    },
    {
      label: "Fade effect",
      html: `<sx-slider effect="fade">
  <sx-slider-track>
${mkSlides(3)}
  </sx-slider-track>
${navMarkup}
</sx-slider>`,
      css: `${SLIDE_CSS}

${NAV_CSS}`,
    },
    {
      label: "Right padding",
      html: `<sx-slider right-padding="120" gap="16">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
${navMarkup}
</sx-slider>`,
      css: `${SLIDE_CSS}

${NAV_CSS}`,
    },
    {
      label: "Left padding",
      html: `<sx-slider left-padding="120" gap="16">
  <sx-slider-track>
${mkSlides(5)}
  </sx-slider-track>
${navMarkup}
</sx-slider>`,
      css: `${SLIDE_CSS}

${NAV_CSS}`,
    },
    {
      label: "Breakpoints",
      html: `<div class="resize-frame">
  <sx-slider
    effect="fade"
    per-view="1"
    gap="0"
    speed="0.4"
    breakpoints="{
      360: {
        per-view: 2,
        gap: 10,
        effect: 'slide',
      },
      768: {
        per-view: 3,
        gap: 20,
      },
      1080: {
        per-view: 4,
        gap: 40
      }
    }"
  >
    <sx-slider-track>
${mkSlides(8)}
    </sx-slider-track>
${navMarkup}
  </sx-slider>
</div>
<p class="note">Breakpoint tính theo chiều rộng của chính <span class="c-accent">sx-slider</span> (qua ResizeObserver), không phải viewport — kéo góc dưới-phải khung bên dưới để đổi kích thước và xem breakpoint đổi theo. Responsive mọi thuộc tính, trừ <span class="c-accent">direction</span>.</p>
<p class="note">Dưới 360px: dùng <span class="c-accent">effect="fade"</span> khai báo trên chính sx-slider (không có breakpoint nào khớp). Từ 360px trở lên, breakpoint đầu tiên set lại <span class="c-accent">effect: 'slide'</span> — các breakpoint gộp dồn từ nhỏ đến lớn nên nếu không set lại tường minh, giá trị cũ (fade) sẽ tiếp tục áp dụng lên các breakpoint lớn hơn.</p>`,
      css: `.resize-frame {
  resize: horizontal;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  min-width: 280px;
  padding: 12px;
  border: 1px dashed #999;
}

${SLIDE_CSS}

${NAV_CSS}`,
    },
    {
      label: "Sync",
      html: `<div style="display:flex">
  <sx-slider name="sync-main" sync="sync-thumb-v, sync-thumb-h" per-view="1" gap="10" effect="fade" style="flex:1">
    <sx-slider-track>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 1</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 2</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 3</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 4</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 5</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 6</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 7</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 8</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 9</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:100%">Slide 10</div></sx-slider-slide>
    </sx-slider-track>
  </sx-slider>
  <sx-slider name="sync-thumb-v" sync="sync-main" direction="vertical" gap="10" snap drag="free" lock-active auto-centered auto-size style="width:100px">
    <sx-slider-track>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 1</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 2</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 3</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 4</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 5</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 6</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 7</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 8</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 9</div></sx-slider-slide>
      <sx-slider-slide><div class="slide" style="width:100%;height:150px">Slide 10</div></sx-slider-slide>
    </sx-slider-track>
  </sx-slider>
</div>
<sx-slider name="sync-thumb-h" sync="sync-main" per-view="5" gap="10" snap drag="free" lock-active auto-centered>
  <sx-slider-track>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 1</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 2</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 3</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 4</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 5</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 6</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 7</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 8</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 9</div></sx-slider-slide>
    <sx-slider-slide><div class="slide" style="width:100%;height:100px">Slide 10</div></sx-slider-slide>
  </sx-slider-track>
</sx-slider>
<p class="note">Slider chính đồng bộ 2 chiều với 2 dải thumbnail (dọc + ngang) qua <span class="c-accent">sync</span> + <span class="c-accent">name</span>. Dải thumbnail dùng <span class="c-accent">lock-active</span> để không tự nhảy active khi đang bị chính nó điều khiển ngược lại.</p>`,
      css: `.slide {
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #989898;
  user-select: none;
}

sx-slider[name="sync-thumb-v"] {
  margin-left: 20px;
}

sx-slider[name="sync-thumb-h"] {
  margin-top: 20px;
}

sx-slider[name="sync-thumb-v"] sx-slider-slide,
sx-slider[name="sync-thumb-h"] sx-slider-slide {
  opacity: 0.5;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

sx-slider[name="sync-thumb-v"] sx-slider-slide[sx-slide-active],
sx-slider[name="sync-thumb-h"] sx-slider-slide[sx-slide-active] {
  opacity: 1;
}

sx-slider[name="sync-thumb-v"] sx-slider-slide:hover,
sx-slider[name="sync-thumb-h"] sx-slider-slide:hover {
  opacity: 1;
}`,
    },
  ],
};
