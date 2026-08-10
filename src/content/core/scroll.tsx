import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

export const scrollContent: ContentMap = {
  "scroll/onScroll": {
    eyebrow: "Core",
    title: "onScroll (OnScroll)",
    lead: "Truyền onScroll vào vars của to/from/fromTo/timeline để animation chạy theo vị trí cuộn trang (hoặc một container bất kỳ) thay vì theo thời gian.",
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
              <p style="text-align:center;color:var(--muted);font-size:12px;margin:8px 0 0;">bám sát 1:1 theo % cuộn (sync: true)</p>
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
          Mỗi tween tự chọn cách chạy: toggle một lần khi cuộn qua ngưỡng (2 box phía trên), hoặc bám sát % cuộn bằng <code>sync: true</code> (progress bar phía dưới):
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
            'chuỗi "cạnh trigger cạnh viewport" (vd "top bottom"), hoặc hàm trả về vị trí đó — cú pháp đầy đủ ngay bên dưới',
            "top | center | bottom | left | right | N% | Npx | number | (self) => string | number",
            '"top bottom" / "bottom top"',
          ],
          ["axis", "đổi sang đo theo trục ngang cho track cuộn ngang", '"x" | "y"', '"y"'],
          [
            "sync",
            "false: animate khi cuộn qua vùng start. true: animate sync theo cuộn. Số (giây): animate sync theo cuộn nhưng có quán tính theo số giây đó",
            "boolean | number",
            "false",
          ],
          ["sticky", "ghim phần tử tại vị trí tự nhiên của nó trong suốt quãng [start, end] (không nhảy lên top viewport)", "true (ghim chính trigger) | Element | selector", "false"],
          [
            "syncTo",
            "dùng khi nội dung cuộn bằng tween/timeline khác (vd horizontal scroll, storytelling section) thay vì thanh cuộn trình duyệt",
            "Animation",
            "—",
          ],
          ["debug / id", "debug: vẽ vạch start/end để canh chỉnh. id: gắn nhãn khi có nhiều trigger trên màn hình", "boolean / string", "false / —"],
          ["onEnter / onLeave / onEnterBack / onLeaveBack", "callback theo từng hướng cuộn qua start/end", "(self) => void", "—"],
          ["onUpdate", "chỉ bắn khi đang ở trong [start, end] (và đúng frame vào/ra)", "(self) => void", "—"],
          ["onRefresh", "bắn mỗi khi refresh() đo lại vị trí", "(self) => void", "—"],
        ])}

        <h2>Cú pháp start / end</h2>
        <p>
          Mỗi giá trị là chuỗi hai từ: <code>"&lt;cạnh trigger&gt; &lt;cạnh viewport&gt;"</code> — animation chạy tới đúng lúc hai cạnh đó chạm nhau khi cuộn. Chỉ viết một từ (vd <code>"center"</code>) thì
          từ còn lại tự là <code>"top"</code>.
        </p>
        <table class="content-pane__attrs">
          <thead>
            <tr>
              <th>Viết</th>
              <th>Nghĩa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>top</code> / <code>center</code> / <code>bottom</code>
              </td>
              <td>0% / 50% / 100% theo trục dọc (mặc định)</td>
            </tr>
            <tr>
              <td>
                <code>left</code> / <code>center</code> / <code>right</code>
              </td>
              <td>
                0% / 50% / 100% theo trục ngang — dùng khi <code>axis: "x"</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>"30%"</code>
              </td>
              <td>đúng 30% chiều cao (hoặc rộng) của trigger/viewport</td>
            </tr>
            <tr>
              <td>
                <code>"80"</code> (số thường)
              </td>
              <td>mốc tại đúng 80px tính từ đầu (top/left)</td>
            </tr>
            <tr>
              <td>
                <code>"top+=100"</code> / <code>"top-=50"</code>
              </td>
              <td>cộng/trừ thêm px vào ngay cạnh đó — viết liền, không có khoảng trắng</td>
            </tr>
            <tr>
              <td>
                <code>"+=500"</code> / <code>"-=200"</code> (đứng một mình)
              </td>
              <td>
                chỉ dùng cho <code>end</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p></p>
        {codeBlock(
          `onScroll: { start: "top bottom" }    // top trigger chạm bottom viewport — bắt đầu ngay khi trigger vừa lọt vào màn hình
onScroll: { start: "center center" } // giữa trigger chạm giữa màn hình
onScroll: { start: "top 80%" }       // top trigger chạm mốc 80% chiều cao viewport
onScroll: { start: "top+=100 top" }  // như "top top" nhưng lùi thêm 100px
onScroll: { start: "top center", end: "+=500" } // end khi cách start 500px`,
          "js",
        )}

        <p class="note">
          <code>sticky</code> có thể ghim một phần tử khác với trigger: trigger chỉ đo quãng cuộn, <code>sticky</code> chỉ định phần tử bị ghim.
        </p>
        <p class="note">
          Layout đổi (ảnh load xong, thêm/xoá nội dung)? Gọi <code>OnScroll.refresh()</code> để đo lại toàn bộ, hoặc <code>.refresh()</code> trên riêng instance trả về từ <code>OnScroll.create()</code>.
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
