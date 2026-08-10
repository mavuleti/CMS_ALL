import { defineConfig, devices } from '@playwright/test';

// Dedicated port for this repo's Playwright static-server tests. Fixed and
// non-scanning on purpose: other agents/processes on this machine may have
// their own dev servers on common ports (3000-3002, etc). We never probe or
// reuse whatever happens to be listening elsewhere - we always bind our own
// fresh server on this exact port and fail fast if it's unavailable, rather
// than silently attaching to (and testing against) someone else's server.
const port = process.env.PORT ?? '4444';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? ('http://127.0.0.1:' + port);
const serverCommand = process.platform === 'win32' ? 'cmd /c \"node scripts\\serve-static.mjs\"' : 'node scripts/serve-static.mjs';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : (process.env.CI ? 2 : 4),
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  webServer: { command: serverCommand, url: baseURL, reuseExistingServer: false },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

