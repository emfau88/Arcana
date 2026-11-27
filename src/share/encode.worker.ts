/**
 * Encodes a drawn share card to PNG off the main thread (B-14).
 *
 * On the main thread Chromium encodes canvas PNGs only in idle periods. On a still page in the
 * Android WebView (no frame being produced) there may be none, and `toBlob` then waits for its
 * fixed fallbacks: 4 s until encoding is forced to start, 9 s until it must be complete
 * (≈ 13 s, measured on the reference emulator). In a worker, `convertToBlob` encodes at once.
 * The pixels are the same: the bitmap is drawn 1:1 onto a canvas of the same size.
 */
interface EncodeRequest {
  id: number;
  bitmap: ImageBitmap;
}

// Typed by hand: the project compiles against the DOM library, which has no worker scope.
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<EncodeRequest>) => void) | null;
  postMessage(message: { id: number; blob?: Blob; error?: string }): void;
};

scope.onmessage = async (event) => {
  const { id, bitmap } = event.data;
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('OffscreenCanvas 2D is not available');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    scope.postMessage({ id, blob });
  } catch (err) {
    scope.postMessage({ id, error: String(err) });
  }
};
