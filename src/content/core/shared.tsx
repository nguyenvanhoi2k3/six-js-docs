import { h } from "../../jsx";

export function playgroundBox(label: string): string {
  return (
    <div class="content-pane__panel" style="align-items:center;">
      <div class="demo-animate-box" data-tw-box style="width:100px;flex:none;">
        {label}
      </div>
    </div>
  );
}
