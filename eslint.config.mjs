import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noLinkPrefetch from "./eslint-rules/no-link-prefetch.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Template projects have their own configs — skip them
    "templates/**",
    "packages/**",
    // Cloudflare build artifacts
    ".open-next/**",
    ".wrangler/**",
    // Standalone scripts (CommonJS / non-React)
    "_write_script.js",
    "scripts/**",
    "coverage/**",
  ]),
  {
    plugins: {
      "linkmap": {
        rules: {
          "no-link-prefetch": noLinkPrefetch,
        },
      },
    },
    rules: {
      // React 19 strict rules — downgrade to warnings for now
      "react-hooks/error-boundaries": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      // Workers Free Plan: prefetch={false} 필수
      "linkmap/no-link-prefetch": "error",
    },
  },
]);

export default eslintConfig;
