import "./index.scss";
import { CHECKLIST, type ChecklistGroup, type ChecklistSection } from "./data";
import { connectChecklistSync } from "./sync";
import { STATUS_TEXT } from "../../lib/realtime-db";
import { h, Fragment } from "../../jsx";

const STORAGE_KEY = "six-js-theme-checklist";
const SOURCE_URL = "https://shopify.dev/docs/storefronts/themes/store/requirements";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Escape HTML rồi đổi `code` → <code>, **đậm** → <strong>. */
function rich(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function sectionItemIds(section: ChecklistSection): string[] {
  const count = section.groups.reduce((sum, g) => sum + g.items.length, 0);
  return Array.from({ length: count }, (_, i) => `${section.id}-${i}`);
}

const TOTAL_ITEMS = CHECKLIST.reduce((sum, s) => sum + sectionItemIds(s).length, 0);

function renderTerms(terms: NonNullable<ChecklistGroup["terms"]>): string {
  return (
    <table class="content-pane__attrs checklist-terms">
      <thead>
        <tr>
          <th>Nên dùng</th>
          <th>Không dùng</th>
        </tr>
      </thead>
      <tbody>
        {terms.map(([use, avoid]) => (
          <tr>
            <td>{escapeHtml(use)}</td>
            <td>{escapeHtml(avoid)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderSection(section: ChecklistSection, index: number): string {
  let itemIndex = 0;
  const total = sectionItemIds(section).length;

  const groups = section.groups.map((group) => (
    <div class="checklist-group">
      {group.title ? (
        <h3 class="checklist-group__title">
          {group.title}
          {group.recommended ? <span class="badge">Khuyến nghị</span> : ""}
        </h3>
      ) : (
        ""
      )}
      {group.note ? <p class="checklist-group__note">{rich(group.note)}</p> : ""}
      <ul class="checklist-items">
        {group.items.map((item) => {
          const id = `${section.id}-${itemIndex++}`;
          return (
            <li class="checklist-item" data-item={id}>
              <label>
                <input type="checkbox" data-check={id} />
                <span>{rich(item)}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {group.terms ? renderTerms(group.terms) : ""}
    </div>
  ));

  return (
    <section class="checklist-section" id={section.id} data-section={section.id}>
      <h2 class="checklist-section__title">
        <span class="checklist-section__num">{index + 1}</span>
        <span>{section.title}</span>
        <span class="checklist-section__count" data-section-count={section.id}>
          0/{total}
        </span>
      </h2>
      {section.intro ? <p class="checklist-section__intro">{rich(section.intro)}</p> : ""}
      {groups}
      {section.note ? <div class="callout">{rich(section.note)}</div> : ""}
    </section>
  );
}

export function renderChecklistSidebar(): string {
  return (
    <>
      <p class="section-sidebar__heading">Theme Store checklist</p>
      <ul class="nav-tree nav-tree__flat checklist-nav">
        {CHECKLIST.map((section, i) => (
          <li>
            <a href={`#${section.id}`} data-slug={section.id}>
              <span class="checklist-nav__label">
                {i + 1}. {section.title}
              </span>
              <span class="checklist-nav__count" data-nav-count={section.id}>
                0/{sectionItemIds(section).length}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function renderChecklist(): string {
  return (
    <article class="content-pane checklist">
      <span class="content-pane__eyebrow">Shopify Theme Store</span>
      <h1>Checklist yêu cầu theme</h1>
      <p class="content-pane__lead">
        Những yêu cầu theme phải đạt để được duyệt lên Shopify Theme Store — dịch và rút gọn từ{" "}
        <a href={SOURCE_URL} target="_blank" rel="noopener">
          tài liệu chính thức của Shopify
        </a>
        . Tick từng mục khi đã kiểm tra xong
      </p>

      <div class="callout">
        Theme và mọi preset phải đạt <strong>tất cả</strong> yêu cầu (trừ các nhóm ghi “Khuyến nghị”). Thiếu một mục là bị từ chối, phải sửa xong mới
        nộp lại được. Theme test sơ sài sẽ bị loại ngay mà không được xem xét tiếp; lặp lại lỗi nhiều lần có thể bị tạm khóa hoặc từ chối vĩnh
        viễn.
      </div>

      <div class="checklist-toolbar">
        <div class="checklist-progress">
          <div class="checklist-progress__text">
            Đã xong <strong data-progress-done>0</strong>/{TOTAL_ITEMS} mục
            <span class="checklist-progress__percent" data-progress-percent>
              0%
            </span>
          </div>
          <div class="checklist-progress__bar">
            <span data-progress-bar />
          </div>
        </div>
        <div class="checklist-toolbar__actions">
          <span class="sync-status" data-sync-status="local" />
          <label class="checklist-toggle">
            <input type="checkbox" data-hide-done /> Ẩn mục đã xong
          </label>
          <button type="button" class="btn btn--ghost btn--sm" data-reset>
            Đặt lại
          </button>
        </div>
      </div>

      {CHECKLIST.map(renderSection)}
    </article>
  );
}

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []);
  } catch {
    return new Set();
  }
}

function saveChecked(checked: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  } catch {
    /* private mode / storage bị chặn — vẫn dùng được, chỉ không lưu lại */
  }
}

function revealInside(el: HTMLElement, container: HTMLElement): void {
  const c = container.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const pad = 8;
  if (container.scrollHeight > container.clientHeight) {
    if (r.top < c.top) container.scrollTop -= c.top - r.top + pad;
    else if (r.bottom > c.bottom) container.scrollTop += r.bottom - c.bottom + pad;
  }
  if (container.scrollWidth > container.clientWidth) {
    if (r.left < c.left) container.scrollLeft -= c.left - r.left + pad;
    else if (r.right > c.right) container.scrollLeft += r.right - c.right + pad;
  }
}

export function initChecklist(root: HTMLElement, sidebar: HTMLElement): void {
  const checked = loadChecked();
  const article = root.querySelector<HTMLElement>(".checklist")!;
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>("[data-check]"));
  const doneEl = root.querySelector<HTMLElement>("[data-progress-done]")!;
  const percentEl = root.querySelector<HTMLElement>("[data-progress-percent]")!;
  const barEl = root.querySelector<HTMLElement>("[data-progress-bar]")!;

  function update(): void {
    inputs.forEach((input) => {
      const isDone = checked.has(input.dataset.check!);
      input.checked = isDone;
      input.closest(".checklist-item")!.classList.toggle("is-done", isDone);
    });

    let doneTotal = 0;
    CHECKLIST.forEach((section) => {
      const ids = sectionItemIds(section);
      const done = ids.filter((id) => checked.has(id)).length;
      doneTotal += done;
      const label = `${done}/${ids.length}`;
      const complete = done === ids.length;
      root.querySelector(`[data-section-count="${section.id}"]`)!.textContent = label;
      root.querySelector(`[data-section="${section.id}"]`)!.classList.toggle("is-complete", complete);
      const navCount = sidebar.querySelector(`[data-nav-count="${section.id}"]`)!;
      navCount.textContent = label;
      navCount.classList.toggle("is-complete", complete);
    });

    const percent = Math.round((doneTotal / TOTAL_ITEMS) * 100);
    doneEl.textContent = String(doneTotal);
    percentEl.textContent = `${percent}%`;
    barEl.style.width = `${percent}%`;
  }

  const statusEl = root.querySelector<HTMLElement>("[data-sync-status]")!;

  // localStorage làm bộ nhớ đệm để hiện tick ngay khi mở trang; khi có sync thì server là nguồn chính.
  const sync = connectChecklistSync({
    onRemote(ids) {
      checked.clear();
      ids.forEach((id) => checked.add(id));
      saveChecked(checked);
      update();
    },
    onStatus(status) {
      statusEl.dataset.syncStatus = status;
      statusEl.textContent = STATUS_TEXT[status];
    },
  });

  root.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    if (input.dataset.check) {
      if (input.checked) checked.add(input.dataset.check);
      else checked.delete(input.dataset.check);
      saveChecked(checked);
      update();
      sync?.setItem(input.dataset.check, input.checked);
    } else if (input.hasAttribute("data-hide-done")) {
      article.classList.toggle("is-hide-done", input.checked);
    }
  });

  root.querySelector("[data-reset]")!.addEventListener("click", () => {
    const message = sync ? "Bỏ tick toàn bộ checklist? Thao tác này áp dụng cho tất cả mọi người." : "Bỏ tick toàn bộ checklist?";
    if (!checked.size || !confirm(message)) return;
    checked.clear();
    saveChecked(checked);
    update();
    sync?.clearAll();
  });

  update();

  // Highlight mục đang xem trên sidebar.
  const links = Array.from(sidebar.querySelectorAll<HTMLAnchorElement>("[data-slug]"));
  const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-section]"));
  let ticking = false;
  let activeId = "";

  function syncActive(): void {
    ticking = false;
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) + 120;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top - offset <= 0) current = section;
      else break;
    }
    // Cuộn chạm đáy trang thì section cuối là mục đang xem, dù tiêu đề chưa chạm đỉnh.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
    if (current.id === activeId) return;
    activeId = current.id;
    links.forEach((a) => {
      const active = a.dataset.slug === activeId;
      a.classList.toggle("is-active", active);
      if (active) {
        // Chỉ cuộn bên trong sidebar (dọc trên desktop, ngang trên mobile) — không đụng tới scroll của trang.
        revealInside(a, sidebar);
        revealInside(a, a.closest("ul")!);
      }
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncActive);
    },
    { passive: true },
  );

  // Nội dung được render bằng JS nên trình duyệt có thể chưa nhảy tới #hash khi mở link trực tiếp.
  const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  target?.scrollIntoView();
  syncActive();
}
