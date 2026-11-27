/**
 * Share models (V04.7, PRODUCT_SYSTEMS J, IA §6 data classes). Each template has its own model
 * that is built only from published content and an archetype id, never from the profile record.
 * Answers, scores, notes and the birth date cannot be part of a model: the types have no such
 * fields, a type-level check below fails the build if one is added, and a unit test checks the
 * runtime objects against a whitelist.
 */
import type { ContentPack } from '../content/schema.ts';
import type { ArchetypeId, Locale } from '../domain/types.ts';

export type ShareFormat = 'story' | 'feed';
export const SHARE_SIZE: Readonly<Record<ShareFormat, { width: number; height: number }>> = {
  story: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 },
};

/** J2 archetype card: portrait, name, essence, three strengths. */
export interface ArchetypeShareModel {
  readonly template: 'archetype';
  readonly archetypeId: ArchetypeId;
  readonly locale: Locale;
  readonly name: string;
  readonly essence: string;
  readonly strengths: readonly [string, string, string];
}

/** Every share model (J1, J3–J6 join in V07.1). */
export type ShareModel = ArchetypeShareModel;

/** Fields that must never reach a share image (IA §6: private class). */
export type PrivateField = 'answers' | 'scores' | 'note' | 'notes' | 'birthDate' | 'profile' | 'journal' | 'secondaryArchetypeId';

/** Compile-time guard: adding a private field to any share model breaks the build. */
export type NoPrivateFields<T> = Extract<keyof T, PrivateField> extends never ? true : never;
export const SHARE_MODEL_IS_PRIVATE_SAFE: NoPrivateFields<ShareModel> = true;

/** Keys a share model may carry at runtime (unit test). */
export const SHARE_MODEL_KEYS: Readonly<Record<ShareModel['template'], readonly string[]>> = {
  archetype: ['template', 'archetypeId', 'locale', 'name', 'essence', 'strengths'],
};

/**
 * Builds the archetype card from content only. `text` reads the module `archetypes`
 * (`strength.<id>.<n>`); a missing module gives empty strengths, which the caller must not share.
 */
export function archetypeShareModel(pack: ContentPack, archetypeId: ArchetypeId, locale: Locale, text: (key: string) => string): ArchetypeShareModel {
  const a = pack.archetypes.find((x) => x.id === archetypeId);
  if (!a) throw new Error(`Unknown archetype ${archetypeId}`);
  return {
    template: 'archetype',
    archetypeId,
    locale,
    name: a.name[locale],
    essence: a.essence[locale],
    strengths: [text(`strength.${archetypeId}.1`), text(`strength.${archetypeId}.2`), text(`strength.${archetypeId}.3`)],
  };
}

/** A model is complete when no text is empty (module loaded). */
export function isComplete(model: ShareModel): boolean {
  return [model.name, model.essence, ...model.strengths].every((s) => s.trim().length > 0);
}
