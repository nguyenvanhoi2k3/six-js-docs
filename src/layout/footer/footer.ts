export function renderFooter(): string {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container">© ${year} six-js — Author: <strong>Nguyen Van Hoi</strong></div>
    </footer>
  `;
}
