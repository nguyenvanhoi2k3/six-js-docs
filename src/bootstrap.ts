import "@six-js/core/style.css";
import { enableElements } from "@six-js/core";

// enableElements() chỉ cần gọi 1 lần cho toàn bộ page — mọi custom element (sx-dialog,
// sx-slider, sx-marquee, sx-animate, ...) render ra sau đó (kể cả qua innerHTML) tự upgrade,
// không cần gọi lại mỗi khi route/nội dung thay đổi. Import file này một lần duy nhất ở đầu
// mỗi entry (`main.ts`, từng file trong `pages/`) thay vì tự import "@six-js/core/style.css"
// + gọi enableElements() rải rác ở nhiều nơi.
enableElements();
