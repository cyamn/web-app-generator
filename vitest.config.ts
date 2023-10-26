import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
