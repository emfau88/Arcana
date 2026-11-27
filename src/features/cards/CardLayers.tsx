/**
 * Card page, part 1 (V05.1, PRODUCT_SYSTEMS D): the level of a card as a moon phase and every
 * layer that level has opened, cumulative. Loaded as its own chunk below the card on its page.
 * The level is derived from stored facts (progress.ts), never stored; nothing here locks a card
 * (D4): layers that are not open yet are simply not shown. The study (part 2) follows.
 */
import type { ReactNode } from 'react';
import { factsOf, useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { findCard } from '../../content/index.ts';
import { deepCard, DEEP_ROLES } from '../../content/modules/cards-deep-keys.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { journalItems } from '../../domain/journal.ts';
import { cardEncounters, cardLevel, type CardLevel } from '../../domain/progress.ts';
import { cardLayers, LEVEL_PHASE, type LevelPhase } from '../../domain/study.ts';
import { ALL_THEME_IDS, POSITIONS } from '../../domain/types.ts';
import { fmt, formatDate } from '../../i18n/index.ts';
import { useScreenText } from '../../i18n/screens.ts';
import './card-page.css';

/** Moon phase from new to full (D3): a lit disc with the shadow drawn as a second ellipse. */
export function MoonPhase({ phase, size = 28 }: { phase: LevelPhase; size?: number }) {
  // Lit share of the disc: new 0, crescent ¼, half ½, gibbous ¾, full 1. The terminator is an
  // ellipse whose half-width follows the share (right side lit, like a waxing moon).
  const lit = { new: 0, crescent: 0.25, half: 0.5, gibbous: 0.75, full: 1 }[phase];
  const r = 10;
  const k = Math.abs(1 - 2 * lit) * r; // terminator half-width
  const sweep = lit > 0.5 ? 1 : 0;
  const d = lit === 0 || lit === 1 ? '' : `M 12 2 A ${r} ${r} 0 0 1 12 22 A ${k} ${r} 0 0 ${sweep} 12 2 Z`;
  return (
    <svg className="moon-phase" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r={r} className="moon-phase__dark" />
      {lit === 1 ? <circle cx="12" cy="12" r={r} className="moon-phase__lit" /> : null}
      {d ? <path d={d} className="moon-phase__lit" /> : null}
      <circle cx="12" cy="12" r={r} className="moon-phase__rim" />
    </svg>
  );
}

function Layer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel card-layer">
      <h2 className="panel__label">{title}</h2>
      {children}
    </section>
  );
}

export default function CardLayers({ id }: { id: string }) {
  const { pack, state, tx } = useApp();
  const s = useScreenText().card;
  const locale = state.settings.locale;
  const { status, retry } = useModules(['cards-deep', 'spreads']);
  const card = findCard(pack, id);
  const facts = factsOf(state);
  const level: CardLevel = cardLevel(cardEncounters(facts).get(id));
  if (!card || level === 0) return null;

  const open = new Set(cardLayers(level));
  const deep = deepCard(state.modules['cards-deep'], id);
  const themeId = state.profile?.themeId;
  const themeLabel = (t: string) => pack.themes.find((x) => x.id === t)?.label[locale] ?? t;
  // The profile theme already speaks as the message above; the list holds the others then.
  const shown = open.has('message') && themeId && card.themes[themeId] ? themeId : null;
  const own = open.has('notes') ? journalItems(facts).filter((i) => i.text && i.cardIds.includes(id)) : [];

  return (
    <div className="card-layers">
      <div className="card-level">
        <MoonPhase phase={LEVEL_PHASE[level]} />
        <p className="card-level__text">
          <span className="card-level__name">{fmt(s.level, { n: level, name: s.levelNames[level] })}</span>
          {level < 4 ? <span className="small muted">{s.deeper}</span> : null}
        </p>
      </div>

      {open.has('message') && themeId && card.themes[themeId] ? (
        <Layer title={fmt(s.message, { theme: themeLabel(themeId) })}>
          <p className="card-layer__text">{card.themes[themeId]![locale]}</p>
        </Layer>
      ) : null}

      {status === 'error' ? (
        <div className="panel card-layer">
          <p className="muted">{s.textsMissing}</p>
          <button type="button" className="text-link" onClick={retry}>
            {s.retry}
          </button>
        </div>
      ) : null}

      {deep && open.has('light') ? (
        <>
          <Layer title={s.light}>
            <p className="card-layer__text">{deep.light}</p>
          </Layer>
          <Layer title={s.shadow}>
            <p className="card-layer__text">{deep.shadow}</p>
          </Layer>
          <Layer title={s.keyword}>
            <p className="card-layer__text">{deep.keyword}</p>
          </Layer>
        </>
      ) : null}

      {open.has('themes') ? (
        <Layer title={shown ? s.otherThemes : s.themes}>
          <dl className="card-layer__list">
            {ALL_THEME_IDS.filter((t) => t !== shown && card.themes[t]).map((t) => (
              <div key={t}>
                <dt>{themeLabel(t)}</dt>
                <dd>{card.themes[t]![locale]}</dd>
              </div>
            ))}
          </dl>
        </Layer>
      ) : null}

      {deep && open.has('roles') ? (
        <Layer title={s.roles}>
          <dl className="card-layer__list">
            {POSITIONS.map((p) => (
              <div key={p}>
                <dt>{tx('spreads', `role.${p}.label`)}</dt>
                <dd>{card.positions[p][locale]}</dd>
              </div>
            ))}
            {DEEP_ROLES.map((r) => (
              <div key={r}>
                <dt>{tx('spreads', `role.${r}.label`)}</dt>
                <dd>{deep.roles[r]}</dd>
              </div>
            ))}
          </dl>
        </Layer>
      ) : null}

      {deep && open.has('symbols') ? (
        <Layer title={s.symbols}>
          <p className="card-layer__text">{deep.symbols}</p>
        </Layer>
      ) : null}

      {open.has('notes') ? (
        <Layer title={s.notes}>
          <ul className="card-layer__notes">
            {own.map((i) => (
              <li key={i.key}>
                <span className="small muted">{formatDate(dateFromKey(i.dateKey), locale)}</span>
                <p className="italic-serif">{i.text}</p>
              </li>
            ))}
          </ul>
        </Layer>
      ) : null}

      {deep && open.has('ritual') ? (
        <Layer title={s.ritual}>
          <p className="card-layer__text">{deep.ritual}</p>
        </Layer>
      ) : null}

      {deep && open.has('question') ? (
        <Layer title={s.question}>
          <p className="italic-serif card-layer__question">{deep.question}</p>
        </Layer>
      ) : null}
    </div>
  );
}
