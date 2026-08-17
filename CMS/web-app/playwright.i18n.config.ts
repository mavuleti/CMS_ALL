import { defineConfig, devices } from '@playwright/test';

// Dedicated port for this repo's Playwright static-server tests. Fixed and
// non-scanning on purpose: other agents/processes on this machine may have
// their own dev servers on common ports (3000-3002, etc). We never probe or
// reuse whatever happens to be listening elsewhere - we always bind our own
// fresh server on this exact port and fail fast if it's unavailable, rather
// than silently attaching to (and testing against) someone else's server.
const port = process.env.PORT ?? '4444';
const serverCommand = process.platform === 'win32'
  ? 'cmd /c "node scripts\\serve-static.mjs"'
  : 'node scripts/serve-static.mjs';
// 127.0.0.1 rather than localhost: the static server binds IPv4 only, and
// Node 17+ resolves localhost to ::1 first, so Playwright's webServer probe
// would miss a running server and collide on the port.
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  testMatch: 'i18n-layout.spec.ts',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-i18n' }]],
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  webServer: {
    command: serverCommand,
    url: baseURL,
    reuseExistingServer: false
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
    { name: 'ipad-gen7', use: { ...devices['iPad (gen 7)'] } }
  ]
});
