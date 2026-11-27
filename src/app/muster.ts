/**
 * Design samples for the owner's choice (design plan points 2, 5 and 6, D-63). A sample replaces
 * a screen only when it is switched on in this browser:
 *
 *   localStorage.setItem('arcana.muster', 'oracle=a;reveal=a;starmap=b')
 *
 * Without the entry the app looks exactly like 0.4.1. This file and everything that reads it are
 * removed once the owner has chosen; the chosen variants are then built properly in V05.
 */
export type MusterKey = 'oracle' | 'reveal' | 'starmap';
export type MusterVariant = 'a' | 'b';

export function muster(key: MusterKey): MusterVariant | null {
  try {
    const raw = window.localStorage.getItem('arcana.muster') ?? '';
    for (const part of raw.split(';')) {
      const [k, v] = part.trim().split('=');
      if (k === key && (v === 'a' || v === 'b')) return v;
    }
  } catch {
    // Storage blocked: no sample.
  }
  return null;
}
