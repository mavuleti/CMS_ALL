const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4300',
    headless: true
  },
  webServer: {
    command: 'python -m http.server 4300 --directory dist/dot-to-dot-cms',
    url: 'http://127.0.0.1:4300',
    reuseExistingServer: false
  }
});
