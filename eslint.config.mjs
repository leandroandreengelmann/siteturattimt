import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "warn", // Muda de erro para warning
      "@typescript-eslint/no-unused-vars": "error", // Mantém como erro
      "react-hooks/exhaustive-deps": "warn", // Muda de erro para warning
    },
  },
];

export default eslintConfig;
