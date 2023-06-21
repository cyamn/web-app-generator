// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: [
    "simple-import-sort",
    "@typescript-eslint",
    "tsdoc",
    "deprecation",
    "spellcheck",
    "unused-imports",
  ],
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:eslint-comments/recommended",
    "plugin:promise/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:security/recommended",
    "plugin:unicorn/recommended",
    "prettier",
    "plugin:tailwindcss/recommended",
  ],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "max-lines": ["error", { max: 300 }],
    "max-lines-per-function": ["warn", 30],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          "signature",
          [
            "public-abstract-field",
            "public-abstract-get",
            "public-abstract-set",
            "public-abstract-method",
          ],
          [
            "public-instance-field",
            "public-instance-get",
            "public-instance-set",
            "public-instance-method",
          ],
          "public-constructor",
          [
            "public-static-field",
            "public-static-get",
            "public-static-set",
            "public-static-method",
          ],

          [
            "protected-abstract-field",
            "protected-abstract-get",
            "protected-abstract-set",
            "protected-abstract-method",
          ],
          [
            "protected-instance-field",
            "protected-instance-get",
            "protected-instance-set",
            "protected-instance-method",
          ],
          "protected-constructor",
          [
            "protected-static-field",
            "protected-static-get",
            "protected-static-set",
            "protected-static-method",
          ],

          ["abstract-field", "abstract-get", "abstract-set", "abstract-method"],
          [
            "private-instance-field",
            "private-instance-get",
            "private-instance-set",
            "private-instance-method",
          ],
          "private-constructor",
          [
            "private-static-field",
            "private-static-get",
            "private-static-set",
            "private-static-method",
          ],

          [
            "#private-instance-field",
            "#private-instance-get",
            "#private-instance-set",
            "#private-instance-method",
          ],
          [
            "#private-static-field",
            "#private-static-get",
            "#private-static-set",
            "#private-static-method",
          ],
        ],
      },
    ],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/method-signature-style": "error",
    "@typescript-eslint/no-base-to-string": "error",
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "@typescript-eslint/no-confusing-void-expression": "error",
    "@typescript-eslint/no-dynamic-delete": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-redundant-type-constituents": "error",
    "@typescript-eslint/no-useless-empty-export": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-literal-enum-member": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",

    // Is buggy. It tries to eliminate the one-before-last signature
    // (the last which has TSDoc). Thus one overload would be undocumented.
    "@typescript-eslint/unified-signatures": "off",

    // Conflicts with unicorn/no-useless-promise-resolve-reject.
    // Sometimes you want to implement an async function from an interface
    // but do no asynchronous flow.
    "@typescript-eslint/require-await": "off",

    "tsdoc/syntax": "error",

    "deprecation/deprecation": "warn",

    "spellcheck/spell-checker": [
      "warn",
      {
        skipWords: [
          "2xl",
          "3xl",
          "4xl",
          "5xl",
          "6xl",
          "7xl",
          "8xl",
          "9xl",
          "Authed",
          "Cuids",
          "Formatter",
          "Prisma",
          "Redirections",
          "Str",
          "authenticator",
          "axios",
          "beforeunload",
          "ctx",
          "cuid",
          "cuids",
          "dayjs",
          "directus",
          "downloader",
          "english",
          "enum",
          "extrabold",
          "favicon",
          "frontend",
          "gte",
          "gui",
          "href",
          "ico",
          "ide",
          "javascript",
          "jsx",
          "localhost",
          "lte",
          "middlewares",
          "minimap",
          "monaco",
          "namespace",
          "namespaces",
          "neq",
          "nullable",
          "oauth",
          "pathname",
          "pjson",
          "postgre",
          "postgres",
          "postgresql",
          "precache",
          "precaching",
          "prisma",
          "provisioner",
          "pv",
          "readonly",
          "req",
          "rerender",
          "revalidate",
          "revalidating",
          "smtp",
          "sql",
          "ssl",
          "ssr",
          "superjson",
          "tgz",
          "trpc",
          "tsx",
          "typesafety",
          "vercel",
          "xl",
          "zod",
        ],
        minLength: 3,
      },
    ],

    // incompatible with TypeScript
    "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
    // Directus uses null
    "unicorn/no-null": "off",

    // React is already imported by TSC
    "react/react-in-jsx-scope": "off",
    // TypeScript checks types for at compile time
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

module.exports = config;
