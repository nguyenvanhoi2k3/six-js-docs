# six-js-docs

Docs/showcase site for [`six-js`](../six-js) (`@six-js/core`). Sticky header (Logo / Installation / Components / Animatable / Showcase). Components is docs-only with live demos split out to a separate bare `demo.html`; Animatable keeps docs + live demos together with an accordion sidebar.

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

The 6 HTML entry points (`index.html`, `installation.html`, `components.html`, `animatable.html`, `showcase.html`, `demo.html`) stay flat at the project root — that's a Vite requirement for `rollupOptions.input` to keep producing flat `/name.html` URLs at the domain root (see Build & Deploy below); moving them into a subfolder would nest that same path into `dist/`, breaking the deploy story. Everything else under `src/` is grouped by what you'd actually go looking for:

```text
src/
  main.ts                        home/hero page script (for index.html)
  pages/                         one script per HTML entry, wires header + page content together
    components.ts / animatable.ts / installation.ts / showcase.ts / demo.ts
  layout/                        site chrome, nothing content-specific
    header/       header.ts (sticky header markup) + theme.ts (dark/light toggle)
    nav/          nav-data.ts (componentsList flat list + animatableNav tree) + sidebar.ts (renderFlatSidebar + renderSidebar)
    animatable-router/   section-router.ts + content-types.ts — Animatable's #group/item hash router only
  content/                       the actual docs/demo copy, one folder per section
    shared.ts       attrsTable()/codeBlock() helpers used everywhere
    components/      index.ts (aggregator) + types.ts, one subfolder per component:
                        dialog/index.ts + index.css
                        slider/index.ts + index.css
                        marquee/index.ts + index.css
                        animate/index.ts + index.css
    animatable/       index.ts — six.* API docs + inline demos
    installation/     index.ts — install/import instructions
    showcase/         index.ts — showcase card data
  styles/
    tokens.css        brand palette + spacing/type scale as CSS custom properties
    base.css          reset + site-wide layout/chrome only (container, header, sidebar/content grid, buttons, cards, code blocks, callouts) — no component-demo CSS lives here, see below
```

- **Components** section is docs-only (no embedded live widgets): flat sidebar (Dialog / Slider / Marquee / Animate, alphabetical, no dropdown) + a hash-routed (`#dialog`) content pane with just the attribute table, one plain-HTML code sample, and a "Xem demo ↗" button. Each component has its own folder under `src/content/components/` (e.g. `dialog/index.ts` + `dialog/index.css`) — open that one folder to see and edit both the demo markup and the CSS that styles it, nothing mixed in with the other components. `src/content/components/index.ts` is just a thin aggregator that imports the four and exports `componentsDocs: ComponentDoc[]`.
- **`demo.html`** is the bare page the "Xem demo" button opens (new tab, no header/site chrome at all). Reads `?c=<component>` from the query string and renders *every* live demo for that component stacked on one page, each in its own `<section id="dialog-basic">`, plus a local left sidebar (`ComponentDoc.demos`) of in-page anchor links that scroll-jump to each section (native `<a href="#dialog-basic">` + `scroll-behavior: smooth` — no JS involved in the scrolling itself).
- **Animatable** keeps docs + live demos together (unchanged from before — only Components was restructured to split them apart): sidebar *with* accordion dropdowns (`src/layout/nav/sidebar.ts`'s `renderSidebar()`) + hash-routed (`#group/item`) content pane driven by `src/layout/animatable-router/section-router.ts`.
- To add a new **component**: create `src/content/components/<name>/index.ts` (+ `index.css` if it needs its own demo styling) exporting a `ComponentDoc` (attrs table + code sample in `render()`, each live demo in the `demos[]` array as `{ slug, label, renderDemo, initDemo? }`), then add it to the array in `src/content/components/index.ts`. No nav-data, sidebar, or new HTML file needed — `pages/components.ts`/`pages/demo.ts` both read `componentsDocs` directly.
- To add a new **Animatable** entry: add a leaf to `animatableNav` in `src/layout/nav/nav-data.ts`, then a matching `"group/item"` key in `src/content/animatable/index.ts`.

## Build & Deploy

```bash
npm run build      # -> dist/ (6 static HTML pages + hashed JS/CSS bundles)
npm run preview    # sanity-check the production build locally before deploying
```

`dist/` is a plain static site — no server-side code, no API, nothing that needs Node at runtime:

- Navigation between the 6 pages (`index.html`, `installation.html`, `components.html`, `animatable.html`, `showcase.html`, `demo.html`) is regular `<a href>` links.
- Navigation *within* Components (`#dialog`) and Animatable (`#group/item`) is hash-based client-side routing; `demo.html` picks its component from a `?c=` query param and scrolls between its sections via plain in-page anchors. None of it needs server rewrite/redirect rules.

That means it can be dropped as-is onto any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 (+ CloudFront), a plain nginx `root`, etc. — with no special config.

The one exception: if the site is served from a **sub-path** instead of the domain root (e.g. a GitHub Pages project page like `username.github.io/six-js-docs/` without a custom domain), set `base: "/six-js-docs/"` in `vite.config.ts` before running `npm run build`, since every asset/icon reference here is root-relative (`/assets/...`, `/sixjs_logo_*.svg`). Deploying at the domain root (or with a custom domain) needs no change.
