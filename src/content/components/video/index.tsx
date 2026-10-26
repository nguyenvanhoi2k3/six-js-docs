import "./index.scss";
import { codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

export const video: ComponentDoc = {
  slug: "video",
  eyebrow: "sx-video",
  title: "Video",
  lead: "Bọc quanh một <video> tự viết tay — tự pause khi video cuộn ra khỏi viewport hoàn toàn, tự play lại khi cuộn vào, dành cho video nền autoplay+loop+muted.",
  demoSidebar: false,
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-video>
  <video src="/bg-loop.mp4" autoplay loop muted playsinline></video>
</sx-video>`)}
      <p class="note">
        Không tự sinh ra tag <code>&lt;video&gt;</code> — luôn cần tự viết tay bên trong. <span class="c-accent">sx-video</span> không có attribute riêng, chỉ đọc attribute của chính thẻ <code>video</code> con.
      </p>
      <p class="note">
        Chỉ can thiệp (pause khi ra khỏi viewport, play lại khi vào) nếu video con có attribute <code>autoplay</code>. Video không <code>autoplay</code> — vd người dùng đã tự bấm play qua controls — được bỏ qua hoàn toàn, không bị ép pause/play.
      </p>
      <p class="note">
        Tôn trọng <code>prefers-reduced-motion: reduce</code> — video dừng ngay ở khung hình đầu, không tự chạy lại khi cuộn vào viewport.
      </p>
    </>
  ),

  demos: [
    {
      renderDemo: () => (
        <div style="max-width:420px">
          <sx-video>
            <video
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              autoplay
              loop
              muted
              playsinline
              style="width:100%;border-radius:10px;display:block"
            ></video>
          </sx-video>
          <p class="note" style="margin-top:8px">Cuộn trang để video ra khỏi/vào lại viewport — trạng thái play/pause tự theo đó.</p>
        </div>
      ),
    },
  ],
};
