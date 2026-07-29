import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

export const scrollContent: ContentMap = {
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
};
