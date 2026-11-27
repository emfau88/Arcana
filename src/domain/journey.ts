/**
 * Fool's journey (V04.4, PROGRESSION_DESIGN §2.2 and §3): which station, path introduction, round
 * closing and milestone text belong to a journey day. Pure functions; the texts live in the content
 * module `journey` under the keys built here, the reward table in progress.ts.
 *
 * Station n of a round is card n (I–XXI), the traveller is the Fool (0). Three paths of seven
 * stations: outer (1–7), inner (8–14), higher (15–21). Round 1 reads as "encounter", round 2 as
 * "return", round 3 and every later round as "wisdom".
 */
import { journeyPosition } from './oracle.ts';
import { milestoneAt } from './progress.ts';

export const STATIONS_PER_ROUND = 21;
export const JOURNEY_PATHS = ['outer', 'inner', 'higher'] as const;
export type JourneyPath = (typeof JOURNEY_PATHS)[number];
export const STATION_READINGS = ['encounter', 'return', 'wisdom'] as const;
export type StationReading = (typeof STATION_READINGS)[number];

/** Rounds with their own path and closing texts; later rounds use the round-3 path texts and a variant. */
export const ROUNDS_WITH_OWN_TEXTS = 3;

/** Fixed milestones with their own text (PROGRESSION_DESIGN §3.2, day 30 = first monthly review). */
export const MILESTONE_TEXT_DAYS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 10, 21, 30, 42, 50, 63, 100, 365];
/** Rhythmic milestones (§3.1) after their first fixed occurrence, most significant first. */
export const MILESTONE_RHYTHMS = ['year', 'jubilee', 'month', 'week'] as const;

export interface JourneyStation {
  day: number;
  round: number;
  path: JourneyPath;
  /** 1–7 within the path. */
  stationInPath: number;
  /** 1–21 within the round = order of the card the Fool meets. */
  station: number;
  reading: StationReading;
  /** Text of the station in this reading. */
  textKey: string;
  /** Introduction when the Fool enters a path (stations 1, 8, 15), otherwise null. */
  pathIntroKey: string | null;
  /** Closing text when a round is completed (station 21), otherwise null. */
  roundCloseKey: string | null;
}

export function readingForRound(round: number): StationReading {
  return round <= 1 ? 'encounter' : round === 2 ? 'return' : 'wisdom';
}

/** Exactly one station for every journey day (day < 1 counts as day 1). */
export function journeyStation(day: number): JourneyStation {
  const pos = journeyPosition(day);
  const path = JOURNEY_PATHS[pos.path] ?? 'outer';
  const station = pos.path * 7 + pos.station;
  const reading = readingForRound(pos.round);
  const textRound = Math.min(pos.round, ROUNDS_WITH_OWN_TEXTS);
  return {
    day: pos.day,
    round: pos.round,
    path,
    stationInPath: pos.station,
    station,
    reading,
    textKey: `station.${station}.${reading}`,
    pathIntroKey: pos.station === 1 ? `path.${path}.${textRound}` : null,
    roundCloseKey: station === STATIONS_PER_ROUND ? `round.${pos.round <= ROUNDS_WITH_OWN_TEXTS ? pos.round : 'later'}.close` : null,
  };
}

/**
 * The one text of a milestone day: a fixed milestone has its own text; otherwise the most
 * significant rhythm of that day (year > jubilee > month > week). Days without a milestone give null.
 * Every 21st day is also a multiple of 7, so a round closing always comes with a milestone text.
 */
export function milestoneTextKey(day: number): string | null {
  if (milestoneAt(day) === null) return null;
  if (MILESTONE_TEXT_DAYS.includes(day)) return `milestone.day.${day}`;
  if (day % 365 === 0) return 'milestone.year';
  if (day > 100 && day % 50 === 0) return 'milestone.jubilee';
  if (day % 30 === 0) return 'milestone.month';
  if (day % 7 === 0) return 'milestone.week';
  return null;
}

/** Every key the module `journey` must provide in each language (content gate). */
export function journeyTextKeys(): string[] {
  const keys: string[] = [];
  for (let n = 1; n <= STATIONS_PER_ROUND; n++) for (const r of STATION_READINGS) keys.push(`station.${n}.${r}`);
  for (const p of JOURNEY_PATHS) for (let r = 1; r <= ROUNDS_WITH_OWN_TEXTS; r++) keys.push(`path.${p}.${r}`);
  for (let r = 1; r <= ROUNDS_WITH_OWN_TEXTS; r++) keys.push(`round.${r}.close`);
  keys.push('round.later.close');
  for (const d of MILESTONE_TEXT_DAYS) keys.push(`milestone.day.${d}`);
  for (const r of MILESTONE_RHYTHMS) keys.push(`milestone.${r}`);
  return keys;
}
