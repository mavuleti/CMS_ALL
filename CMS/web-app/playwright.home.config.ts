import { defineConfig, devices } from '@playwright/test';

const port = process.env.PORT ?? '4444';
const baseURL = `http://127.0.0.1:${port}`;
const serverCommand = process.platform === 'win32'
  ? 'cmd /c "node scripts\\serve-static.mjs"'
  : 'node scripts/serve-static.mjs';

export default defineConfig({
  testDir: './tests',
  testMatch: 'home-screen.spec.ts',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : 4,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-home' }]],
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  webServer: {
    command: serverCommand,
    url: baseURL,
    reuseExistingServer: process.env.PW_REUSE_SERVER === '1'
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
    { name: 'ipad-gen7', use: { ...devices['iPad (gen 7)'] } }
  ]
});
