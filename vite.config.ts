import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /six-js-docs/, not the domain root - only matters for
  // the production build (dev server stays at "/" for local convenience). Every internal
  // link/asset path built at runtime (header nav, "Xem demo" buttons, in-content <a> refs) is
  // written as a plain relative path (no leading "/") specifically so it resolves correctly
  // under either base without needing this value threaded through the app - see the sibling
  // .html entries (already asset-referenced with a leading "/") which Vite itself rewrites
  // against `base` at build time.
  base: command === "build" ? "/six-js-docs/" : "/",
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
}));
