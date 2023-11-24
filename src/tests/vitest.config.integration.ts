import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "integration",
    include: ["src/tests/**/*.test.ts"],
    threads: false,
    setupFiles: ["src/tests/helpers/setup.ts"],
  },
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
