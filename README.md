# six-js-docs

Docs/showcase site for [`six-js`](../six-js) (`@six-js/core`). Sticky header (Logo / Installation / Components / Core / Plugins / Showcase). Components is docs-only with live demos split out to a separate bare `demo.html`; Core and Plugins keep docs + live demos together with an accordion sidebar.

## Setup

This project depends on `@six-js/core` via a local `file:../six-js` dependency — it is **not** published to npm. Before installing here, make sure the library is built:

```bash
cd ../six-js
npm run build
```

Then, in this project:

```bash
npm install
npm run dev
```

If you rebuild `six-js`, the change is picked up automatically (npm links `file:` dependencies as a symlink) — no need to reinstall here, just refresh the browser.

## Structure

The 7 HTML entry points (`index.html`, `installation.html`, `components.html`, `core.html`, `plugins.html`, `showcase.html`, `demo.html`) stay flat at the project root — that's a Vite requirement for `rollupOptions.input` to keep producing flat `/name.html` URLs at the domain root (see Build & Deploy below); moving them into a subfolder would nest that same path into `dist/`, breaking the deploy story. Everything else under `src/` is grouped by what you'd actually go looking for:

```text
src/
  main.ts                        home/hero page script (for index.html)
  pages/                         one script per HTML entry, wires header + page content together
    components.ts / core.ts / plugins.ts / installation.ts / showcase.ts / demo.ts
  layout/                        site chrome, nothing content-specific
    header/       header.ts (sticky header markup) + theme.ts (dark/light toggle)
    nav/          nav-data.ts (componentsList flat list + coreNav/pluginsNav trees) + sidebar.ts (renderFlatSidebar + renderSidebar)
    section-router/   section-router.ts + content-types.ts — the shared #group/item hash router used by Core and Plugins
  content/                       the actual docs/demo copy, one folder per section
    shared.ts       attrsTable()/codeBlock() helpers used everywhere
    components/      index.ts (aggregator) + types.ts, one subfolder per component:
                        dialog/index.ts + index.scss
                        slider/index.ts + index.scss
                        marquee/index.ts + index.scss
    core/             index.ts — six.* animation engine API docs + inline demos
    plugins/          index.ts — SplitText/SmoothScroll/ScrambleText/Burst/SvgMotion docs + inline demos
    installation/     index.ts — install/import instructions
    showcase/         index.ts — showcase card data
  styles/
    tokens.css        brand palette + spacing/type scale as CSS custom properties
    base.css          reset + site-wide layout/chrome only (container, header, sidebar/content grid, buttons, cards, code blocks, callouts) — no component-demo CSS lives here, see below
```

- **Components** section is docs-only (no embedded live widgets): flat sidebar (Dialog / Marquee / Slider, alphabetical, no dropdown) + a hash-routed (`#dialog`) content pane with just the attribute table, one plain-HTML code sample, and a "Xem demo ↗" button. Each component has its own folder under `src/content/components/` (e.g. `dialog/index.ts` + `dialog/index.scss`) — open that one folder to see and edit both the demo markup and the CSS that styles it, nothing mixed in with the other components. `src/content/components/index.ts` is just a thin aggregator that imports them and exports `componentsDocs: ComponentDoc[]`.
- **`demo.html`** is the bare page the "Xem demo" button opens (new tab, no header/site chrome at all). Reads `?c=<component>` from the query string and renders *every* live demo for that component stacked on one page, each in its own `<section id="dialog-basic">`, plus a local left sidebar (`ComponentDoc.demos`) of in-page anchor links that scroll-jump to each section (native `<a href="#dialog-basic">` + `scroll-behavior: smooth` — no JS involved in the scrolling itself). This is the only page that registers the `sx-*` custom elements (`@six-js/core/Components`) and links `@six-js/core/components.css` — neither Core nor Plugins render any live `sx-*` markup, so neither needs to register anything.
- **Core** and **Plugins** both keep docs + live demos together: sidebar *with* accordion dropdowns (`src/layout/nav/sidebar.ts`'s `renderSidebar()`) + hash-routed (`#group/item`) content pane driven by the shared `src/layout/section-router/section-router.ts`.
- To add a new **component**: create `src/content/components/<name>/index.ts` (+ `index.scss` if it needs its own demo styling) exporting a `ComponentDoc` (attrs table + code sample in `render()`, each live demo in the `demos[]` array as `{ slug, label, renderDemo, initDemo? }`), then add it to the array in `src/content/components/index.ts`. No nav-data, sidebar, or new HTML file needed — `pages/components.ts`/`pages/demo.ts` both read `componentsDocs` directly.
- To add a new **Core** or **Plugins** entry: add a leaf to `coreNav`/`pluginsNav` in `src/layout/nav/nav-data.ts`, then a matching `"group/item"` key in `src/content/core/index.ts`/`src/content/plugins/index.ts`.

## Build & Deploy

```bash
npm run build      # -> dist/ (7 static HTML pages + hashed JS/CSS bundles)
npm run preview    # sanity-check the production build locally before deploying
```

`dist/` is a plain static site — no server-side code, no API, nothing that needs Node at runtime:

- Navigation between the 7 pages (`index.html`, `installation.html`, `components.html`, `core.html`, `plugins.html`, `showcase.html`, `demo.html`) is regular `<a href>` links.
- Navigation *within* Components (`#dialog`), Core, and Plugins (`#group/item`) is hash-based client-side routing; `demo.html` picks its component from a `?c=` query param and scrolls between its sections via plain in-page anchors. None of it needs server rewrite/redirect rules.

That means it can be dropped as-is onto any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 (+ CloudFront), a plain nginx `root`, etc. — with no special config.

The one exception: if the site is served from a **sub-path** instead of the domain root (e.g. a GitHub Pages project page like `username.github.io/six-js-docs/` without a custom domain), set `base: "/six-js-docs/"` in `vite.config.ts` before running `npm run build`, since every asset/icon reference here is root-relative (`/assets/...`, `/sixjs_logo_*.svg`). Deploying at the domain root (or with a custom domain) needs no change.
