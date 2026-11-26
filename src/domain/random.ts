/** A random source returning a float in [0, 1). Injected so draws are testable. */
export type Rng = () => number;

/** Cryptographically strong source for real draws (no Math.random bias concerns). */
export const cryptoRng: Rng = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) / 0x1_0000_0000;
};

/** Deterministic PRNG (mulberry32) for tests and reproducible fixtures. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x1_0000_0000;
  };
}

function randomIndex(n: number, rng: Rng): number {
  const r = rng();
  if (!(r >= 0 && r < 1)) throw new Error('Rng must return a value in [0, 1)');
  return Math.floor(r * n);
}

/**
 * Draw k distinct items without replacement (partial Fisher–Yates).
 * Does not mutate the input.
 */
export function drawWithoutReplacement<T>(items: readonly T[], k: number, rng: Rng): T[] {
  if (!Number.isInteger(k) || k < 0) throw new Error('k must be a non-negative integer');
  if (k > items.length) throw new Error(`Cannot draw ${k} from ${items.length} items`);
  const pool = items.slice();
  for (let i = 0; i < k; i++) {
    const j = i + randomIndex(pool.length - i, rng);
    const tmp = pool[i] as T;
    pool[i] = pool[j] as T;
    pool[j] = tmp;
  }
  return pool.slice(0, k);
}

/** Collision-safe id for readings and drafts. */
export function newId(rng: Rng = cryptoRng): string {
  let out = '';
  for (let i = 0; i < 4; i++) out += Math.floor(rng() * 0x1_0000_0000).toString(16).padStart(8, '0');
  return out;
}
