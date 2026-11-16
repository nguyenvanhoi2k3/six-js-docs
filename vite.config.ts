import { defineConfig, type Alias } from "vite";
import { resolve } from "path";

// `npm run dev:local` (vite --mode six-local - Vite cấm tên mode "local"): trỏ mọi import `@six-js/core[/...]` thẳng vào source
// của repo six-js bên cạnh (mặc định ../six-js, đổi bằng env SIX_JS_PATH) thay vì bản npm trong
// node_modules - để test thay đổi của core trên docs trước khi publish. Map subpath giống
// `libEntries` trong six-js/vite.config.ts. Source six-js tự import CSS của từng component, nên
// `components.css` được alias tới một file rỗng để không nạp thêm CSS cũ từ npm.
function sixJsLocalAliases(sixRoot: string): Alias[] {
  const src = resolve(sixRoot, "src");
  const subpaths: Record<string, string> = {
    OnScroll: "entries/on-scroll.ts",
    SmoothScroll: "entries/smooth-scroll.ts",
    SplitText: "entries/split-text.ts",
    ScrambleText: "entries/scramble-text.ts",
    Burst: "entries/burst.ts",
    SvgMotion: "entries/svg-motion.ts",
    Parallax: "entries/parallax.ts",
    Watcher: "entries/watcher.ts",
    Components: "components/index.ts",
    Cart: "entries/cart.ts",
  };
  return [
    { find: /^@six-js\/core\/components\.css$/, replacement: resolve(import.meta.dirname, "src/six-local-empty.css") },
    ...Object.entries(subpaths).map(([name, file]) => ({
      find: new RegExp(`^@six-js/core/${name}$`),
      replacement: resolve(src, file),
    })),
    { find: /^@six-js\/core$/, replacement: resolve(src, "index.ts") },
  ];
}

export default defineConfig(({ command, mode }) => {
  const sixRoot = resolve(import.meta.dirname, process.env.SIX_JS_PATH ?? "../six-js");
  const local = mode === "six-local";
  return {
  ...(local && {
    resolve: { alias: sixJsLocalAliases(sixRoot) },
    server: { fs: { allow: [import.meta.dirname, sixRoot] } },
    optimizeDeps: { exclude: ["@six-js/core"] },
  }),
  // GitHub Pages serves this project from /six-js-docs/, not the domain root, while Vercel
  // (detected via its VERCEL env var) serves it from the domain root - only matters for the
  // production build (dev server stays at "/" for local convenience). Every internal
  // link/asset path built at runtime (header nav, "Xem demo" buttons, in-content <a> refs) is
  // written as a plain relative path (no leading "/") specifically so it resolves correctly
  // under either base without needing this value threaded through the app - see the sibling
  // .html entries (already asset-referenced with a leading "/") which Vite itself rewrites
  // against `base` at build time.
  base: command === "build" ? (process.env.VERCEL ? "/" : "/six-js-docs/") : "/",
  esbuild: {
    jsxFactory: "h",
    jsxFragmentFactory: "Fragment",
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        installation: resolve(import.meta.dirname, "installation.html"),
        components: resolve(import.meta.dirname, "components.html"),
        core: resolve(import.meta.dirname, "core.html"),
        ease: resolve(import.meta.dirname, "ease.html"),
        plugins: resolve(import.meta.dirname, "plugins.html"),
        showcase: resolve(import.meta.dirname, "showcase.html"),
        demo: resolve(import.meta.dirname, "demo.html"),
      },
    },
  },
  };
});
