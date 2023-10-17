/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  collectCoverageFrom: ["./src/**"],
  coveragePathIgnorePatterns: [".*.json"],

  // The pattern or patterns Jest uses to detect test files.
  testRegex: "(?:/__tests__/.*|(?:\\.|/)(?:test|spec))\\.(?:jsx?|tsx?)$",

  // A map from regular expressions to paths to transformers.
  transform: {
    "^.+\\.(?:t|j)sx?$": "ts-jest",
  },

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // An array of file extensions your modules use.
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
