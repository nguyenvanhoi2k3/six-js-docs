import { six } from "@six-js/core";
import type { ContentMap } from "../../layout/section-router/content-types";
import { attrsTable, codeBlock } from "../shared";
import { h, Fragment } from "../../jsx";
import { playgroundBox } from "./shared";

export const utilsContent: ContentMap = {
  "utils/set": {
    eyebrow: "Core",
    title: "six.set()",
    lead: "Áp giá trị ngay lập tức, không có animation (tween với duration 0) — dùng để đặt trạng thái khởi tạo.",
    render: () => (
      <>
        {playgroundBox("set()")}
        <div class="content-pane__panel">
          <button class="btn btn--primary btn--sm" data-run>
            Chạy six.set()
          </button>
        </div>

        {codeBlock(`six.set(".box", { rotate: 45, backgroundColor: "#ff6b4a" });`, "js")}
      </>
    ),
    init: (root) => {
      const box = root.querySelector<HTMLElement>("[data-tw-box]")!;
      const btn = root.querySelector<HTMLButtonElement>("[data-run]")!;
      let toggled = false;
      btn.addEventListener("click", () => {
        toggled = !toggled;
        six.set(box, toggled ? { rotate: 45, backgroundColor: "#ff6b4a" } : { rotate: 0, backgroundColor: "" });
      });
    },
  },

  "utils/config": {
    eyebrow: "Core",
    title: "six.config()",
    lead: "Đặt duration/ease mặc định toàn cục cho mọi to/from/fromTo/timeline gọi sau đó, khỏi phải lặp lại ở từng lời gọi.",
    render: () => (
      <>
        {codeBlock(
          `six.config({
  duration: 0.5,
  ease: "quadOut",
});

// từ đây trở đi, không truyền duration/ease vẫn dùng giá trị trên
six.to(".box", { x: 100 });`,
          "js",
        )}
        <p class="note">
          Mặc định <code>duration: 0.8</code>, <code>ease: "none"</code> (none alias linear).
        </p>
      </>
    ),
  },

  "utils/helpers": {
    eyebrow: "Core",
    title: "six.utils",
    lead: "Namespace gộp các hàm tiện ích dùng chung: chuẩn hoá target, chọn phần tử theo id/class, giới hạn số, lấy giá trị ngẫu nhiên.",
    render: () => (
      <>
        {codeBlock(
          `six.utils.arrayOf(".card");             // -> Element[] — chuẩn hoá selector/Element/NodeList/mảng thành Element[]
six.utils.getById("hero");              // -> HTMLElement | null (truyền id thuần, không có "#")
six.utils.getByClass("card");           // -> Element[] (truyền class thuần, không có ".")
six.utils.clamp(0, 100, 120);           // -> 100
const clamp01 = six.utils.clamp(0, 1);  // bỏ value -> trả về hàm curry (value) => number
six.utils.random(1, 10);                // -> số thực ngẫu nhiên trong [1, 10]
six.utils.random(1, 10, 1);             // -> snap theo bước 1 (số nguyên)
six.utils.random([1, 2, 3]);            // -> 1 phần tử ngẫu nhiên trong mảng`,
          "js",
        )}

        {attrsTable([
          ["arrayOf(target, scope?)", "chuẩn hoá mọi kiểu target six-js chấp nhận (selector, Element, NodeList, mảng...) thành Element[]", "—"],
          ["getById(id)", "document.getElementById — id thuần, không có dấu #", "—"],
          ["getByClass(className, scope?)", "document.getElementsByClassName — class thuần, không có dấu . ; scope mặc định là document", "—"],
          ["clamp(min, max, value?)", "giới hạn value trong [min, max]; bỏ value sẽ trả về hàm curry (value) => number", "—"],
          ["random(min, max, snap?, asFn?)", "số ngẫu nhiên trong [min, max], snap làm tròn theo bước, asFn=true trả về hàm sinh số thay vì 1 giá trị", "—"],
          ["random(array)", "trả về 1 phần tử ngẫu nhiên trong mảng", "—"],
        ])}
      </>
    ),
  },
};
