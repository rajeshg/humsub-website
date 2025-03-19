import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-output',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8787/', // Adjust if your dev server runs on a different port
  },
  webServer: {
    command: 'pnpm run preview', // Or your preferred command
    url: 'http://localhost:8787/', // Or your dev server URL
    reuseExistingServer: !process.env.CI, // Reuse if not in CI
    stdout: 'pipe',
    stderr: 'pipe',
  },
});