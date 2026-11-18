/**
 * Trình xem ảnh toàn màn hình cho Notes: lướt qua mọi ảnh trong trang (nút ‹ ›, phím ← →, vuốt),
 * dải ảnh thu nhỏ để nhảy nhanh, xem đúng kích thước gốc (phóng to), Copy / Download / mở ảnh gốc.
 */
import { copyOriginal, displayUrl, downloadOriginal } from "../../lib/cloudinary";

const svg = (paths: string) =>
  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ICON = {
  prev: svg('<path d="M12.5 4.5 7 10l5.5 5.5"/>'),
  next: svg('<path d="M7.5 4.5 13 10l-5.5 5.5"/>'),
  close: svg('<path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/>'),
  zoomIn: svg('<circle cx="9" cy="9" r="5.5"/><path d="M13 13l3.5 3.5M9 6.5v5M6.5 9h5"/>'),
  zoomOut: svg('<circle cx="9" cy="9" r="5.5"/><path d="M13 13l3.5 3.5M6.5 9h5"/>'),
  copy: svg('<rect x="7" y="7" width="9.5" height="9.5" rx="2"/><path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v6a1.5 1.5 0 0 0 1.5 1.5H7"/>'),
  download: svg('<path d="M10 3.5v9M6.25 9 10 12.75 13.75 9M4 15.75h12"/>'),
  open: svg('<path d="M11 4h5v5M16 4l-7 7M14 11.5V15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 15V7.5A1.5 1.5 0 0 1 5.5 6H9"/>'),
  done: svg('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
  failed: svg('<path d="M10 6v4.5M10 13.75v.01"/><circle cx="10" cy="10" r="7"/>'),
};

let viewer: HTMLElement | null = null;
let urls: string[] = [];
let index = 0;
let zoomed = false;
let restoreFocus: HTMLElement | null = null;

function el<T extends HTMLElement = HTMLElement>(selector: string): T {
  return viewer!.querySelector<T>(selector)!;
}

function build(): HTMLElement {
  const root = document.createElement("div");
  root.className = "np-viewer";
  root.hidden = true;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Image viewer");
  root.innerHTML = `
    <div class="np-viewer__bar">
      <span class="np-viewer__count" data-v-count></span>
      <span class="np-viewer__spacer"></span>
      <button type="button" data-v="zoom" title="Actual size (Z)">${ICON.zoomIn}</button>
      <button type="button" data-v="copy" title="Copy original image">${ICON.copy}</button>
      <button type="button" data-v="download" title="Download original image">${ICON.download}</button>
      <button type="button" data-v="open" title="Open original in new tab">${ICON.open}</button>
      <button type="button" data-v="close" title="Close (Esc)">${ICON.close}</button>
    </div>
    <div class="np-viewer__stage" data-v-stage>
      <img data-v-img alt="" />
    </div>
    <button type="button" class="np-viewer__nav np-viewer__nav--prev" data-v="prev" title="Previous (←)">${ICON.prev}</button>
    <button type="button" class="np-viewer__nav np-viewer__nav--next" data-v="next" title="Next (→)">${ICON.next}</button>
    <div class="np-viewer__thumbs" data-v-thumbs></div>
  `;
  document.body.appendChild(root);

  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const action = target.closest<HTMLElement>("[data-v]")?.dataset.v;
    const thumb = target.closest<HTMLElement>("[data-v-thumb]");
    if (thumb) return show(Number(thumb.dataset.vThumb));
    if (action === "close") return close();
    if (action === "prev") return show(index - 1);
    if (action === "next") return show(index + 1);
    if (action === "zoom") return setZoom(!zoomed);
    if (action === "open") return void window.open(urls[index], "_blank", "noopener");
    if (action === "copy" || action === "download") return runAction(target.closest("button")!, action);
    // Bấm vào ảnh → phóng to / thu lại; bấm ra nền tối → đóng.
    if (target.matches("[data-v-img]")) return setZoom(!zoomed);
    if (target.matches("[data-v-stage]")) close();
  });

  // Vuốt trái / phải trên điện thoại để chuyển ảnh.
  let touchX: number | null = null;
  root.addEventListener("touchstart", (e) => (touchX = zoomed ? null : e.touches[0].clientX), { passive: true });
  root.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });

  document.addEventListener("keydown", (e) => {
    if (!viewer || viewer.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key.toLowerCase() === "z") setZoom(!zoomed);
    else return;
    e.preventDefault();
  });

  return root;
}

function setZoom(on: boolean): void {
  zoomed = on;
  viewer!.classList.toggle("is-zoomed", on);
  const img = el<HTMLImageElement>("[data-v-img]");
  // Phóng to = xem ảnh gốc đúng kích thước thật (cuộn để xem hết); thu lại = vừa màn hình.
  if (on) img.src = urls[index];
  const zoomBtn = el('[data-v="zoom"]');
  zoomBtn.innerHTML = on ? ICON.zoomOut : ICON.zoomIn;
  zoomBtn.title = on ? "Fit to screen (Z)" : "Actual size (Z)";
}

function show(next: number): void {
  if (!urls.length) return;
  index = (next + urls.length) % urls.length; // vòng tròn: ảnh cuối → ảnh đầu
  setZoom(false);
  const img = el<HTMLImageElement>("[data-v-img]");
  img.src = displayUrl(urls[index], 2400);
  el("[data-v-count]").textContent = urls.length > 1 ? `${index + 1} / ${urls.length}` : "";
  viewer!.classList.toggle("is-single", urls.length < 2);
  viewer!.querySelectorAll<HTMLElement>("[data-v-thumb]").forEach((thumb) => {
    const active = Number(thumb.dataset.vThumb) === index;
    thumb.classList.toggle("is-active", active);
    if (active) thumb.scrollIntoView({ block: "nearest", inline: "center" });
  });
  // Tải trước ảnh kế tiếp để chuyển ảnh không phải chờ.
  if (urls.length > 1) new Image().src = displayUrl(urls[(index + 1) % urls.length], 2400);
}

function runAction(button: HTMLButtonElement, action: "copy" | "download"): void {
  const icon = button.innerHTML;
  button.disabled = true;
  (action === "copy" ? copyOriginal(urls[index]) : downloadOriginal(urls[index]))
    .then(() => {
      button.innerHTML = ICON.done;
      button.dataset.state = "done";
    })
    .catch(() => {
      button.innerHTML = ICON.failed;
      button.dataset.state = "failed";
    })
    .finally(() => {
      button.disabled = false;
      window.setTimeout(() => {
        button.innerHTML = icon;
        delete button.dataset.state;
      }, 2500);
    });
}

function close(): void {
  if (!viewer) return;
  viewer.hidden = true;
  document.documentElement.style.overflow = "";
  restoreFocus?.focus({ preventScroll: true });
}

export function openImageViewer(list: string[], start: number): void {
  if (!list.length) return;
  viewer ??= build();
  urls = list;
  restoreFocus = document.activeElement as HTMLElement | null;
  el("[data-v-thumbs]").innerHTML = list
    .map((url, i) => `<button type="button" data-v-thumb="${i}" title="Image ${i + 1}"><img src="${displayUrl(url, 200).replace(/"/g, "&quot;")}" alt="" loading="lazy" /></button>`)
    .join("");
  viewer.hidden = false;
  document.documentElement.style.overflow = "hidden";
  show(Math.max(0, start));
  el<HTMLButtonElement>('[data-v="close"]').focus({ preventScroll: true });
}
