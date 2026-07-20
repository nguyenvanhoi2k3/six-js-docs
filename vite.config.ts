import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragmentFactory: "Fragment",
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        installation: resolve(__dirname, "installation.html"),
        components: resolve(__dirname, "components.html"),
        core: resolve(__dirname, "core.html"),
        plugins: resolve(__dirname, "plugins.html"),
        showcase: resolve(__dirname, "showcase.html"),
        demo: resolve(__dirname, "demo.html"),
      },
    },
  },
});
