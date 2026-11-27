import { useState } from 'react';
import { goBack, navigate, type ParsedRoute } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { findCard } from '../../content/index.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { lensArchetypeOf } from '../../domain/lens.ts';
import { buildHistory, deriveCollection } from '../../domain/oracle.ts';
import { availableChapters, availableReviews, unseenKeys } from '../../domain/unlocks.ts';
import { fmt, formatDate, toRoman } from '../../i18n/index.ts';
import { Divider, useToast } from '../../ui/feedback.tsx';
import { Flank } from '../../ui/Ornaments.tsx';
import { IconBack, IconCandle, IconEye, IconQuill, IconSparkle } from '../../ui/Icons.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { Interpretation, savedSpread, Spread } from '../oracle/Oracle.tsx';

const toDate = (iso: string) => new Date(iso);

/* --------------------------------------------------------------- Overview */

export function Grimoire({ view }: { view: 'collection' | 'history' }) {
  const { t, pack, state } = useApp();
  const locale = state.settings.locale;
  const collection = deriveCollection(state.dailies, state.readings);
  const history = buildHistory(state.dailies, state.readings);
  const total = pack.cards.length;
  const pct = total ? Math.round((collection.size / total) * 100) : 0;
  const select = (v: 'collection' | 'history') => navigate(v === 'history' ? '/grimoire/history' : '/grimoire', { replace: true });
  const listFrom = view === 'history' ? '/grimoire/history' : '/grimoire';
  const facts = { dailies: state.dailies, readings: state.readings };
  const hasNew = unseenKeys([...availableReviews(facts), ...availableChapters(facts, state.profile, pack.questions)], state.seen).size > 0;

  return (
    <div className="screen grimoire">
      <header className="screen-head">
        <Flank className="screen-head__flank">{t.grimoire.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {t.grimoire.title}
        </h1>
      </header>

      <section className="panel panel--brass grimoire__progress" aria-label={fmt(t.grimoire.progress, { n: collection.size, total })}>
        <div className="grimoire__meter" role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={collection.size} aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="grimoire__count">
          <span className="display">{collection.size}</span>
          <span className="muted"> / {total}</span>
        </p>
        <p className="small">{fmt(t.grimoire.progress, { n: collection.size, total })}</p>
      </section>

      {/* V04: the journey (star map, reviews, chapters) and the eight archetypes; V05 turns this into the book. */}
      <ul className="row-list grimoire__entries">
        <li>
          <button type="button" className="row-link" onClick={() => navigate('/grimoire/journey')}>
            <span className="row-link__text">
              <span>{t.grimoire.journeyEntry}</span>
              <span className="small">{t.grimoire.journeyEntrySub}</span>
            </span>
            {hasNew ? <span className="chip chip--new">{t.common.new}</span> : null}
            <span aria-hidden="true">›</span>
          </button>
        </li>
        <li>
          <button type="button" className="row-link" onClick={() => navigate('/grimoire/archetypes')}>
            <span className="row-link__text">
              <span>{t.grimoire.archetypesEntry}</span>
              <span className="small">{t.grimoire.archetypesEntrySub}</span>
            </span>
            <span aria-hidden="true">›</span>
          </button>
        </li>
      </ul>

      {state.skippedCorrupt > 0 ? <p className="notice notice--error">{fmt(t.errors.corrupt, { n: state.skippedCorrupt })}</p> : null}

      <div className="segmented grimoire__tabs" role="tablist" aria-label={t.grimoire.filterLabel}>
        <button type="button" role="tab" id="tab-col" aria-controls="panel-grim" aria-selected={view === 'collection'} onClick={() => select('collection')}>
          {t.grimoire.collection}
        </button>
        <button type="button" role="tab" id="tab-his" aria-controls="panel-grim" aria-selected={view === 'history'} onClick={() => select('history')}>
          {t.grimoire.history}
        </button>
      </div>

      <div id="panel-grim" role="tabpanel" aria-labelledby={view === 'history' ? 'tab-his' : 'tab-col'}>
        {view === 'collection' ? (
          <>
            {collection.size === 0 ? (
              <div className="empty">
                <p className="muted">{t.grimoire.emptyCollection}</p>
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/today', { replace: true })}>
                  {t.grimoire.toToday}
                </button>
              </div>
            ) : null}
            <ul className="collection">
              {pack.cards.map((card) => {
                const entry = collection.get(card.id);
                return (
                  <li key={card.id} className="collection__item">
                    {entry ? (
                      <button type="button" className="collection__link" onClick={() => navigate(`/grimoire/card/${card.id}?from=${listFrom}`)}>
                        <OracleCard card={card} locale={locale} faceUp size="grid" label="" />
                        <span className="collection__name">
                          <span className="collection__num">{toRoman(card.order)}</span>
                          {card.title[locale]}
                        </span>
                        <span className="small">{fmt(t.grimoire.appearances, { n: entry.appearances })}</span>
                      </button>
                    ) : (
                      <div className="collection__locked">
                        <OracleCard card={null} locale={locale} faceUp={false} size="grid" label={t.grimoire.undiscovered} dimmed />
                        <span className="collection__name collection__name--muted">{t.grimoire.undiscovered}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        ) : history.length === 0 ? (
          <div className="empty">
            <p className="muted">{t.grimoire.emptyHistory}</p>
            <button type="button" className="btn btn--ghost" onClick={() => navigate('/today', { replace: true })}>
              {t.grimoire.toToday}
            </button>
          </div>
        ) : (
          <ul className="history">
            {history.map((item) => {
              const isDaily = item.kind === 'daily';
              const ids = isDaily ? [item.record.cardId] : item.reading.cardIds;
              const title = isDaily ? item.record.content.cardTitle : item.reading.content.themeLabel;
              const sub = isDaily ? item.record.content.themeLabel : item.reading.content.positions.map((p) => p.cardTitle).join(' · ');
              const date = isDaily ? formatDate(dateFromKey(item.record.dateKey), locale) : formatDate(toDate(item.reading.createdAt), locale);
              const to = isDaily ? `/grimoire/day/${item.record.dateKey}?from=${listFrom}` : `/grimoire/reading/${item.reading.id}?from=${listFrom}`;
              return (
                <li key={isDaily ? `d-${item.record.dateKey}` : `r-${item.reading.id}`}>
                  <button type="button" className="history__row" onClick={() => navigate(to)}>
                    <span className={`history__cards history__cards--${ids.length}`} aria-hidden="true">
                      {ids.map((id) => (
                        <OracleCard key={id} card={findCard(pack, id) ?? null} locale={locale} faceUp size="mini" label="" />
                      ))}
                    </span>
                    <span className="history__text">
                      <span className="eyebrow">{isDaily ? t.grimoire.daily : t.grimoire.reading}</span>
                      <span className="history__title">{title}</span>
                      <span className="small">
                        {date} · {sub}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Detail shell */

export function DetailHeader({ parsed }: { parsed: ParsedRoute }) {
  const { t } = useApp();
  return (
    <div className="detail__top">
      <button type="button" className="back-link" onClick={() => goBack(parsed)}>
        <IconBack size={20} /> {t.common.back}
      </button>
    </div>
  );
}

export function NotFound({ parsed }: { parsed: ParsedRoute }) {
  const { t } = useApp();
  return (
    <div className="screen detail">
      <DetailHeader parsed={parsed} />
      <div className="empty">
        <h1 className="display h2" tabIndex={-1}>
          {t.detail.notFound}
        </h1>
        <button type="button" className="btn btn--ghost" onClick={() => navigate('/grimoire', { replace: true })}>
          {t.detail.toGrimoire}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Card detail */

export function CardDetail({ id, parsed }: { id: string; parsed: ParsedRoute }) {
  const { t, pack, state } = useApp();
  const locale = state.settings.locale;
  const card = findCard(pack, id);
  const entry = deriveCollection(state.dailies, state.readings).get(id);
  if (!card || !entry) return <NotFound parsed={parsed} />;
  const history = buildHistory(state.dailies, state.readings).filter((h) =>
    h.kind === 'daily' ? h.record.cardId === id : h.reading.cardIds.includes(id),
  );
  return (
    <div className="screen detail">
      <DetailHeader parsed={parsed} />
      <div className="card-stage is-revealed">
        <span className="card-stage__aura" aria-hidden="true" />
        <OracleCard card={card} locale={locale} faceUp size="hero" label={`${toRoman(card.order)} · ${card.title[locale]}`} />
      </div>
      <div className="today__title">
        <p className="today__numeral">{toRoman(card.order)}</p>
        <h1 className="display h1" tabIndex={-1}>
          {card.title[locale]}
        </h1>
        <p className="italic-serif today__essence">{card.essence[locale]}</p>
        <p className="small">{fmt(t.grimoire.firstSeen, { date: formatDate(toDate(entry.firstSeenAt), locale) })}</p>
      </div>
      <Divider />
      <section>
        <h2 className="panel__label">{t.detail.appearances}</h2>
        <ul className="history">
          {history.map((h) => {
            const isDaily = h.kind === 'daily';
            const to = isDaily ? `/grimoire/day/${h.record.dateKey}?from=/grimoire` : `/grimoire/reading/${h.reading.id}?from=/grimoire`;
            const date = isDaily ? formatDate(dateFromKey(h.record.dateKey), locale) : formatDate(toDate(h.reading.createdAt), locale);
            return (
              <li key={isDaily ? h.record.dateKey : h.reading.id}>
                <button type="button" className="history__row history__row--compact" onClick={() => navigate(to)}>
                  <span className="history__text">
                    <span className="eyebrow">{isDaily ? t.grimoire.daily : t.grimoire.reading}</span>
                    <span className="history__title">{isDaily ? h.record.content.themeLabel : h.reading.content.themeLabel}</span>
                    <span className="small">{date}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------- Day detail */

export function DayDetail({ dateKey, parsed }: { dateKey: string; parsed: ParsedRoute }) {
  const { t, pack, state, actions } = useApp();
  const locale = state.settings.locale;
  const record = state.dailies.find((d) => d.dateKey === dateKey);
  if (!record) return <NotFound parsed={parsed} />;
  const card = findCard(pack, record.cardId) ?? null;
  const c = record.content;
  return (
    <div className="screen detail">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">
          {t.grimoire.daily} · {formatDate(dateFromKey(record.dateKey), locale)}
        </Flank>
        <span className="chip">{c.themeLabel}</span>
      </header>
      <div className="card-stage is-revealed">
        <span className="card-stage__aura" aria-hidden="true" />
        <OracleCard card={card} locale={record.locale} faceUp size="hero" label={`${toRoman(c.cardOrder)} · ${c.cardTitle}`} />
      </div>
      <div className="today__title">
        <p className="today__numeral">{toRoman(c.cardOrder)}</p>
        <h1 className="display h1" tabIndex={-1}>
          {c.cardTitle}
        </h1>
        <p className="italic-serif today__essence">{c.essence}</p>
      </div>
      <Divider />
      <div className="panel-stack">
        <section className="panel panel--brass">
          <h2 className="panel__label">
            <IconSparkle size={16} /> {t.today.message}
          </h2>
          <p className="today__message">{c.message}</p>
        </section>
        {c.lens ? (
          <section className="panel">
            <h2 className="panel__label">{lensArchetypeOf(record) === record.archetypeId ? t.today.lens : t.today.lensComplement}</h2>
            <p>{c.lens}</p>
          </section>
        ) : null}
        <section className="panel">
          <h2 className="panel__label">
            <IconEye size={16} /> {t.today.reflection}
          </h2>
          <p className="italic-serif today__question">{c.reflection}</p>
        </section>
        <section className="panel">
          <h2 className="panel__label">
            <IconCandle size={16} /> {t.today.ritual}
          </h2>
          <p>{c.ritual}</p>
        </section>
        <p className="small detail__original">
          {fmt(t.detail.original, { date: formatDate(dateFromKey(record.dateKey), locale) })}
          {record.locale !== locale ? ` · ${fmt(t.today.storedLocale, { lang: t.languages[record.locale] })}` : ''}
        </p>
        <NoteEditor key={record.dateKey} initial={record.note} onSave={(note) => actions.updateDailyNote(record.dateKey, note)} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- Reading detail */

export function ReadingDetail({ id, parsed }: { id: string; parsed: ParsedRoute }) {
  const { t, state, actions } = useApp();
  const locale = state.settings.locale;
  const reading = state.readings.find((r) => r.id === id);
  if (!reading) return <NotFound parsed={parsed} />;
  return (
    <div className="screen detail">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">
          {t.grimoire.reading} · {formatDate(toDate(reading.createdAt), locale)}
        </Flank>
        <h1 className="display h2" tabIndex={-1}>
          {reading.content.themeLabel}
        </h1>
      </header>
      <Spread {...savedSpread(reading)} />
      <Interpretation content={reading.content} />
      <p className="small detail__original">
        {fmt(t.detail.original, { date: formatDate(toDate(reading.createdAt), locale) })}
        {reading.locale !== locale ? ` · ${fmt(t.today.storedLocale, { lang: t.languages[reading.locale] })}` : ''}
      </p>
      <NoteEditor key={reading.id} initial={reading.note} onSave={(note) => actions.updateReadingNote(reading.id, note)} />
    </div>
  );
}

/* ------------------------------------------------------------- Note editor */

function NoteEditor({ initial, onSave }: { initial: string; onSave(note: string): Promise<void> }) {
  const { t } = useApp();
  const toast = useToast();
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  const dirty = value !== saved;
  const save = async () => {
    setBusy(true);
    try {
      await onSave(value.trim());
      setSaved(value.trim());
      setValue(value.trim());
      toast(t.detail.noteSaved);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel note">
      <label className="panel__label" htmlFor="note-field">
        <IconQuill size={16} /> {t.detail.note}
      </label>
      <textarea
        id="note-field"
        className="note__field"
        value={value}
        maxLength={2000}
        rows={4}
        placeholder={t.detail.notePlaceholder}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="button" className="btn btn--ghost note__save" onClick={save} disabled={!dirty || busy}>
        {t.detail.saveNote}
      </button>
    </section>
  );
}
