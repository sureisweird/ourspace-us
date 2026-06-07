import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Dev-only test harness for structural/regression DOM assertions
// (flower-animation-performance spec). No runtime/bundle impact —
// every dependency used here lives in devDependencies (AGENTS.md §9).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      // Mirror the "@/*" -> "./src/*" alias from tsconfig.json
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
