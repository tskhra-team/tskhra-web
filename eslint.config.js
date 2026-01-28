// eslint.config.mjs
import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["dist/", "node_modules/", "eslint.config.mjs"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      import: pluginImport,
      prettier: pluginPrettier,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
        },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // "@typescript-eslint/explicit-function-return-type": [
      //   // enforce explicit return types
      //   "warn",
      //   { allowExpressions: true },
      // ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.eslint.json",
          alwaysTryTypes: true,
        },
        node: {
          moduleDirectory: ["node_modules", "src"],
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      },
    },
  },
  {
    files: ["**/*.stories.*", "**/*.config.*", "**/*.d.ts"],
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: { sourceType: "module" },
  },
]);
