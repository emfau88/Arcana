import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const isNative = (): boolean => Capacitor.isNativePlatform();
export const platformName = (): string => Capacitor.getPlatform();

/**
 * Android hardware/gesture back. The app decides what "back" means (detail -> list,
 * tab -> Today, Today -> leave app), so the WebView history alone is not used.
 */
export function onHardwareBack(handler: () => 'handled' | 'exit'): () => void {
  if (!isNative()) return () => undefined;
  const sub = App.addListener('backButton', () => {
    if (handler() === 'exit') void App.minimizeApp();
  });
  return () => {
    void sub.then((s) => s.remove());
  };
}

/** Fires when the app returns to the foreground (native resume or browser tab focus). */
export function onResume(handler: () => void): () => void {
  const onVisible = () => {
    if (document.visibilityState === 'visible') handler();
  };
  document.addEventListener('visibilitychange', onVisible);
  let remove: (() => void) | null = null;
  if (isNative()) {
    const sub = App.addListener('resume', handler);
    remove = () => void sub.then((s) => s.remove());
  }
  return () => {
    document.removeEventListener('visibilitychange', onVisible);
    remove?.();
  };
}
