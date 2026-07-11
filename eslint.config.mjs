import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.local-wiki/**",
      "**/.docusaurus/**",
      "**/.next/**",
      "apps/**",
      "actionlint",
      "scripts/**",
      "packages/**/scripts/**",
    ],
  },
  {
    files: ["packages/**/*.ts", "packages/**/*.tsx", "vitest.config.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
