import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
import path from "path";

const env = dotenv.config({ path: path.resolve(__dirname, ".env.test") }).parsed ?? {};

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env,
    fileParallelism: false,
  },
});