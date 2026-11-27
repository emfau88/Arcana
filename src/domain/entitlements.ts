/**
 * Rights (V03.4, INFORMATION_ARCHITECTURE §6, MONETIZATION_CONCEPT §3).
 *
 * The app asks only "is this right granted?" via `has(right)` (in the UI: `useApp().has`).
 * Nothing outside this module and the store knows where a right comes from.
 *
 * - `core.*` is always granted: the whole free app. Core content is never locked.
 * - `edition.*` and `deck.<id>` exist only with an owner-approved billing provider (V07).
 *   Without it they are not granted, and edition content is NOT SHOWN at all
 *   (no placeholders, no locks, no shop).
 *
 * A locally stored flag is not a purchase check: `CoreOnlyProvider` ignores any cached rights.
 * A future paid right needs real Play Billing verification (DECISIONS D-12, D-48).
 */
export const CORE_RIGHTS = ['core.daily', 'core.reading', 'core.grimoire', 'core.profile', 'core.journey', 'core.journal'] as const;
export const EDITION_RIGHTS = ['edition.spreads', 'edition.identity', 'edition.numbers', 'edition.rituals'] as const;
/** Decks that ship free with the app (the deck in `core`). */
export const FREE_DECKS = ['nocturne'] as const;

export type CoreRight = (typeof CORE_RIGHTS)[number];
export type EditionRight = (typeof EDITION_RIGHTS)[number];
export type DeckRight = `deck.${string}`;
export type Right = CoreRight | EditionRight | DeckRight;

const DECK_RIGHT = /^deck\.[a-z0-9-]+$/;

/** True for every right the app knows (used to filter a stored cache, never to grant). */
export function isRight(value: unknown): value is Right {
  return typeof value === 'string' && ((CORE_RIGHTS as readonly string[]).includes(value) || (EDITION_RIGHTS as readonly string[]).includes(value) || DECK_RIGHT.test(value));
}

export interface EntitlementProvider {
  /** Where the rights come from: shown nowhere, only for tests and diagnostics. */
  readonly kind: 'core-only' | 'test' | 'play-billing';
  has(right: Right): boolean;
  /** Granted rights, stable order. */
  list(): readonly Right[];
}

function fromList(kind: EntitlementProvider['kind'], rights: readonly Right[]): EntitlementProvider {
  const granted = new Set<string>(rights);
  const listed = Object.freeze([...granted] as Right[]);
  return { kind, has: (right) => granted.has(right), list: () => listed };
}

const FREE: readonly Right[] = [...CORE_RIGHTS, ...FREE_DECKS.map((d): DeckRight => `deck.${d}`)];

/** Default without billing: the free core and the free deck, nothing else. */
export const CoreOnlyProvider: EntitlementProvider = fromList('core-only', FREE);

/**
 * For tests: grants the free core plus the given rights (default: every edition right).
 * Never used by the shipped app; edition content can be exercised in unit and E2E tests.
 */
export function TestProvider(rights: readonly Right[] = EDITION_RIGHTS): EntitlementProvider {
  return fromList('test', [...FREE, ...rights]);
}
