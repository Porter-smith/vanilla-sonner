import { defineConfig } from "vite";
import { terser } from "rollup-plugin-terser";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "vanilla-sonner.js"), // Specify your input file
      output: {
        dir: "dist", // Output directory
        entryFileNames: "vanilla-sonner.min.js", // Output file name
        format: "iife", // Immediately-Invoked Function Expression, suitable for <script> tags
        name: "VanillaSonner", // Global variable name if you plan to use it in <script> tags
      },
      plugins: [
        terser({
          compress: {
            drop_console: true,
          },
        }),
      ],
    },
  },
});
