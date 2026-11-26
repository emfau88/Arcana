import type { CardContent, Localized } from './schema.ts';

/**
 * Three key words per card, shown under the card name on "Heute" (visual overhaul V02).
 * Kept apart from CardContent so stored records and the card schema stay unchanged.
 * Original wording for this project; symbolic qualities, never predictions.
 * Keyed by assetId (stable, see define.ts).
 */
export const CARD_KEYWORDS: Readonly<Record<string, Localized>> = {
  'card-fool': { de: 'Aufbruch · Vertrauen · Neugier', en: 'Beginning · Trust · Curiosity' },
  'card-magician': { de: 'Wille · Können · Fokus', en: 'Will · Skill · Focus' },
  'card-high-priestess': { de: 'Intuition · Stille · Tiefe', en: 'Intuition · Stillness · Depth' },
  'card-empress': { de: 'Fülle · Fürsorge · Schöpfung', en: 'Abundance · Nurture · Creation' },
  'card-emperor': { de: 'Struktur · Halt · Verantwortung', en: 'Structure · Stability · Responsibility' },
  'card-hierophant': { de: 'Tradition · Werte · Lernen', en: 'Tradition · Values · Learning' },
  'card-lovers': { de: 'Verbindung · Wahl · Werte', en: 'Connection · Choice · Values' },
  'card-chariot': { de: 'Richtung · Entschlossenheit · Bewegung', en: 'Direction · Resolve · Momentum' },
  'card-strength': { de: 'Sanftheit · Mut · Geduld', en: 'Gentleness · Courage · Patience' },
  'card-hermit': { de: 'Rückzug · Einsicht · Innenlicht', en: 'Solitude · Insight · Inner light' },
  'card-wheel': { de: 'Wandel · Zyklen · Gelassenheit', en: 'Change · Cycles · Equanimity' },
  'card-justice': { de: 'Klarheit · Ausgleich · Ehrlichkeit', en: 'Clarity · Balance · Honesty' },
  'card-hanged-man': { de: 'Innehalten · Perspektive · Hingabe', en: 'Pause · Perspective · Surrender' },
  'card-death': { de: 'Abschied · Wandlung · Neubeginn', en: 'Release · Transformation · Renewal' },
  'card-temperance': { de: 'Maß · Mischung · Gleichgewicht', en: 'Moderation · Blending · Harmony' },
  'card-devil': { de: 'Muster · Bindung · Freiheit', en: 'Patterns · Attachment · Freedom' },
  'card-tower': { de: 'Umbruch · Wahrheit · Befreiung', en: 'Upheaval · Truth · Release' },
  'card-star': { de: 'Hoffnung · Erneuerung · Zuversicht', en: 'Hope · Renewal · Faith' },
  'card-moon': { de: 'Traum · Ahnung · Unsicherheit', en: 'Dreams · Intuition · Uncertainty' },
  'card-sun': { de: 'Freude · Wärme · Klarheit', en: 'Joy · Warmth · Clarity' },
  'card-judgement': { de: 'Erwachen · Bilanz · Ruf', en: 'Awakening · Reflection · Calling' },
  'card-world': { de: 'Vollendung · Ganzheit · Ankommen', en: 'Completion · Wholeness · Arrival' },
};

export function cardKeywords(card: Pick<CardContent, 'assetId'>): Localized | undefined {
  return CARD_KEYWORDS[card.assetId];
}
