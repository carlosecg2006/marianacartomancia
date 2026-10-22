import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Nada de console no código do site; o log do servidor usa o logger (F5).
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  // Scripts de linha de comando podem escrever no terminal.
  { files: ["scripts/**"], rules: { "no-console": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skills de terceiros e relatórios de teste:
    ".claude/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
