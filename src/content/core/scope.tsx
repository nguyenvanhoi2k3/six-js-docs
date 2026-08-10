import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";

export const scopeContent: ContentMap = {
  "scope/context": {
    eyebrow: "Core",
    title: "six.context()",
    lead: "Gom mọi Tween/Timeline (hoặc bất kỳ thứ gì có .kill()) tạo ra bên trong vào một scope, để dọn dẹp hàng loạt bằng một lần revert()/kill().",
    render: () => (
      <>
        {codeBlock(
          `const scope = six.context((self) => {
  // mọi animation tạo ở đây tự được scope bắt, dọn khi revert()/kill()
  six.to(".hero", { x: 40, duration: 0.4 });

  // thêm thủ công những thứ khác cần dọn (ResizeObserver, event listener...) qua self.add()
  const ro = new ResizeObserver(() => {});
  ro.observe(document.body);
  self.add({ kill: () => ro.disconnect() });
});

// dọn dẹp toàn bộ khi component unmount, có thể run() lại sau đó
scope.revert();

// giống revert() nhưng đánh dấu scope đã "chết" — run() sau đó sẽ throw
scope.kill();

// bọc callback chạy sau (event listener, timeout) để animation bên trong
// vẫn được scope capture như bình thường
button.addEventListener("click", scope.scope(() => {
  six.to(".hero", { x: 80, duration: 0.3 });
}));`,
          "js",
        )}

        {attrsTable([
          ["context(fn?)", "tạo Context mới; nếu truyền fn, gọi run(fn) ngay lập tức", "—"],
          ["scope.run(fn)", "chạy fn với scope này đang active — animation tạo bên trong tự được capture", "—"],
          ["scope.scope(fn)", "bọc fn thành hàm mới — mỗi lần gọi (kể cả sau này, từ event listener/timeout), animation tạo bên trong vẫn tự capture vào scope", "—"],
          ["scope.add(target)", "thêm thủ công một Killable (bất kỳ gì có .kill()) để dọn cùng lúc revert()", "—"],
          ["scope.revert()", "kill toàn bộ đối tượng đã capture. Scope vẫn dùng lại được — gọi run() tiếp", "—"],
          ["scope.kill()", "revert() + đánh dấu scope đã chết — gọi run() sau đó sẽ throw", "—"],
          ["scope.isDead", "getter — true sau khi đã kill()", "—"],
        ])}

        <p class="note">
          Cần bật/tắt animation theo breakpoint (<code>window.matchMedia</code>)? Dùng <a href="#scope/breakpoint">six.breakpoint()</a> — cũng auto-capture y hệt, khỏi tự lắng nghe matchMedia tay.
        </p>
      </>
    ),
  },

  "scope/breakpoint": {
    eyebrow: "Core",
    title: "six.breakpoint()",
    lead: "Setup/teardown animation theo media query, tự chạy lại khi điều kiện đổi — khỏi tự lắng nghe window.matchMedia() rồi if/else + kill() tay.",
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
          [".revert()", "dọn phần đang active của mọi add() (kill animation, chạy cleanup) nhưng vẫn tiếp tục lắng nghe", "—"],
          [".kill()", "revert() + gỡ hẳn mọi MediaQueryList listener — instance chết hẳn, add() sau sẽ throw", "—"],
        ])}

        <p class="note">
          Tạo breakpoint bên trong một <code>six.context()</code> đang active thì cả cụm cũng tự được scope ngoài capture — dọn cùng lúc khi scope ngoài <code>revert()</code>/<code>kill()</code>.
        </p>
        <p>
          Chỉ cần một điều kiện đơn? Dùng thẳng <code>six.breakpoint(query, callback)</code> khỏi gọi <code>.add()</code> riêng.
        </p>

        <h2>ctx.scope()</h2>
        <p>
          Animation tạo ngay trong callback tự được <code>ctx</code> capture. Nhưng animation tạo bên trong một event listener gắn từ callback đó (chạy sau) thì không tự capture — trừ khi bọc qua{" "}
          <code>ctx.scope(fn)</code>. Bấm "Pulse A" rồi "Pulse B" cho cả hai quay vô hạn, rồi bấm "Kill" để so sánh:
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
    six.to(boxA, { rotate: 360, duration: 3, repeat: -1, ease: "none" }); // không capture
  });

  btnB.addEventListener("click", ctx.scope(() => {
    six.to(boxB, { rotate: 360, duration: 3, repeat: -1, ease: "none" }); // capture nhờ ctx.scope()
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
};
