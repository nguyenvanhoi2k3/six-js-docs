import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        installation: resolve(__dirname, "installation.html"),
        components: resolve(__dirname, "components.html"),
        animatable: resolve(__dirname, "animatable.html"),
        showcase: resolve(__dirname, "showcase.html"),
        demo: resolve(__dirname, "demo.html"),
      },
    },
  },
});
