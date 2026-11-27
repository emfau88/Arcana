/**
 * The Grimoire as a book (V05.3, PRODUCT_SYSTEMS E, S-55): the cover with the names of one's
 * archetypes and the contents, then a page per chapter. Cards, journal and rituals live here;
 * archetypes and journey keep their pages from V04. Everything shown is derived from stored facts.
 * Loaded as its own chunk.
 */
import { useEffect, useMemo, useState } from 'react';
import { navigate, type ParsedRoute } from '../../app/router.ts';
import { factsOf, useApp } from '../../app/store.tsx';
import { findCard, getArchetype } from '../../content/index.ts';
import { BOOK_CHAPTERS, BOOK_OPENED, CHAPTER_PATH, metRituals, newCardLevels, type BookChapterId } from '../../domain/book.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { availableFilters, indexJournal, journalItems, queryJournal, type JournalFilter, type JournalItem } from '../../domain/journal.ts';
import { cardEncounters, cardLevel, journeyDayToday, levelCounts } from '../../domain/progress.ts';
import { LEVEL_PHASE } from '../../domain/study.ts';
import { availableChapters, availableReviews, unseenKeys } from '../../domain/unlocks.ts';
import { fmt, formatDate, toRoman } from '../../i18n/index.ts';
import { useScreenText } from '../../i18n/screens.ts';
import { ConfirmDialog, useToast } from '../../ui/feedback.tsx';
import { MoonPhase } from '../../ui/MoonPhase.tsx';
import { Flank } from '../../ui/Ornaments.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { DetailHeader } from './Grimoire.tsx';
import './book.css';

const base = import.meta.env.BASE_URL;
const vignette = (name: BookChapterId | 'tailpiece') => `${base}world/vignettes/${name}.webp`;
const numberOf = (id: BookChapterId) => toRoman(BOOK_CHAPTERS.indexOf(id) + 1);

/* ------------------------------------------------------------------ Cover */

export function Book() {
  const { t, pack, state, actions } = useApp();
  const s = useScreenText().book;
  const locale = state.settings.locale;
  const facts = factsOf(state);
  const counts = levelCounts(cardEncounters(facts));
  const journal = journalItems(facts).length;
  const rituals = metRituals(state.dailies, state.events).length;
  const day = journeyDayToday(facts, state.todayKey);
  const journeyNew = unseenKeys([...availableReviews(facts), ...availableChapters(facts, state.profile, pack.questions)], state.seen).size > 0;
  const cardsNew = newCardLevels(facts, state.seen).size > 0;
  const opened = state.seen.some((f) => f.key === BOOK_OPENED);

  // The first visit marks the start of the "new" glow (E2), so an update does not light up every card.
  useEffect(() => {
    if (!opened) void actions.markSeen(BOOK_OPENED).catch(() => undefined);
  }, [opened, actions]);

  const profile = state.profile;
  const main = profile?.archetypeId ? getArchetype(pack, profile.archetypeId) : null;
  const second = main && profile?.secondaryArchetypeId ? getArchetype(pack, profile.secondaryArchetypeId) : null;
  const names = [main, second].filter((a) => a !== null && a !== undefined).map((a) => a!.name[locale]);

  const count = (id: BookChapterId): string => {
    switch (id) {
      case 'cards':
        return fmt(s.cardsCount, { n: counts[1], total: pack.cards.length });
      case 'archetypes':
        return s.archetypesCount;
      case 'journal':
        return journal === 0 ? s.journalCountNone : journal === 1 ? s.journalCountOne : fmt(s.journalCount, { n: journal });
      case 'rituals':
        return rituals === 0 ? s.ritualsCountNone : rituals === 1 ? s.ritualsCountOne : fmt(s.ritualsCount, { n: rituals });
      case 'journey':
        return day === 0 ? s.journeyCountNone : fmt(s.journeyCount, { n: day });
    }
  };
  const isNew = (id: BookChapterId) => (id === 'cards' && cardsNew) || (id === 'journey' && journeyNew);

  return (
    <div className="screen book">
      <header className="screen-head">
        <Flank className="screen-head__flank">{s.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {t.grimoire.title}
        </h1>
      </header>

      <figure className="book__cover">
        <img src={`${base}world/grimoire-book.webp`} width={900} height={600} alt="" decoding="async" />
        {names.length ? <figcaption className="book__owner">{names.join(' · ')}</figcaption> : null}
      </figure>

      <section className="book-page book__contents" aria-labelledby="book-contents">
        <h2 id="book-contents" className="book-page__title">
          {s.contents}
        </h2>
        <ol className="book__chapters">
          {BOOK_CHAPTERS.map((id) => (
            <li key={id}>
              <button type="button" className="book__chapter" onClick={() => navigate(CHAPTER_PATH[id])}>
                <img className="book__vignette" src={vignette(id)} width={52} height={52} alt="" decoding="async" />
                <span className="book__num">{numberOf(id)}</span>{' '}
                <span className="book__chapter-text">
                  <span className="book__chapter-title">{s.chapters[id]}</span>
                  <span className="book__count">{count(id)}</span>
                </span>
                {isNew(id) ? <span className="chip chip--new book__new">{t.common.new}</span> : null}
                <span className="book__chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ol>
        <img className="book-page__tail" src={vignette('tailpiece')} width={96} height={96} alt="" decoding="async" />
      </section>

      {state.skippedCorrupt > 0 ? <p className="notice notice--error">{fmt(t.errors.corrupt, { n: state.skippedCorrupt })}</p> : null}
    </div>
  );
}

/* --------------------------------------------------------------- Chapters */

function ChapterHead({ id, count, intro }: { id: BookChapterId; count: string; intro: string }) {
  const s = useScreenText().book;
  return (
    <header className="chapter-head">
      <img className="chapter-head__vignette" src={vignette(id)} width={96} height={96} alt="" decoding="async" />
      <p className="chapter-head__num">{fmt(s.chapterNum, { n: numberOf(id) })}</p>
      <h1 className="display h1" tabIndex={-1}>
        {s.chapters[id]}
      </h1>
      <p className="chapter-head__count">{count}</p>
      <p className="chapter-head__intro">{intro}</p>
    </header>
  );
}

export function BookChapter({ chapter, parsed }: { chapter: 'cards' | 'journal' | 'rituals'; parsed: ParsedRoute }) {
  return (
    <div className="screen book-chapter">
      <DetailHeader parsed={parsed} />
      {chapter === 'cards' ? <CardsChapter /> : chapter === 'journal' ? <JournalChapter /> : <RitualsChapter />}
    </div>
  );
}

/* ------------------------------------------------------------ I · Cards */

function CardsChapter() {
  const { t, pack, state } = useApp();
  const s = useScreenText().book;
  const levels = useScreenText().card.levelNames;
  const locale = state.settings.locale;
  const facts = factsOf(state);
  const encounters = cardEncounters(facts);
  const counts = levelCounts(encounters);
  const fresh = newCardLevels(facts, state.seen);
  const found = pack.cards.filter((c) => cardLevel(encounters.get(c.id)) > 0);
  const waiting = pack.cards.length - found.length;
  const from = '/grimoire/cards';

  return (
    <>
      <ChapterHead id="cards" count={fmt(s.cardsCount, { n: counts[1], total: pack.cards.length })} intro={s.cardsIntro} />
      {counts[1] > 0 ? (
        <p className="book-chapter__levels">{fmt(s.levels, { a: counts[1], b: counts[2], c: counts[3], d: counts[4] })}</p>
      ) : (
        <div className="book-page book-empty">
          <p className="book-empty__text">{s.cardsEmpty}</p>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/today', { replace: true })}>
            {t.grimoire.toToday}
          </button>
        </div>
      )}
      {/* Design plan point 7 (D-63): what is discovered comes first, the rest is one quiet line. */}
      <ul className="collection">
        {found.map((card) => {
          const level = cardLevel(encounters.get(card.id));
          const isNew = fresh.has(card.id);
          const cls = `collection__item${level === 4 ? ' collection__item--gold' : ''}${isNew ? ' collection__item--new' : ''}`;
          return (
            <li key={card.id} className={cls}>
              <button type="button" className="collection__link" onClick={() => navigate(`/grimoire/card/${card.id}?from=${from}`)}>
                <OracleCard card={card} locale={locale} faceUp size="grid" label="" />
                <span className="collection__name">
                  <span className="collection__num">{toRoman(card.order)}</span>
                  {card.title[locale]}
                </span>
                <span className="collection__level">
                  <MoonPhase phase={LEVEL_PHASE[level]} size={16} />
                  {levels[level]}
                </span>
                {isNew ? <span className="chip chip--new">{t.common.new}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {found.length > 0 && waiting > 0 ? (
        <p className="book-chapter__waiting">{waiting === 1 ? s.waitingOne : fmt(s.waiting, { n: waiting })}</p>
      ) : null}
    </>
  );
}

/* ---------------------------------------------------------- III · Journal */

function JournalChapter() {
  const { t, pack, state, actions } = useApp();
  const s = useScreenText().book;
  const toast = useToast();
  const locale = state.settings.locale;
  const { dailies, readings, journal, events } = state;
  const items = useMemo(() => journalItems({ dailies, readings, journal, events }), [dailies, readings, journal, events]);
  const index = useMemo(() => indexJournal(items, pack, locale), [items, pack, locale]);
  const filters = availableFilters(items);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<JournalFilter | null>(null);
  const [written, setWritten] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [doomed, setDoomed] = useState<JournalItem | null>(null);
  const shown = queryJournal(index, { text, filters: filter ? [filter] : [], written });
  const searching = text.trim().length > 0 || filter !== null || written;
  const count = items.length === 0 ? s.journalCountNone : items.length === 1 ? s.journalCountOne : fmt(s.journalCount, { n: items.length });

  const save = async () => {
    setBusy(true);
    try {
      await actions.writeJournalEntry('free', draft);
      setDraft('');
      toast(s.saved);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    const item = doomed;
    setDoomed(null);
    if (!item) return;
    try {
      await actions.deleteJournalItem(item);
      toast(s.deleted);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };

  return (
    <>
      <ChapterHead id="journal" count={count} intro={s.journalIntro} />

      <div className="panel journal-write">
        <label className="panel__label" htmlFor="journal-write">
          {s.write}
        </label>
        <textarea
          id="journal-write"
          className="note__field"
          value={draft}
          maxLength={2000}
          rows={3}
          placeholder={t.detail.notePlaceholder}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="button" className="btn btn--ghost journal-write__save" onClick={save} disabled={busy || draft.trim().length === 0}>
          {s.save}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="book-page book-empty">
          <p className="book-empty__text">{s.journalEmpty}</p>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/today', { replace: true })}>
            {t.grimoire.toToday}
          </button>
        </div>
      ) : (
        <>
          <div className="journal-tools">
            <input
              type="search"
              className="journal-tools__search"
              value={text}
              aria-label={s.search}
              placeholder={s.searchPlaceholder}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="journal-tools__filters" role="group" aria-label={s.filterLabel}>
              <button type="button" className="chip journal-tools__chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>
                {s.filterAll}
              </button>
              {filters.map((f) => (
                <button key={f} type="button" className="chip journal-tools__chip" aria-pressed={filter === f} onClick={() => setFilter(filter === f ? null : f)}>
                  {s.filters[f]}
                </button>
              ))}
              <button type="button" className="chip journal-tools__chip" aria-pressed={written} onClick={() => setWritten(!written)}>
                {s.written}
              </button>
            </div>
          </div>
          <p className="journal-tools__result" aria-live="polite">
            {searching ? (shown.length === 0 ? s.noResults : shown.length === 1 ? s.resultsOne : fmt(s.results, { n: shown.length })) : ''}
          </p>
          <ul className="history journal">
            {shown.map((item) => (
              <JournalRow key={item.key} item={item} onDelete={() => setDoomed(item)} />
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={doomed !== null}
        title={s.deleteTitle}
        body={s.deleteBody}
        confirmLabel={s.deleteConfirm}
        cancelLabel={s.deleteCancel}
        danger
        onConfirm={remove}
        onCancel={() => setDoomed(null)}
      />
    </>
  );
}

function JournalRow({ item, onDelete }: { item: JournalItem; onDelete(): void }) {
  const { t, pack, state } = useApp();
  const s = useScreenText().book;
  const locale = state.settings.locale;
  const from = '/grimoire/journal';
  const date = formatDate(dateFromKey(item.dateKey), locale);
  const cards = item.cardIds.map((id) => findCard(pack, id)).filter((c) => c !== undefined);
  const titles = cards.map((c) => c!.title[locale]).join(' · ');
  let eyebrow: string;
  let title: string;
  let to: string | null;
  if (item.source === 'daily') {
    eyebrow = t.grimoire.daily;
    title = state.dailies.find((d) => d.dateKey === item.id)?.content.cardTitle ?? titles;
    to = `/grimoire/day/${item.id}?from=${from}`;
  } else if (item.source === 'reading') {
    const reading = state.readings.find((r) => r.id === item.id);
    eyebrow = item.spreadName ?? t.grimoire.reading;
    title = reading?.content.themeLabel ?? titles;
    to = `/grimoire/reading/${item.id}?from=${from}`;
  } else {
    eyebrow = s.kinds[item.kind === 'study' ? 'study' : item.kind === 'reflection' ? 'reflection' : 'free'];
    title = titles;
    to = cards[0] ? `/grimoire/card/${cards[0].id}?from=${from}` : null;
  }
  const sub = item.source === 'daily' ? (state.dailies.find((d) => d.dateKey === item.id)?.content.themeLabel ?? '') : item.source === 'reading' ? titles : '';
  const body = (
    <>
      {cards.length ? (
        <span className={`history__cards history__cards--${cards.length}`} aria-hidden="true">
          {cards.map((c) => (
            <OracleCard key={c!.id} card={c!} locale={locale} faceUp size="mini" label="" />
          ))}
        </span>
      ) : null}
      <span className="history__text">
        <span className="eyebrow">{eyebrow}</span>
        {title ? <span className="history__title">{title}</span> : null}
        <span className="small">{sub ? `${date} · ${sub}` : date}</span>
      </span>
    </>
  );
  return (
    <li className="journal__item">
      {to ? (
        <button type="button" className="history__row" onClick={() => navigate(to)}>
          {body}
        </button>
      ) : (
        <div className="history__row history__row--static">{body}</div>
      )}
      {item.text ? (
        <div className="journal__words">
          <p className="italic-serif journal__text">{item.text}</p>
          <button type="button" className="text-link journal__delete" onClick={onDelete}>
            {s.delete}
          </button>
        </div>
      ) : null}
    </li>
  );
}

/* ------------------------------------------------------------ IV · Rituals */

function RitualsChapter() {
  const { t, pack, state, actions } = useApp();
  const s = useScreenText().book;
  const toast = useToast();
  const locale = state.settings.locale;
  const rituals = metRituals(state.dailies, state.events);
  const today = state.todayKey;
  const count = rituals.length === 0 ? s.ritualsCountNone : rituals.length === 1 ? s.ritualsCountOne : fmt(s.ritualsCount, { n: rituals.length });
  // Before the first daily card: three simple rituals to begin with (PRODUCT_SYSTEMS E, chapter V).
  const starters = [0, 17, 19].map((order) => pack.cards.find((c) => c.order === order)).filter((c) => c !== undefined);

  const mark = async (id: string) => {
    try {
      await actions.markRitualDone(id);
      toast(s.doneToast);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };

  return (
    <>
      <ChapterHead id="rituals" count={count} intro={s.ritualsIntro} />
      {rituals.length === 0 ? (
        <div className="book-page book-empty">
          <p className="book-empty__text">{s.ritualsEmpty}</p>
          <ul className="ritual-list ritual-list--starters">
            {starters.map((c) => (
              <li key={c!.id} className="ritual-list__starter">
                <p className="ritual-list__from">{fmt(s.ritualFrom, { card: c!.title[locale] })}</p>
                <p>{c!.ritual[locale]}</p>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/today', { replace: true })}>
            {t.grimoire.toToday}
          </button>
        </div>
      ) : (
        <ul className="ritual-list">
          {rituals.map((r) => {
            const card = findCard(pack, r.cardId);
            const doneToday = r.doneKeys.includes(today);
            const times = r.doneKeys.length;
            return (
              <li key={r.id} className="panel ritual">
                <p className="panel__label">{fmt(s.ritualFrom, { card: card ? card.title[locale] : r.cardId })}</p>
                <p className="ritual__text">{r.text}</p>
                <p className="small muted">
                  {fmt(s.ritualMet, { date: formatDate(dateFromKey(r.lastKey), locale) })}
                  {times > 0 ? ` · ${times === 1 ? s.ritualDoneOne : fmt(s.ritualDone, { n: times })}` : ''}
                </p>
                <button type="button" className="btn btn--ghost ritual__mark" onClick={() => mark(r.id)} disabled={doneToday} aria-pressed={doneToday}>
                  {doneToday ? s.doneToday : s.markDone}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
