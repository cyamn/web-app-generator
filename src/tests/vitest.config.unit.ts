import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [react()],
  test: {
    name: "unit",
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "!src/tests"],
  },
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
