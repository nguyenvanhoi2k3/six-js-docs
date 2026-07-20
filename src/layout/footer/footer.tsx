import { h } from "../../jsx";

export function renderFooter(): string {
  const year = new Date().getFullYear();
  return (
    <footer class="site-footer">
      <div class="container">
        © {year} six-js — Author: <strong>Hoi Nguyen</strong>
      </div>
    </footer>
  );
}
