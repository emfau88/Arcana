/**
 * Journey screens of V04 (V04.4/V04.5, D-57 proposals): the star map with today's station, the
 * reached milestones, the weekly and monthly reviews and the archetype chapters, plus the
 * milestone moment shown once on "Today". Texts come from the modules `journey` and `chapters`.
 */
import { useEffect, useState } from 'react';
import { navigate, originOf, type ParsedRoute } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { findCard, getArchetype, getTheme } from '../../content/index.ts';
import { CHAPTERS, chapterKey, type ChapterId } from '../../content/modules/chapter-keys.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { journeyStation, milestoneTextKey } from '../../domain/journey.ts';
import { journeyDayToday, milestonesReached, journeyDays, type Facts } from '../../domain/progress.ts';
import { buildReview, reviewSentences, type ReviewKind } from '../../domain/review.ts';
import { STARMAP_VIEW, starMapModel, starPosition, type StarMap } from '../../domain/starmap.ts';
import { availableChapters, availableReviews, unseenKeys, type ChapterEntry } from '../../domain/unlocks.ts';
import type { Locale } from '../../domain/types.ts';
import { useScreenText, type ScreenMessages } from '../../i18n/screens.ts';
import { fmt, formatDate, toRoman } from '../../i18n/index.ts';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { Flank, StarGlyph } from '../../ui/Ornaments.tsx';
import { DetailHeader, NotFound } from '../grimoire/Grimoire.tsx';
import './journey-screens.css';

const REVIEWS_SHOWN = 6;

function useFacts(): Facts {
  const { state } = useApp();
  return { dailies: state.dailies, readings: state.readings };
}

export function chapterTitle(s: ScreenMessages, entry: Pick<ChapterEntry, 'id' | 'variant'>): string {
  if (entry.id === 'second-voice') return entry.variant === 'two-voices' ? s.journeyMap.chapterTwoVoices : s.journeyMap.chapterOtherSide;
  return s.journeyMap[`chapter${entry.id}`];
}

function reviewTitle(s: ScreenMessages, kind: ReviewKind, index: number): string {
  return fmt(kind === 'week' ? s.review.weekTitle : s.review.monthTitle, { n: index });
}

/* ------------------------------------------------------------- Star map */

function StarMapFigure({ map, label }: { map: StarMap; label: string }) {
  const path = map.nodes.map((n, i) => `${i === 0 ? 'M' : 'L'}${n.x} ${n.y}`).join(' ');
  const reachedPath = map.nodes
    .filter((n) => n.state !== 'ahead')
    .map((n, i) => `${i === 0 ? 'M' : 'L'}${n.x} ${n.y}`)
    .join(' ');
  return (
    <figure className="starmap" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${STARMAP_VIEW.width} ${STARMAP_VIEW.height}`} aria-hidden="true">
        <defs>
          <radialGradient id="sm-gold">
            <stop offset="0" stopColor="#fff4d2" />
            <stop offset="0.55" stopColor="#e3c27e" />
            <stop offset="1" stopColor="#9a7338" />
          </radialGradient>
          <radialGradient id="sm-glow">
            <stop offset="0" stopColor="#4fd1c5" stopOpacity="0.5" />
            <stop offset="1" stopColor="#4fd1c5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={path} className="starmap__line" />
        {reachedPath.includes('L') ? <path d={reachedPath} className="starmap__line starmap__line--reached" /> : null}
        {map.nodes.map((n) => (
          <g key={n.station} className={`starmap__star starmap__star--${n.state}`}>
            {n.state === 'current' ? <circle cx={n.x} cy={n.y} r="17" fill="url(#sm-glow)" /> : null}
            {n.state === 'ahead' ? (
              <circle cx={n.x} cy={n.y} r="3.2" />
            ) : (
              <path
                d={`M${n.x} ${n.y - 7}l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9z`}
                fill="url(#sm-gold)"
                transform={n.state === 'current' ? `rotate(45 ${n.x} ${n.y})` : undefined}
              />
            )}
            <text x={n.x} y={n.y + 19} className="starmap__num">
              {toRoman(n.station)}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

/** A finished round as a small constellation (same shape as the big map). */
function Constellation({ round, label }: { round: number; label: string }) {
  const pts = Array.from({ length: 21 }, (_, i) => starPosition(i + 1));
  return (
    <li className="constellation">
      <svg viewBox={`0 0 ${STARMAP_VIEW.width} ${STARMAP_VIEW.height}`} aria-hidden="true">
        <path d={pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')} />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="7" />
        ))}
      </svg>
      <span className="small">{fmt(label, { n: round })}</span>
    </li>
  );
}

/* --------------------------------------------------------- Journey page */

export function JourneyPage({ parsed }: { parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  const s = useScreenText();
  useModules(['journey']);
  const locale = state.settings.locale;
  const facts = useFacts();
  const day = journeyDayToday(facts, state.todayKey);
  const map = starMapModel(day);
  const station = journeyStation(day);
  const reviews = availableReviews(facts);
  const chapters = availableChapters(facts, state.profile, pack.questions);
  const unseen = unseenKeys([...reviews, ...chapters], state.seen);
  const milestones = milestonesReached(journeyDays(facts)).reverse().slice(0, 5);
  const [allReviews, setAllReviews] = useState(false);
  const cardOf = (n: number) => pack.cards.find((c) => c.order === n);
  const stationText = tx('journey', station.textKey);
  const stateLabel = { reached: s.journeyMap.reached, current: s.journeyMap.current, ahead: s.journeyMap.ahead } as const;

  return (
    <div className="screen detail journey-page">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{s.journeyMap.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {s.journeyMap.title}
        </h1>
        <p className="muted journey-page__intro">{s.journeyMap.intro}</p>
      </header>

      <p className="journey-page__round eyebrow">
        {fmt(s.journeyMap.round, { n: map.round })} · {fmt(t.today.journeyDayShort, { n: day })}
      </p>
      <StarMapFigure map={map} label={fmt(s.journeyMap.mapLabel, { n: map.round, k: map.reached })} />

      <details className="explain journey-page__list">
        <summary>{s.journeyMap.listTitle}</summary>
        <ol className="station-list">
          {map.nodes.map((n) => {
            const card = cardOf(n.station);
            return (
              <li key={n.station} className={`station-list__item station-list__item--${n.state}`}>
                <span>{fmt(s.journeyMap.stationRow, { k: toRoman(n.station), card: card ? card.title[locale] : '' })}</span>
                <span className="small">{stateLabel[n.state]}</span>
              </li>
            );
          })}
        </ol>
      </details>

      {stationText ? (
        <section className="panel panel--brass journey-page__station" aria-labelledby="jp-station">
          <h2 id="jp-station" className="panel__label">
            <StarGlyph size={12} /> {s.journeyMap.todayStation} · {toRoman(station.station)}
          </h2>
          {station.pathIntroKey ? (
            <>
              <p className="eyebrow">{s.journeyMap.pathIntro}</p>
              <p className="italic-serif journey-page__path">{tx('journey', station.pathIntroKey)}</p>
            </>
          ) : null}
          <p>{stationText}</p>
          {station.roundCloseKey ? (
            <>
              <p className="eyebrow">{s.journeyMap.roundClose}</p>
              <p className="italic-serif journey-page__path">{tx('journey', station.roundCloseKey)}</p>
            </>
          ) : null}
        </section>
      ) : null}

      {map.completedRounds > 0 ? (
        <section className="journey-page__group" aria-labelledby="jp-const">
          <h2 id="jp-const" className="panel__label">
            {s.journeyMap.constellations}
          </h2>
          <ul className="constellations">
            {Array.from({ length: map.completedRounds }, (_, i) => (
              <Constellation key={i} round={i + 1} label={s.journeyMap.round} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="journey-page__group" aria-labelledby="jp-reviews">
        <h2 id="jp-reviews" className="panel__label">
          {s.journeyMap.reviews}
        </h2>
        {reviews.length === 0 ? (
          <p className="small">{s.journeyMap.reviewsEmpty}</p>
        ) : (
          <>
            <ul className="row-list">
              {(allReviews ? reviews : reviews.slice(0, REVIEWS_SHOWN)).map((r) => (
                <li key={r.key}>
                  <button type="button" className="row-link" onClick={() => navigate(`/grimoire/review/${r.kind}/${r.index}?from=${originOf(parsed)}`)}>
                    <span className="row-link__text">
                      <span>{reviewTitle(s, r.kind, r.index)}</span>
                      <span className="small">{fmt(s.review.span, { from: (r.index - 1) * (r.kind === 'week' ? 7 : 30) + 1, to: r.day })}</span>
                    </span>
                    {unseen.has(r.key) ? <span className="chip chip--new">{t.common.new}</span> : null}
                    <span aria-hidden="true">›</span>
                  </button>
                </li>
              ))}
            </ul>
            {reviews.length > REVIEWS_SHOWN ? (
              <button type="button" className="btn btn--quiet" aria-expanded={allReviews} onClick={() => setAllReviews((v) => !v)}>
                {allReviews ? t.common.close : `${s.journeyMap.reviews} (${reviews.length})`}
              </button>
            ) : null}
          </>
        )}
      </section>

      <section className="journey-page__group" aria-labelledby="jp-chapters">
        <h2 id="jp-chapters" className="panel__label">
          {s.journeyMap.chapters}
        </h2>
        {!state.profile?.archetypeId ? (
          <p className="small">{s.journeyMap.chaptersNoArchetype}</p>
        ) : chapters.length === 0 ? (
          <p className="small">{s.journeyMap.chaptersEmpty}</p>
        ) : (
          <ul className="row-list">
            {chapters.map((c) => (
              <li key={c.key}>
                <button type="button" className="row-link" onClick={() => navigate(`/grimoire/chapter/${c.id}?from=${originOf(parsed)}`)}>
                  <span className="row-link__text">
                    <span>{chapterTitle(s, c)}</span>
                    <span className="small">{getArchetype(pack, c.archetypeId).name[locale]}</span>
                  </span>
                  {unseen.has(c.key) ? <span className="chip chip--new">{t.common.new}</span> : null}
                  <span aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {milestones.length > 0 ? (
        <section className="journey-page__group" aria-labelledby="jp-milestones">
          <h2 id="jp-milestones" className="panel__label">
            {s.journeyMap.milestones}
          </h2>
          <ol className="milestone-list">
            {milestones.map((m) => {
              const key = milestoneTextKey(m.day);
              return (
                <li key={m.key} className="panel milestone-list__item">
                  <p className="eyebrow">{fmt(s.journeyMap.milestoneDay, { n: m.day })}</p>
                  {key ? <p className="italic-serif">{tx('journey', key)}</p> : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- Review */

function useMarkSeen(key: string | null) {
  const { state, actions } = useApp();
  const seen = key !== null && state.seen.some((s) => s.key === key);
  useEffect(() => {
    if (key && !seen) actions.markSeen(key).catch(() => undefined);
  }, [key, seen, actions]);
}

/** Day and month only under the card thumbnails (the year is in the page header). */
function shortDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short' }).format(date);
}

export function ReviewDetail({ kind, index, parsed }: { kind: ReviewKind; index: number; parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  const s = useScreenText();
  useModules(['journey']);
  const locale = state.settings.locale;
  const facts = useFacts();
  const open = availableReviews(facts).some((r) => r.kind === kind && r.index === index);
  useMarkSeen(open ? `review:${kind}:${index}` : null);
  if (!open) return <NotFound parsed={parsed} />;
  const review = buildReview(facts, pack, kind, index);
  const sentences = reviewSentences(review, {
    theme: (id) => getTheme(pack, id).label[locale],
    card: (id) => findCard(pack, id)?.title[locale] ?? '',
  });
  const first = review.dateKeys[0];
  const last = review.dateKeys[review.dateKeys.length - 1];
  return (
    <div className="screen detail review-page">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{s.journeyMap.reviews}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {reviewTitle(s, kind, index)}
        </h1>
        <p className="small">
          {fmt(s.review.span, { from: review.fromDay, to: review.toDay })}
          {first && last ? ` · ${formatDate(dateFromKey(first), locale)} – ${formatDate(dateFromKey(last), locale)}` : null}
        </p>
      </header>

      <section className="panel panel--brass review-page__text">
        {sentences.map((sentence) => {
          const text = tx('journey', sentence.key);
          if (!text) return null;
          // The lead-in ("Aus deinen Notizen:") is followed by the notes themselves.
          if (!sentence.key.startsWith('review.notes.')) return <p key={sentence.key}>{fmt(text, sentence.vars)}</p>;
          return (
            <div key={sentence.key} className="review-page__notes">
              <p>{text}</p>
              {review.notes.map((n) => (
                <blockquote key={n.dateKey} className="review-page__note">
                  <p className="italic-serif">{n.text}</p>
                  <footer className="small">{formatDate(dateFromKey(n.dateKey), locale)}</footer>
                </blockquote>
              ))}
            </div>
          );
        })}
      </section>

      {review.cards.length > 0 ? (
        <section className="journey-page__group" aria-labelledby="rv-cards">
          <h2 id="rv-cards" className="panel__label">
            {s.review.cards}
          </h2>
          <ul className="review-page__cards">
            {review.cards.map((c) => {
              const card = findCard(pack, c.cardId);
              return (
                <li key={c.dateKey}>
                  <button type="button" className="collection__link" onClick={() => navigate(`/grimoire/day/${c.dateKey}?from=${originOf(parsed)}`)}>
                    <OracleCard card={card ?? null} locale={locale} faceUp size="grid" label="" />
                    <span className="small">{shortDate(dateFromKey(c.dateKey), locale)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="small">{t.common.symbolic}</p>
    </div>
  );
}

/* -------------------------------------------------------------- Chapter */

export function ChapterDetail({ id, parsed }: { id: string; parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  const s = useScreenText();
  const { status, retry } = useModules(['chapters']);
  const locale = state.settings.locale;
  const facts = useFacts();
  const known = (CHAPTERS as readonly string[]).includes(id);
  const entry = known ? availableChapters(facts, state.profile, pack.questions).find((c) => c.id === (id as ChapterId)) : undefined;
  useMarkSeen(entry ? entry.key : null);
  if (!entry) return <NotFound parsed={parsed} />;
  const name = getArchetype(pack, entry.archetypeId).name[locale];
  const text = tx('chapters', chapterKey(entry.archetypeId, entry.id));
  return (
    <div className="screen detail chapter-page">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{name}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {chapterTitle(s, entry)}
        </h1>
      </header>
      {status === 'error' ? (
        <div className="notice">
          <p>{s.me.loadFailed}</p>
          <button type="button" className="btn btn--quiet" onClick={retry}>
            {t.common.retry}
          </button>
        </div>
      ) : !text ? (
        <p className="small" role="status">
          {s.me.loading}
        </p>
      ) : (
        <article className="panel chapter-page__text">
          {text.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
      )}
      <p className="small">{t.common.symbolic}</p>
    </div>
  );
}
