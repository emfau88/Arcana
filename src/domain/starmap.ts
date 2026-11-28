/**
 * Star map of the journey (V04.5, PROGRESSION_DESIGN §2.2, ASSET_REQUESTS A19): the 21 stations
 * of the current round. Since V05.3 (design plan point 6, variant A, D-64) the three paths are
 * three rings around one centre: the outer path outside, the inner path inside it and the higher
 * path in the middle. The way is one spiral inwards: each ring starts half a step after the last
 * star of the ring before. Completed rounds become small constellations of the same shape.
 * Pure and constant in size: 21 nodes whatever the journey day, so drawing stays cheap at 400+
 * days (budget ≤ 16 ms per frame).
 */
import { journeyStation, STATIONS_PER_ROUND } from './journey.ts';

export const STARMAP_VIEW = { width: 320, height: 320 } as const;
const CX = STARMAP_VIEW.width / 2;
const CY = STARMAP_VIEW.height / 2;
/** Radius of the ring for the outer, inner and higher path. */
export const RING_RADII = [136, 92, 48] as const;
const STEP_DEG = 360 / 7;

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

const round1 = (n: number) => Math.round(n * 10) / 10;

function pathOf(station: number): 0 | 1 | 2 {
  return Math.min(2, Math.floor((station - 1) / 7)) as 0 | 1 | 2;
}

export function starPosition(station: number): { x: number; y: number; path: 0 | 1 | 2 } {
  const k = station - 1;
  const path = pathOf(station);
  // Clockwise from the top; each ring continues half a step after the last star of the ring before.
  const rad = ((-90 + k * STEP_DEG - path * (STEP_DEG / 2)) * Math.PI) / 180;
  const r = RING_RADII[path];
  return { x: round1(CX + r * Math.cos(rad)), y: round1(CY + r * Math.sin(rad)), path };
}

/**
 * SVG path of the way from station 1 to station `upTo`: an arc along the ring between two stars
 * of the same path, a straight step inwards where a new path begins.
 */
export function wayPath(upTo: number): string {
  let d = '';
  const last = Math.min(Math.max(upTo, 1), STATIONS_PER_ROUND);
  for (let s = 1; s <= last; s++) {
    const p = starPosition(s);
    if (s === 1) d += `M${p.x} ${p.y}`;
    else if (pathOf(s) === pathOf(s - 1)) {
      const r = RING_RADII[p.path];
      d += `A${r} ${r} 0 0 1 ${p.x} ${p.y}`;
    } else d += `L${p.x} ${p.y}`;
  }
  return d;
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
