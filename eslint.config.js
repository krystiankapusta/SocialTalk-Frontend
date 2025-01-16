import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { configs as tsConfigs } from "@typescript-eslint/eslint-plugin";
import { parse } from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...Object.values(tsConfigs.recommended)],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: parse,
      sourceType: "module",
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    linterOptions: {
      unusedDisableDirectives: "warn",
    },
  },
];
