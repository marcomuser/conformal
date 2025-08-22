import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**"],
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.json",
    },
  },
});
