import { useApp } from '../app/store.tsx';
import type { Locale } from '../domain/types.ts';
import { screensDe, type ScreenMessages } from './screens.de.ts';
import { screensEn } from './screens.en.ts';

export type { ScreenMessages };
export const SCREEN_MESSAGES: Record<Locale, ScreenMessages> = { de: screensDe, en: screensEn };

/** Texts of the on-demand screens in the current language. */
export function useScreenText(): ScreenMessages {
  const { state } = useApp();
  return SCREEN_MESSAGES[state.settings.locale];
}
