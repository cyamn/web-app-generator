import { defineWorkspace } from "vitest/config";

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
  {
    // UNIT TESTS
    extends: "src/tests/vitest.config.unit.ts",
  },
  {
    // INTEGRATION TESTS
    extends: "src/tests/vitest.config.integration.ts",
  },
]);
