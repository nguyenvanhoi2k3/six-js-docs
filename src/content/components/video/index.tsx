import "./index.scss";
import { codeBlock } from "../../shared";
import type { ComponentDoc } from "../types";
import { h, Fragment } from "../../../jsx";

const VIDEO_SRC = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const VIDEO_CSS = `.video-demo {
  max-width: 480px;
}

.video-demo video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 12px;
  background: #000;
}`;

const LOG_CSS = `.log {
  margin-top: 12px;
  width: min(100%, 480px);
  height: 120px;
  overflow-y: auto;
  background: #0f1013;
  border: 1px solid #2a2d33;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: monospace;
  font-size: 12px;
  color: #7ee787;
}`;

// Ghi lại event play/pause gốc của thẻ <video> vào khung log - để sau khi cuộn đi rồi quay lại
// vẫn thấy được video đã pause/play lúc nào (lúc đó chính video cũng đã ra khỏi màn hình).
const logPlayPause = (root: HTMLElement) => {
  const video = root.querySelector("video");
  const log = root.querySelector<HTMLElement>("[data-video-log]");
  if (!video || !log) return;
  const write = (msg: string) => {
    const line = document.createElement("div");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  };
  video.addEventListener("play", () => write("play"));
  video.addEventListener("pause", () => write("pause"));
};

export const video: ComponentDoc = {
  slug: "video",
  eyebrow: "sx-video",
  title: "Video",
  lead: "Bọc quanh một &lt;video&gt; tự viết tay — tự pause khi video cuộn ra khỏi viewport hoàn toàn, tự play lại khi cuộn vào, dành cho video nền autoplay+loop+muted.",
  render: () => (
    <>
      <h2>Code</h2>
      {codeBlock(`<sx-video>
  <video src="/bg-loop.mp4" autoplay loop muted playsinline></video>
</sx-video>`)}
      <p class="note">
        Không tự sinh ra tag <code>{"&lt;video&gt;"}</code> — luôn cần tự viết tay bên trong. <span class="c-accent">sx-video</span> không có attribute riêng, chỉ đọc attribute của chính thẻ <code>video</code> con.
      </p>
      <p class="note">
        Video ra khỏi viewport hoàn toàn thì luôn được pause. Khi cuộn vào lại, chỉ video có <code>autoplay</code> mới tự play tiếp — video không <code>autoplay</code> (người dùng tự bấm play qua controls) giữ nguyên trạng thái pause, để người dùng tự quyết định
        có xem tiếp hay không.
      </p>
      <p class="note">
        Tôn trọng <code>prefers-reduced-motion: reduce</code> — video dừng ngay ở khung hình đầu, không tự chạy lại khi cuộn vào viewport.
      </p>
    </>
  ),

  demoSidebar: true,

  // ---- Demos: mỗi mục render 3 tab (Demo / HTML / CSS) trên trang demo.html ----
  demos: [
    {
      label: "Video nền (autoplay)",
      html: `<p class="note">Cuộn xuống cho video ra khỏi màn hình hẳn rồi cuộn lại — log bên dưới ghi lại lúc video tự pause và tự play lại.</p>
<div class="video-demo">
  <sx-video>
    <video src="${VIDEO_SRC}" autoplay loop muted playsinline></video>
  </sx-video>
</div>
<div class="log" data-video-log></div>`,
      css: `${VIDEO_CSS}

${LOG_CSS}`,
      initDemo: logPlayPause,
    },
    {
      label: "Không autoplay (có controls)",
      html: `<p class="note">Bấm play, cuộn cho video ra khỏi màn hình rồi quay lại — video đã bị pause và giữ nguyên pause, không tự play tiếp.</p>
<div class="video-demo">
  <sx-video>
    <video src="${VIDEO_SRC}" controls loop muted playsinline></video>
  </sx-video>
</div>
<div class="log" data-video-log></div>`,
      css: `${VIDEO_CSS}

${LOG_CSS}`,
      initDemo: logPlayPause,
    },
  ],
};
