import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'distribution-counts.spec.ts',
  workers: 1
});
