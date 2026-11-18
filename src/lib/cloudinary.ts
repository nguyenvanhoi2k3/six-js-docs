/**
 * Upload ảnh lên Cloudinary thẳng từ trình duyệt bằng "unsigned upload preset" (không cần server,
 * không lộ API secret). Preset được tạo trong Cloudinary Console → Settings → Upload → Upload presets,
 * Signing mode = Unsigned, đúng tên UPLOAD_PRESET bên dưới.
 */
export const CLOUD_NAME = "dv6yprydl";
export const UPLOAD_PRESET = "six_js_notes";
/** Giới hạn của gói Cloudinary Free cho 1 ảnh. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

/** Upload 1 file ảnh; `onProgress` nhận 0 → 1. */
export function uploadImage(file: File, onProgress?: (ratio: number) => void): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Only image files can be uploaded."));
    if (file.size > MAX_IMAGE_BYTES) return reject(new Error("Image is larger than 10 MB."));

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);

    // XHR thay vì fetch để có tiến độ upload.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    });
    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText) as { secure_url?: string; width?: number; height?: number; error?: { message?: string } };
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve({ url: data.secure_url, width: data.width ?? 0, height: data.height ?? 0 });
        } else {
          reject(new Error(data.error?.message ?? `Upload failed (${xhr.status}).`));
        }
      } catch {
        reject(new Error(`Upload failed (${xhr.status}).`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error while uploading.")));
    xhr.send(form);
  });
}

/**
 * URL để hiển thị trong trang: Cloudinary tự chọn định dạng/chất lượng và thu nhỏ tối đa `width` px.
 * Ảnh gốc giữ nguyên — Copy / Download / mở tab mới đều dùng URL gốc. Ảnh từ nơi khác giữ nguyên URL.
 */
export function displayUrl(url: string, width = 1600): string {
  const marker = `res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
  const at = url.indexOf(marker);
  if (at < 0) return url;
  const end = at + marker.length;
  return `${url.slice(0, end)}f_auto,q_auto,c_limit,w_${width}/${url.slice(end)}`;
}

/** Tải file ảnh gốc về dạng Blob (Cloudinary cho phép gọi từ trình duyệt — CORS mở). */
async function fetchOriginal(url: string): Promise<Blob> {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}

/** Tải ảnh gốc về máy với tên file gốc. */
export async function downloadOriginal(url: string): Promise<void> {
  const blob = await fetchOriginal(url);
  const name = decodeURIComponent(new URL(url).pathname.split("/").pop() || "image");
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 10_000);
}

/**
 * Copy ảnh gốc (đủ độ phân giải) vào clipboard. Clipboard của trình duyệt chỉ nhận PNG, nên ảnh
 * định dạng khác được vẽ lại sang PNG ở đúng kích thước gốc (giữ nguyên từng điểm ảnh).
 */
export async function copyOriginal(url: string): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("Clipboard is not supported in this browser.");
  // Truyền Promise vào ClipboardItem để Safari vẫn coi là thao tác của người dùng.
  const png = fetchOriginal(url).then(async (blob) => {
    if (blob.type === "image/png") return blob;
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
    return new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't convert image."))), "image/png"));
  });
  await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
}
