import { useApp } from '../app/store.tsx';
import type { Locale } from '../domain/types.ts';
import { discoverDe, type DiscoverMessages } from './discover.de.ts';
import { discoverEn } from './discover.en.ts';

export type { DiscoverMessages };
export const DISCOVER_MESSAGES: Record<Locale, DiscoverMessages> = { de: discoverDe, en: discoverEn };

/** Texts of the Discover tab and the birth date page in the current language. */
export function useDiscoverText(): DiscoverMessages {
  const { state } = useApp();
  return DISCOVER_MESSAGES[state.settings.locale];
}
