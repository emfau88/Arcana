/**
 * Head starts for the next screen (B-13): load and decode an image, or load a font face of the
 * bundled fonts, before the screen that needs it appears. Nothing is shown; failures are ignored
 * because the screen loads the same files itself.
 */
export function warmImage(src: string): void {
  if (typeof Image === 'undefined') return;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  img.decode().catch(() => undefined);
}

export function warmFont(font: string): void {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  document.fonts.load(font).catch(() => undefined);
}

/** Runs `go` once the browser is idle (at the latest after `timeout` ms); returns a cancel function. */
export function whenIdle(go: () => void, timeout = 600): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(go, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(go, 200);
  return () => window.clearTimeout(id);
}
