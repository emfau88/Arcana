/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Strict Content-Security-Policy for the bundled app (browser build and Android WebView).
 * Only added to production builds: the Vite dev server needs inline preamble scripts.
 * No external origin is allowed anywhere – the app has no network dependency.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'personal-oracle-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`);
    },
  };
}

// Relative base so the same dist works under the Vite preview, any static host
// sub-path and the Capacitor Android origin (https://localhost/).
export default defineConfig({
  base: './',
  plugins: [react(), cspPlugin()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    environment: 'node',
    restoreMocks: true,
  },
});
