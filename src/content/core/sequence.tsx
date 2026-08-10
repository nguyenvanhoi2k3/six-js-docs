import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

// Kept in sync with the `.from()` durations/overlaps built in the "sequence/timeline" demo's
// init() below, so the track ticks line up with where each child tween actually starts.
const TL_DEMO_DUR = 0.5;
const TL_DEMO_OVERLAP = 0.3;
const TL_DEMO_STARTS = [0, TL_DEMO_DUR - TL_DEMO_OVERLAP, 2 * (TL_DEMO_DUR - TL_DEMO_OVERLAP)];
const TL_DEMO_TOTAL = TL_DEMO_STARTS[2] + TL_DEMO_DUR;

export const sequenceContent: ContentMap = {
  "sequence/timeline": {
    eyebrow: "Core",
    title: "six.timeline()",
    lead: 'Gộp nhiều tween vào một hàng thời gian, canh nhau bằng vị trí tương đối như "-=0.2", "<", hoặc label. Timeline cũng là một Animation — play/pause/reverse y hệt tween.',
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
          `// mỗi bước là một tween khác nhau, nối theo vị trí tương đối
// (stagger thì lặp lại cùng một tween, chỉ lệch delay)
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

        <h2>Tham số position</h2>
        <p>Đối số cuối của to/from/fromTo/set/call/add/addLabel — quyết định tween/label mới nằm ở đâu trên timeline:</p>
        {attrsTable([
          ["(bỏ trống)", "nối tiếp ngay sau khi tween/label thêm trước đó kết thúc", "—"],
          ["số giây", "vị trí tuyệt đối trên timeline", "—"],
          ['"<" / "<+=0.2" / "<-=0.2"', "cùng lúc bắt đầu với tween thêm trước đó (kèm lệch thêm nếu có)", "—"],
          ['">" / ">+=0.2"', "ngay sau khi tween thêm trước đó kết thúc (kèm lệch thêm nếu có)", "—"],
          ['"+=0.5" / "-=0.5"', "lệch so với vị trí cuối hiện tại của timeline (cursor)", "—"],
          ['"tênLabel" / "tênLabel+=0.3"', "vị trí của label đã addLabel() (kèm lệch thêm nếu có)", "—"],
        ])}

        <h2>Methods</h2>
        {attrsTable([
          [".to/.from/.fromTo(target, vars, position?)", "thêm tween con. Nhận stagger nhưng không nhận onScroll riêng — đặt onScroll ở six.timeline({ onScroll }) cho cả timeline", "—"],
          [".set(target, vars, position?)", "tween duration 0 — set giá trị ngay khi timeline chạy tới vị trí đó", "—"],
          [".call(fn, position?)", "chèn một callback (không animate gì) vào đúng vị trí đó", "—"],
          [".add(childAnimation, position?)", "gắn một Tween/Timeline đã tạo sẵn (vd lồng timeline con) vào vị trí đó", "—"],
          [".addLabel(name, position?)", "đặt tên cho một vị trí để tham chiếu lại bằng chuỗi position sau này", "—"],
          [".getLabelTime(name)", "đọc lại thời điểm (giây) của một label", "—"],
        ])}

        <h2>Vars khi tạo timeline</h2>
        {attrsTable([
          ["defaults", "giá trị mặc định cho mọi .to/.from/.fromTo trong timeline này — khỏi lặp lại duration/ease mỗi lần gọi", "TweenVars", "—"],
          ["onScroll", "biến cả timeline thành scroll-driven — phải tự khai trigger vì timeline không có target mặc định", "OnScrollVars", "—"],
        ])}
        <p></p>
        {codeBlock(
          `const tl = six.timeline({ defaults: { duration: 0.4, ease: "quadOut" } });
tl.to(".a", { x: 100 })
.to(".b", { x: 100 }, "<"); // cả 2 dùng chung duration/ease ở trên`,
          "js",
        )}

        <p>
          Timeline kế thừa toàn bộ <a href="#tween/to">API vòng đời của Animation</a>, và nhận cả <code>repeat</code>/<code>repeatDelay</code>/<code>boomerang</code>/<code>delay</code> như một tween bình
          thường — lặp lại/đảo chiều cả cụm bên trong như một khối duy nhất.
        </p>
        <p class="note">
          Có thể lồng timeline trong timeline bằng <code>.add(timelineKhác, position)</code> — pause/reverse ở timeline cha vẫn hoạt động đúng cho timeline con bên trong.
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
    lead: "Truyền stagger vào vars của to/from/fromTo khi target khớp nhiều phần tử — mỗi phần tử chạy tween riêng, lệch nhau một khoảng delay.",
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
          Dùng <code>stagger</code> trực tiếp trong <code>six.to()</code>/<code>from()</code>/<code>fromTo()</code> sẽ trả về một <code>Timeline</code> gộp toàn bộ tween con — pause/reverse/kill được cả nhóm
          cùng lúc.
        </p>
        <p class="note">
          Dùng được y hệt bên trong <code>timeline.to/from/fromTo(...)</code> — các tween con được thêm vào đúng vị trí đó trên timeline.
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
};
