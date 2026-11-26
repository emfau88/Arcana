import { defineConfig } from '@playwright/test';

/**
 * E2E runs against the PRODUCTION build (`vite build` + `vite preview`), i.e. the same
 * bundle that Capacitor ships, including the strict Content-Security-Policy.
 * Only the locally cached Chromium is used; nothing is downloaded.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 3,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5181/',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-de-412',
      use: { browserName: 'chromium', viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE' },
    },
    {
      name: 'mobile-en-360',
      use: { browserName: 'chromium', viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US' },
    },
    {
      name: 'small-de-320',
      use: { browserName: 'chromium', viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE' },
    },
    {
      name: 'desktop-de',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 }, locale: 'de-DE' },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://127.0.0.1:5181/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
