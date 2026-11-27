/**
 * Star map of the journey (V04.5, PROGRESSION_DESIGN §2.2, ASSET_REQUESTS A19): the 21 stations
 * of the current round as one constellation in three rows (outer, inner, higher path), drawn as
 * a serpentine so the way reads as one line. Completed rounds become small constellations.
 * Pure and constant in size: 21 nodes whatever the journey day, so drawing stays cheap at 400+
 * days (budget ≤ 16 ms per frame).
 */
import { journeyStation, STATIONS_PER_ROUND } from './journey.ts';

export const STARMAP_VIEW = { width: 320, height: 300 } as const;

export type StarState = 'reached' | 'current' | 'ahead';

export interface StarNode {
  /** 1–21 = order of the card the Fool meets. */
  station: number;
  /** 0 outer, 1 inner, 2 higher. */
  path: 0 | 1 | 2;
  x: number;
  y: number;
  state: StarState;
}

export interface StarMap {
  round: number;
  /** Stations reached in this round, today's included. */
  reached: number;
  nodes: StarNode[];
  /** Completed rounds = constellations already drawn (one per 21 journey days). */
  completedRounds: number;
}

const ROW_Y = [252, 156, 60] as const;
const X0 = 34;
const STEP = 42;
/** Small fixed offsets so a row looks like a constellation, not a ruler. */
const WAVE = [6, -8, 4, -10, 7, -5, 9] as const;

export function starPosition(station: number): { x: number; y: number; path: 0 | 1 | 2 } {
  const path = Math.floor((station - 1) / 7) as 0 | 1 | 2;
  const i = (station - 1) % 7;
  // Serpentine: outer left → right, inner right → left, higher left → right.
  const col = path === 1 ? 6 - i : i;
  return { x: X0 + col * STEP, y: ROW_Y[path] + (WAVE[i] ?? 0), path };
}

/** The map for the journey day the person stands on (day < 1 counts as day 1). */
export function starMapModel(journeyDay: number): StarMap {
  const s = journeyStation(journeyDay);
  const nodes: StarNode[] = [];
  for (let station = 1; station <= STATIONS_PER_ROUND; station++) {
    const { x, y, path } = starPosition(station);
    nodes.push({ station, path, x, y, state: station < s.station ? 'reached' : station === s.station ? 'current' : 'ahead' });
  }
  return {
    round: s.round,
    reached: s.station,
    nodes,
    completedRounds: s.station === STATIONS_PER_ROUND ? s.round : s.round - 1,
  };
}
