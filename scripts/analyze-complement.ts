// Compares complement rules for the questionnaire (V04.1, D-53, alternatives in docs/SELF_DECISIONS.md).
// Usage: node --experimental-strip-types --no-warnings scripts/analyze-complement.ts
// Part 1, all 4^7 complete answer sets: share with a complement, spread of that share across the
// eight main archetypes, reachable main/complement pairs.
// Part 2, all partial answer sets (skipped questions, at least 2 answers): share with a complement
// by number of answers. A good rule stays steady when questions are skipped.
// The app's rule is marked with *.
import { CONTENT } from '../src/content/index.ts';
import { COMPLEMENT_MAX_GAP, MIN_ANSWERS_FOR_COMPLEMENT, scoreArchetype } from '../src/domain/archetypes.ts';
import { ARCHETYPE_ORDER, type Answers, type ArchetypeId } from '../src/domain/types.ts';

const Q = CONTENT.questions;

interface Case {
  answered: number;
  main: ArchetypeId;
  second: ArchetypeId;
  mainScore: number;
  secondScore: number;
  /** How often the second archetype was the first-weight (primary) part of a chosen answer. */
  secondPrimaryHits: number;
  appComplement: boolean;
}

const cases: Case[] = [];
const collect = (acc: Answers, answered: number) => {
  const r = scoreArchetype(Q, acc);
  if (!r.archetypeId) return;
  const hits: Partial<Record<ArchetypeId, number>> = {};
  for (const q of Q) {
    const a = q.answers.find((x) => x.id === acc[q.id]);
    if (a) hits[a.primary] = (hits[a.primary] ?? 0) + 1;
  }
  let second: ArchetypeId | null = null;
  for (const id of ARCHETYPE_ORDER) {
    if (id === r.archetypeId) continue;
    if (second === null || r.scores[id] > r.scores[second] || (r.scores[id] === r.scores[second] && (hits[id] ?? 0) > (hits[second] ?? 0))) second = id;
  }
  if (!second) return;
  cases.push({
    answered,
    main: r.archetypeId,
    second,
    mainScore: r.scores[r.archetypeId],
    secondScore: r.scores[second],
    secondPrimaryHits: hits[second] ?? 0,
    appComplement: r.complementId !== null,
  });
};
const rec = (i: number, acc: Answers, answered: number) => {
  if (i === Q.length) {
    if (answered >= 2) collect(acc, answered);
    return;
  }
  rec(i + 1, acc, answered); // question skipped
  for (const a of Q[i]!.answers) rec(i + 1, { ...acc, [Q[i]!.id]: a.id }, answered + 1);
};
rec(0, {}, 0);

type Rule = [string, (c: Case) => boolean];
const has = (c: Case) => c.secondScore > 0;
const rules: Rule[] = [
  ['* app rule', (c) => c.appComplement],
  [`gap <= ${COMPLEMENT_MAX_GAP} and ${MIN_ANSWERS_FOR_COMPLEMENT}+ answers (same as app)`, (c) => has(c) && c.mainScore - c.secondScore <= COMPLEMENT_MAX_GAP && c.answered >= MIN_ANSWERS_FOR_COMPLEMENT],
];
for (const t of [0.6, 0.67, 0.75, 0.8, 0.9]) rules.push([`ratio >= ${t}`, (c) => has(c) && c.secondScore >= t * c.mainScore]);
for (const g of [0, 1, 2, 3]) rules.push([`gap <= ${g}`, (c) => has(c) && c.mainScore - c.secondScore <= g]);
rules.push(['gap <= 2 and 2+ first-weight answers', (c) => has(c) && c.mainScore - c.secondScore <= 2 && c.secondPrimaryHits >= 2]);
rules.push(['two levels: gap <= 3 (gap 2-3 "quiet voice")', (c) => has(c) && c.mainScore - c.secondScore <= 3]);

const pct = (n: number, d: number) => `${((100 * n) / Math.max(1, d)).toFixed(1)} %`;
const full = cases.filter((c) => c.answered === Q.length);
const gaps: Record<number, number> = {};
for (const c of full) gaps[c.mainScore - c.secondScore] = (gaps[c.mainScore - c.secondScore] ?? 0) + 1;
console.log(`Part 1 · ${full.length} complete answer sets (${Q.length} answers)`);
console.log('points between main and second:', Object.entries(gaps).map(([g, n]) => `${g}: ${pct(n, full.length)}`).join(', '));
for (const [name, ok] of rules) {
  const hit = full.filter(ok);
  const pairs = new Set(hit.map((c) => `${c.main}/${c.second}`));
  const perMain = ARCHETYPE_ORDER.map((id) => {
    const all = full.filter((c) => c.main === id).length;
    return all ? hit.filter((c) => c.main === id).length / all : 0;
  });
  console.log(`  ${name.padEnd(48)} ${pct(hit.length, full.length).padStart(7)} · per main ${(100 * Math.min(...perMain)).toFixed(0)}–${(100 * Math.max(...perMain)).toFixed(0)} % · pairs ${pairs.size}/56`);
}

console.log(`\nPart 2 · share with a complement by number of answers (skipped questions)`);
const counts = [...new Set(cases.map((c) => c.answered))].sort((a, b) => a - b);
console.log(`  ${'rule'.padEnd(48)} ${counts.map((k) => `${k} answers`.padStart(10)).join('')}`);
for (const [name, ok] of rules.filter(([n]) => n.startsWith('*') || /^ratio >= 0\.(6|75)$|^gap <= 1$/.test(n))) {
  const row = counts.map((k) => {
    const all = cases.filter((c) => c.answered === k);
    return pct(all.filter(ok).length, all.length).padStart(10);
  });
  console.log(`  ${name.padEnd(48)} ${row.join('')}`);
}
