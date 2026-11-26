import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Android shell for the shared web bundle.
 * - The app is loaded from the bundled `dist` files (no `server.url`, no remote WebView).
 * - Development id; the final release id is an owner decision (see docs/DECISIONS.md).
 */
const config: CapacitorConfig = {
  appId: 'com.energycrafted.personaloracle.dev',
  appName: 'Arcana',
  webDir: 'dist',
  backgroundColor: '#100d1c',
  android: {
    allowMixedContent: false,
    captureInput: false,
  },
  plugins: {
    // Light system-bar icons on the always-dark UI; safe areas are handled in CSS
    // (env() on current WebViews, --safe-area-inset-* injected by Capacitor otherwise).
    SystemBars: {
      style: 'DARK',
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
  },
};

export default config;
