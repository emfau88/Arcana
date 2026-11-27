/**
 * Hands a finished share image to the system (V04.7, E20): Capacitor Share in the Android app
 * (the image is written to the app cache first, since the WebView has no Web Share), Web Share
 * with a file in the browser, and a plain download where neither exists. Nothing leaves the
 * device unless the person picks a target in the system sheet.
 */
import { isNative } from '../platform/native.ts';

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]*,/, ''));
    r.onerror = () => reject(r.error ?? new Error('Read failed'));
    r.readAsDataURL(blob);
  });
}

const isAbort = (e: unknown) => e instanceof Error && (e.name === 'AbortError' || /cancel/i.test(e.message));

export async function shareImage(blob: Blob, fileName: string, title: string): Promise<ShareOutcome> {
  if (isNative()) {
    const [{ Filesystem, Directory }, { Share }] = await Promise.all([import('@capacitor/filesystem'), import('@capacitor/share')]);
    const written = await Filesystem.writeFile({ path: fileName, data: await blobToBase64(blob), directory: Directory.Cache });
    try {
      await Share.share({ title, files: [written.uri], dialogTitle: title });
      return 'shared';
    } catch (e) {
      if (isAbort(e)) return 'cancelled';
      throw e;
    }
  }
  const file = new File([blob], fileName, { type: blob.type || 'image/png' });
  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return 'shared';
    } catch (e) {
      if (isAbort(e)) return 'cancelled';
      // Some browsers refuse files after all: fall through to the download.
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
  return 'downloaded';
}
