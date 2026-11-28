/**
 * The Discover tab (V06.1, V06.5; IA §2, PRODUCT_SYSTEMS G, H): hub with one search for three
 * worlds, numbers, angel numbers and the symbol lexicon, plus the voluntary birth date under "Ich".
 * Knowledge is never locked: every page opens for everyone; texts load with their module.
 * Loaded as its own chunk, so "Heute" does not grow.
 */
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { navigate, originOf, type ParsedRoute } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { useModules, type ModuleStatus } from '../../app/useModules.ts';
import { findCard, getArchetype } from '../../content/index.ts';
import { LEXICON_SYMBOL_IDS, symbolSources, type LexiconSymbolId } from '../../content/symbols.ts';
import { angelTextKeys, CURATED_SEQUENCES, encounterCounts, ENCOUNTER_NOTE_MAX, lookupAngel, parseAngelInput, PLACE_MAX, type AngelLookup } from '../../domain/angel.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { searchDiscover } from '../../domain/discover-search.ts';
import { CYCLE_NUMBERS, isPlausibleBirthDate, LIFE_NUMBERS, MIN_BIRTH_YEAR, NUMBER_CARD, numerology, type LifeNumber, type NumberPath } from '../../domain/numerology.ts';
import { deriveCollection } from '../../domain/oracle.ts';
import type { CardId, FavoriteKind } from '../../domain/types.ts';
import { useDiscoverText, type DiscoverMessages } from '../../i18n/discover.ts';
import { fmt, formatDate, toRoman } from '../../i18n/index.ts';
import { ConfirmDialog, useToast } from '../../ui/feedback.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { Flank, StarGlyph } from '../../ui/Ornaments.tsx';
import { Prose } from '../../ui/Prose.tsx';
import { DetailHeader } from '../grimoire/Grimoire.tsx';
import './discover.css';

const base = import.meta.env.BASE_URL;
export const symbolSrc = (id: LexiconSymbolId, thumb = false) => `${base}symbols/${thumb ? 'thumbs/' : ''}${id}.webp`;

const isLexiconSymbol = (id: string): id is LexiconSymbolId => (LEXICON_SYMBOL_IDS as readonly string[]).includes(id);
const lifeNumberOf = (n: string): LifeNumber | null => {
  const v = Number(n);
  return String(v) === n && (LIFE_NUMBERS as readonly number[]).includes(v) ? (v as LifeNumber) : null;
};

/* ------------------------------------------------------------ Shared parts */

/** The large numeral in an ornament medallion, drawn in code (G5: no image, no numeral in art). */
export function Medallion({ label, size = 'm', className = '' }: { label: string; size?: 's' | 'm' | 'l'; className?: string }) {
  return (
    <span className={`medallion medallion--${size} ${label.length > 2 ? 'medallion--long' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="medallion__ring">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="39" strokeDasharray="1.5 3.5" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="m50 2.5 1.6 4.1-1.6 1.9-1.6-1.9z" transform={`rotate(${i * 45} 50 50)`} />
        ))}
      </svg>
      <span className="medallion__label">{label}</span>
    </span>
  );
}

/** Loading or retry line while a module is on its way; the page shows its frame meanwhile. */
function ModuleState({ status, retry }: { status: ModuleStatus; retry: () => void }) {
  const { t } = useApp();
  const d = useDiscoverText();
  if (status === 'ready') return null;
  if (status === 'loading')
    return (
      <p className="small discover__status" role="status">
        {d.common.loading}
      </p>
    );
  return (
    <div className="notice discover__status">
      <p>{d.common.loadFailed}</p>
      <button type="button" className="btn btn--quiet" onClick={retry}>
        {t.common.retry}
      </button>
    </div>
  );
}

/** `titleHidden`: the medallion above already shows the number, so the heading is for screen readers only. */
function Head({ eyebrow, title, intro, titleHidden, children }: { eyebrow: string; title: string; intro?: string; titleHidden?: boolean; children?: ReactNode }) {
  return (
    <header className="screen-head discover__head">
      {children}
      <Flank className="screen-head__flank">{eyebrow}</Flank>
      <h1 className={titleHidden ? 'sr-only' : 'display h1'} tabIndex={-1}>
        {title}
      </h1>
      {intro ? <p className="muted discover__intro">{intro}</p> : null}
    </header>
  );
}

function Section({ id, label, children, brass }: { id: string; label: string; children: ReactNode; brass?: boolean }) {
  return (
    <section className={brass ? 'panel panel--brass' : 'panel'} aria-labelledby={id}>
      <h2 id={id} className="panel__label">
        {label}
      </h2>
      {children}
    </section>
  );
}

function FavoriteButton({ kind, id }: { kind: FavoriteKind; id: string }) {
  const { state, actions, t } = useApp();
  const d = useDiscoverText();
  const toast = useToast();
  const on = state.favorites.some((f) => f.key === `${kind}:${id}`);
  const toggle = async () => {
    try {
      toast((await actions.toggleFavorite(kind, id)) ? d.angel.favoriteAdded : d.angel.favoriteRemoved);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };
  return (
    <button type="button" className="btn btn--ghost discover__favorite" aria-pressed={on} onClick={() => void toggle()}>
      <StarGlyph size={14} className={on ? 'discover__fav-star is-on' : 'discover__fav-star'} />
      {on ? d.angel.favorited : d.angel.favorite}
    </button>
  );
}

/** Cards as small faces; a card already met opens its page (same rule as the archetype resonance). */
function CardRow({ cards, from }: { cards: readonly CardId[]; from: string }) {
  const { pack, state } = useApp();
  const locale = state.settings.locale;
  const collection = deriveCollection(state.dailies, state.readings);
  return (
    <ul className="discover-cards">
      {cards.map((cid) => {
        const card = findCard(pack, cid);
        if (!card) return null;
        const inner = (
          <>
            <OracleCard card={card} locale={locale} faceUp size="grid" label="" />
            <span className="collection__name">
              <span className="collection__num">{toRoman(card.order)}</span>
              {card.title[locale]}
            </span>
          </>
        );
        return (
          <li key={cid}>
            {collection.has(cid) ? (
              <button type="button" className="collection__link" onClick={() => navigate(`/grimoire/card/${cid}?from=${from}`)}>
                {inner}
              </button>
            ) : (
              <div className="collection__link">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------------------------------------------------------- Hub */

export function DiscoverHub({ parsed }: { parsed: ParsedRoute }) {
  const { tx } = useApp();
  const d = useDiscoverText();
  const { status } = useModules(['symbols']);
  const [query, setQuery] = useState('');
  const hits = useMemo(() => searchDiscover(query, (id) => (status === 'ready' ? tx('symbols', `symbol.${id}.name`) : '')), [query, status, tx]);
  const from = originOf(parsed);
  const worlds: { path: string; title: string; body: string; emblem: ReactNode }[] = [
    { path: '/discover/numbers', title: d.hub.numbers, body: d.hub.numbersBody, emblem: <Medallion label="9" size="s" /> },
    { path: '/discover/angel', title: d.hub.angels, body: d.hub.angelsBody, emblem: <Medallion label="11:11" size="s" /> },
    {
      path: '/discover/symbols',
      title: d.hub.symbols,
      body: d.hub.symbolsBody,
      emblem: <img className="discover-world__symbol" src={symbolSrc('star', true)} alt="" width={56} height={56} decoding="async" />,
    },
  ];
  const go = (path: string) => navigate(`${path}?from=${from}`);

  return (
    <div className="screen discover">
      <Head eyebrow={d.hub.eyebrow} title={d.hub.title} intro={d.hub.intro} />
      <form className="panel discover-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="panel__label" htmlFor="discover-search">
          {d.hub.searchLabel}
        </label>
        <input
          id="discover-search"
          type="search"
          className="discover__input"
          value={query}
          autoComplete="off"
          placeholder={d.hub.searchPlaceholder}
          aria-describedby="discover-search-hint"
          onChange={(e) => setQuery(e.target.value)}
        />
        <p id="discover-search-hint" className="small">
          {d.hub.searchHint}
        </p>
        {query.trim() ? (
          hits.length === 0 ? (
            <p className="small discover-search__none" role="status">
              {d.hub.noResults}
            </p>
          ) : (
            <ul className="discover-search__hits" aria-live="polite">
              {hits.map((h) => {
                const key = h.kind === 'number' ? `n${h.n}` : h.kind === 'angel' ? `a${h.display}` : `s${h.id}`;
                const label =
                  h.kind === 'number'
                    ? fmt(d.hub.resultNumber, { n: h.n })
                    : h.kind === 'angel'
                      ? fmt(d.hub.resultAngel, { seq: h.display })
                      : `${tx('symbols', `symbol.${h.id}.name`)} · ${d.hub.resultSymbol}`;
                const path = h.kind === 'number' ? `/discover/numbers/${h.n}` : h.kind === 'angel' ? `/discover/angel/${h.display}` : `/discover/symbols/${h.id}`;
                return (
                  <li key={key}>
                    <button type="button" className="discover-search__hit" onClick={() => go(path)}>
                      {h.kind === 'symbol' ? <img src={symbolSrc(h.id, true)} alt="" width={32} height={32} /> : <Medallion label={h.kind === 'number' ? String(h.n) : h.display} size="s" />}
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : null}
      </form>

      <h2 className="sr-only">{d.hub.worldsLabel}</h2>
      <ul className="discover-worlds">
        {worlds.map((w) => (
          <li key={w.path}>
            <button type="button" className="panel discover-world" onClick={() => go(w.path)}>
              <span className="discover-world__emblem">{w.emblem}</span>
              <span className="discover-world__text">
                <span className="display h3 discover-world__title">{w.title}</span>
                <span className="small discover-world__body">{w.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------- Numbers */

function PathLine({ path, d }: { path: NumberPath; d: DiscoverMessages }) {
  const partLabel = { month: d.numbers.partMonth, day: d.numbers.partDay, year: d.numbers.partYear, 'personal-year': '', 'personal-month': '' } as const;
  return (
    <ol className="discover-path">
      {path.parts.map((p) => (
        <li key={p.kind}>
          <span className="discover-path__label">{partLabel[p.kind]}</span> {p.chain.join(' → ')}
        </li>
      ))}
      <li className="discover-path__sum">
        <span className="discover-path__label">{d.numbers.partSum}</span> {path.parts.map((p) => p.value).join(' + ')} = {path.chain.join(' → ')}
      </li>
    </ol>
  );
}

export function NumbersPage({ parsed }: { parsed: ParsedRoute }) {
  const { t, state, tx } = useApp();
  const d = useDiscoverText();
  const { status, retry } = useModules(['numbers']);
  const ready = status === 'ready';
  const birthDate = state.personal?.birthDate;
  const core = birthDate ? numerology(birthDate, state.todayKey) : null;
  const year = Number(state.todayKey.slice(0, 4));
  const self = originOf(parsed);
  const open = (n: number) => navigate(`/discover/numbers/${n}?from=${self}`);

  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={d.numbers.eyebrow} title={d.numbers.title} intro={d.numbers.intro} />
      <ModuleState status={status} retry={retry} />
      <div className="panel-stack">
        {core ? (
          <Section id="num-yours" label={d.numbers.yours} brass>
            <ul className="discover-core">
              {[
                { label: d.numbers.lifePath, n: core.lifePath.value },
                { label: d.numbers.birthday, n: core.birthday.value },
                { label: fmt(d.numbers.personalYear, { year }), n: core.personalYear.value },
              ].map((x) => (
                <li key={x.label}>
                  <button type="button" className="discover-core__item" onClick={() => open(x.n)}>
                    <Medallion label={String(x.n)} size="s" />
                    <span className="discover-core__label">{x.label}</span>
                    {ready ? <span className="small discover-core__keywords">{tx('numbers', `number.${x.n}.keywords`)}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
            <details className="discover-details">
              <summary>{d.numbers.howCalculated}</summary>
              <PathLine path={core.lifePath} d={d} />
              {ready ? <p className="small">{tx('numbers', 'path.life')}</p> : null}
              {ready ? <p className="small">{tx('numbers', 'path.year')}</p> : null}
            </details>
            <button type="button" className="btn btn--quiet discover__edit" onClick={() => navigate(`/me/birthdate?from=${self}`)}>
              {d.numbers.editBirthdate}
            </button>
          </Section>
        ) : (
          <Section id="num-invite" label={d.numbers.yours} brass>
            <p>{d.numbers.inviteBody}</p>
            <button type="button" className="btn btn--primary discover__invite" onClick={() => navigate(`/me/birthdate?from=${self}`)}>
              {d.numbers.inviteAction}
            </button>
          </Section>
        )}

        <Section id="num-all" label={d.numbers.all}>
          <ul className="discover-numbers">
            {LIFE_NUMBERS.map((n) => (
              <li key={n}>
                <button type="button" className="discover-numbers__item" onClick={() => open(n)}>
                  <Medallion label={String(n)} />
                  {n > 9 ? <span className="discover-numbers__master">{d.numbers.master}</span> : null}
                  <span className="small discover-numbers__keywords">{ready ? tx('numbers', `number.${n}.keywords`) : ''}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {ready ? (
          <Section id="num-method" label={d.numbers.method}>
            <p className="small">{tx('numbers', 'path.method')}</p>
          </Section>
        ) : null}
      </div>
      <button type="button" className="btn btn--ghost btn--block discover__next" onClick={() => navigate(`/discover/angel?from=${self}`)}>
        {d.numbers.toAngels}
      </button>
      <p className="small discover__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

export function NumberPage({ n: raw, parsed }: { n: string; parsed: ParsedRoute }) {
  const n = lifeNumberOf(raw);
  if (n === null) return <Missing parsed={parsed} kind="number" />;
  return <NumberBody n={n} parsed={parsed} />;
}

function NumberBody({ n, parsed }: { n: LifeNumber; parsed: ParsedRoute }) {
  const { t, pack, state, tx, has } = useApp();
  const d = useDiscoverText();
  const { status, retry } = useModules(['numbers']);
  const ready = status === 'ready';
  const m = (key: string) => tx('numbers', key);
  const locale = state.settings.locale;
  const birthDate = state.personal?.birthDate;
  const core = birthDate ? numerology(birthDate, state.todayKey) : null;
  const tags = core
    ? [core.lifePath.value === n ? d.number.yourLife : null, core.birthday.value === n ? d.number.yourBirthday : null, core.personalYear.value === n ? d.number.yourYear : null].filter(
        (x): x is string => x !== null,
      )
    : [];
  const card = findCard(pack, NUMBER_CARD[n]);
  const self = `/discover/numbers/${n}`;
  const isCycle = (CYCLE_NUMBERS as readonly number[]).includes(n);

  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={n > 9 ? d.number.master : d.number.eyebrow} title={`${n > 9 ? d.number.master : d.number.eyebrow} ${n}`} titleHidden>
        <Medallion label={String(n)} size="l" className="discover__hero-medallion" />
      </Head>
      {tags.length ? (
        <p className="discover__tags">
          {tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </p>
      ) : null}
      <ModuleState status={status} retry={retry} />
      {ready ? (
        <div className="panel-stack">
          <p className="lead italic-serif discover__essence">{m(`number.${n}.essence`)}</p>
          <p className="small discover__keywords">{m(`number.${n}.keywords`)}</p>
          <Section id="nb-life" label={d.number.life} brass>
            <Prose text={m(`number.${n}.life`)} />
          </Section>
          {n !== 33 ? (
            <Section id="nb-birthday" label={d.number.birthday}>
              <p>{m(`number.${n}.birthday`)}</p>
            </Section>
          ) : null}
          {isCycle ? (
            <Section id="nb-year" label={d.number.year}>
              <p>{m(`year.${n}`)}</p>
            </Section>
          ) : null}
          <Section id="nb-strengths" label={d.number.strengths}>
            <ul className="star-list">
              {[1, 2, 3].map((i) => (
                <li key={i}>
                  <StarGlyph size={10} className="star-list__mark" />
                  <span>{m(`number.${n}.strength.${i}`)}</span>
                </li>
              ))}
            </ul>
          </Section>
          {/* Challenges in full are Edition (G5): without billing they are not shown at all. */}
          {has('edition.numbers') ? (
            <Section id="nb-challenges" label={d.number.challenges}>
              <ul className="question-list">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="italic-serif">
                    {m(`number.${n}.challenge.${i}`)}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
          <Section id="nb-reflections" label={d.number.reflections}>
            <ul className="question-list">
              {[1, 2].map((i) => (
                <li key={i} className="italic-serif">
                  {m(`number.${n}.reflection.${i}`)}
                </li>
              ))}
            </ul>
          </Section>
          {card ? (
            <Section id="nb-card" label={d.number.card}>
              <p className="small">{fmt(d.number.cardIntro, { n, card: card.title[locale] })}</p>
              <CardRow cards={[card.id]} from={self} />
            </Section>
          ) : null}
        </div>
      ) : null}
      <p className="small discover__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

/* ----------------------------------------------------------- Angel numbers */

export function AngelsPage({ parsed }: { parsed: ParsedRoute }) {
  const { t, state } = useApp();
  const d = useDiscoverText();
  const [input, setInput] = useState('');
  const [invalid, setInvalid] = useState(false);
  const self = originOf(parsed);
  const counts = encounterCounts(state.journal).slice(0, 8);
  const favorites = state.favorites.filter((f) => f.kind === 'angel').sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const open = (display: string) => navigate(`/discover/angel/${display}?from=${self}`);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const l = lookupAngel(input);
    if (!l) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    open(l.display);
  };

  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={d.angels.eyebrow} title={d.angels.title} intro={d.angels.intro} />
      <div className="panel-stack">
        <form className="panel panel--brass discover-angel-form" onSubmit={submit} noValidate>
          <label className="panel__label" htmlFor="angel-input">
            {d.angels.inputLabel}
          </label>
          <div className="discover-angel-form__row">
            <input
              id="angel-input"
              className="discover__input"
              value={input}
              autoComplete="off"
              maxLength={8}
              placeholder={d.angels.inputPlaceholder}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? 'angel-input-error' : undefined}
              onChange={(e) => {
                setInput(e.target.value);
                if (invalid && parseAngelInput(e.target.value)) setInvalid(false);
              }}
            />
            <button type="submit" className="btn btn--primary">
              {d.angels.lookup}
            </button>
          </div>
          {invalid ? (
            <p id="angel-input-error" className="notice notice--error" role="alert">
              {d.angels.invalid}
            </p>
          ) : null}
        </form>

        {counts.length ? (
          <Section id="angels-yours" label={d.angels.yours}>
            <ul className="discover-chips">
              {counts.map((c) => (
                <li key={c.sequence}>
                  <button type="button" className="discover-chip" onClick={() => open(c.sequence)}>
                    <span className="discover-chip__seq">{c.sequence}</span>
                    <span className="small">{c.count === 1 ? d.angels.notedOne : fmt(d.angels.noted, { n: c.count })}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {favorites.length ? (
          <Section id="angels-favorites" label={d.angels.favorites}>
            <ul className="discover-chips">
              {favorites.map((f) => (
                <li key={f.key}>
                  <button type="button" className="discover-chip" onClick={() => open(f.id)}>
                    <span className="discover-chip__seq">{f.id}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section id="angels-curated" label={d.angels.curated}>
          <ul className="discover-chips discover-chips--grid">
            {CURATED_SEQUENCES.map((s) => (
              <li key={s}>
                <button type="button" className="discover-chip" onClick={() => open(s)}>
                  <span className="discover-chip__seq">{s}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <p className="small discover__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

export function AngelPage({ raw, parsed }: { raw: string; parsed: ParsedRoute }) {
  const l = lookupAngel(raw);
  if (!l) return <Missing parsed={parsed} kind="angel" />;
  return <AngelBody key={l.sequence} l={l} parsed={parsed} />;
}

function AngelBody({ l, parsed }: { l: AngelLookup; parsed: ParsedRoute }) {
  const { t, state, tx, actions } = useApp();
  const d = useDiscoverText();
  const toast = useToast();
  const { status, retry } = useModules(['angels']);
  const ready = status === 'ready';
  const m = (key: string) => tx('angels', key);
  const keys = angelTextKeys(l);
  const locale = state.settings.locale;
  const mine = encounterCounts(state.journal).find((c) => c.sequence === l.sequence);
  const [form, setForm] = useState(false);
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const placeRef = useRef<HTMLInputElement>(null);
  // The form opens on a tap: the first field takes the focus (keyboard and screen reader land there).
  useEffect(() => {
    if (form) placeRef.current?.focus();
  }, [form]);

  const save = async () => {
    setBusy(true);
    try {
      await actions.recordEncounter(l.display, note, place);
      setForm(false);
      setPlace('');
      setNote('');
      toast(d.angel.saved);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={d.angel.eyebrow} title={`${d.angel.eyebrow} ${l.display}`} titleHidden>
        <Medallion label={l.display} size="l" className="discover__hero-medallion" />
      </Head>
      {keys.kind === 'curated' && ready ? <p className="lead italic-serif discover__essence">{m(`${keys.prefix}.title`)}</p> : null}
      {l.time ? <p className="small discover__center">{fmt(d.angel.timeNote, { digits: l.display.replace(':', '') })}</p> : null}
      <ModuleState status={status} retry={retry} />
      {ready ? (
        keys.kind === 'curated' ? (
          <div className="panel-stack">
            <Section id="an-meaning" label={d.angel.meaning} brass>
              <p>{m(`${keys.prefix}.meaning`)}</p>
            </Section>
            <Section id="an-light" label={d.angel.light}>
              <p>{m(`${keys.prefix}.light`)}</p>
            </Section>
            <Section id="an-shadow" label={d.angel.shadow}>
              <p className="italic-serif">{m(`${keys.prefix}.shadow`)}</p>
            </Section>
            <Section id="an-reflection" label={d.angel.reflection}>
              <p className="italic-serif">{m(`${keys.prefix}.reflection`)}</p>
            </Section>
            <Section id="an-ritual" label={d.angel.ritual}>
              <p>{m(`${keys.prefix}.ritual`)}</p>
            </Section>
          </div>
        ) : (
          <div className="panel-stack">
            <Section id="an-composed" label={d.angel.composed} brass>
              <p className="small">{d.angel.composedIntro}</p>
            </Section>
            <Section id="an-pattern" label={d.angel.pattern}>
              <p>{m(keys.pattern)}</p>
            </Section>
            <Section id="an-digits" label={d.angel.digits}>
              <ul className="discover-digits">
                {keys.digits.map((k, i) => (
                  <li key={k}>
                    <Medallion label={l.digits[i]!.digit} size="s" />
                    <span>
                      <span className="discover-digits__keyword">{m(`${k}.keyword`)}</span>
                      <span className="discover-digits__meaning">{m(`${k}.meaning`)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )
      ) : null}

      <div className="discover__actions">
        {mine ? (
          <p className="small discover__center">
            {mine.count === 1
              ? fmt(d.angel.notedOne, { date: formatDate(dateFromKey(mine.lastDateKey), locale) })
              : fmt(d.angel.noted, { n: mine.count, date: formatDate(dateFromKey(mine.lastDateKey), locale) })}
          </p>
        ) : null}
        {form ? (
          <form
            className="panel discover-encounter"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <h2 className="panel__label">{d.angel.record}</h2>
            <p className="small">{d.angel.recordIntro}</p>
            <label className="discover-encounter__label" htmlFor="enc-place">
              {d.angel.place}
            </label>
            <input ref={placeRef} id="enc-place" className="discover__input" value={place} maxLength={PLACE_MAX} placeholder={d.angel.placePlaceholder} onChange={(e) => setPlace(e.target.value)} />
            <label className="discover-encounter__label" htmlFor="enc-note">
              {d.angel.note}
            </label>
            <textarea id="enc-note" className="note__field" value={note} maxLength={ENCOUNTER_NOTE_MAX} rows={3} placeholder={t.detail.notePlaceholder} onChange={(e) => setNote(e.target.value)} />
            <div className="discover-encounter__buttons">
              <button type="submit" className="btn btn--primary" disabled={busy}>
                {d.angel.save}
              </button>
              <button type="button" className="btn btn--quiet" onClick={() => setForm(false)}>
                {d.angel.cancel}
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className="btn btn--primary btn--block" onClick={() => setForm(true)}>
            {d.angel.record}
          </button>
        )}
        <FavoriteButton kind="angel" id={l.sequence} />
      </div>
      <p className="small discover__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

/* ----------------------------------------------------------------- Symbols */

export function SymbolsPage({ parsed }: { parsed: ParsedRoute }) {
  const { t, state, tx } = useApp();
  const d = useDiscoverText();
  const { status, retry } = useModules(['symbols']);
  const ready = status === 'ready';
  const self = originOf(parsed);
  const favorites = new Set(state.favorites.filter((f) => f.kind === 'symbol').map((f) => f.id));
  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={d.symbols.eyebrow} title={d.symbols.title} intro={d.symbols.intro} />
      <ModuleState status={status} retry={retry} />
      <ul className="discover-symbols">
        {LEXICON_SYMBOL_IDS.map((id) => (
          <li key={id}>
            <button type="button" className="discover-symbols__item" onClick={() => navigate(`/discover/symbols/${id}?from=${self}`)}>
              <img src={symbolSrc(id, true)} alt="" width={48} height={48} loading="lazy" decoding="async" />
              <span className="discover-symbols__name">{ready ? tx('symbols', `symbol.${id}.name`) : ' '}</span>
              {favorites.has(id) ? <StarGlyph size={10} className="discover-symbols__fav" /> : null}
            </button>
          </li>
        ))}
      </ul>
      <p className="small discover__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

export function SymbolPage({ id, parsed }: { id: string; parsed: ParsedRoute }) {
  if (!isLexiconSymbol(id)) return <Missing parsed={parsed} kind="symbol" />;
  return <SymbolBody id={id} parsed={parsed} />;
}

function SymbolBody({ id, parsed }: { id: LexiconSymbolId; parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  const d = useDiscoverText();
  const { status, retry } = useModules(['symbols']);
  const ready = status === 'ready';
  const m = (part: string) => tx('symbols', `symbol.${id}.${part}`);
  const locale = state.settings.locale;
  const src = symbolSources(id);
  const quote = (s: string) => (locale === 'de' ? `„${s}“` : `“${s}”`);
  const names = src.archetypes.map((a) => quote(getArchetype(pack, a).name[locale]));
  const nameList = names.length > 1 ? `${names.slice(0, -1).join(', ')} ${d.symbol.and} ${names[names.length - 1]}` : (names[0] ?? '');
  const self = `/discover/symbols/${id}`;

  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={d.symbol.eyebrow} title={ready ? m('name') : ' '}>
        <img className="discover__hero-symbol" src={symbolSrc(id)} alt={ready ? fmt(d.symbol.imageAlt, { name: m('name') }) : ''} width={160} height={160} decoding="async" />
      </Head>
      <ModuleState status={status} retry={retry} />
      {ready ? (
        <div className="panel-stack">
          <Section id="sy-meaning" label={d.symbol.meaning} brass>
            <p>{m('meaning')}</p>
          </Section>
          <Section id="sy-light" label={d.symbol.light}>
            <p>{m('light')}</p>
          </Section>
          <Section id="sy-shadow" label={d.symbol.shadow}>
            <p className="italic-serif">{m('shadow')}</p>
          </Section>
          <Section id="sy-reflection" label={d.symbol.reflection}>
            <p className="italic-serif">{m('reflection')}</p>
          </Section>
          <Section id="sy-cards" label={d.symbol.inCards}>
            {src.via === 'archetype' ? <p className="small">{fmt(names.length > 1 ? d.symbol.viaArchetypes : d.symbol.viaArchetype, { names: nameList })}</p> : null}
            <CardRow cards={src.cards} from={self} />
          </Section>
        </div>
      ) : null}
      <div className="discover__actions">
        <FavoriteButton kind="symbol" id={id} />
      </div>
      <p className="small discover__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

/* -------------------------------------------------------------- Not found */

function Missing({ parsed, kind }: { parsed: ParsedRoute; kind: 'number' | 'angel' | 'symbol' }) {
  const d = useDiscoverText();
  const text = kind === 'number' ? d.number.notFound : kind === 'angel' ? d.angel.invalid : d.symbol.notFound;
  const to = kind === 'number' ? ['/discover/numbers', d.number.toNumbers] : kind === 'angel' ? ['/discover/angel', d.angel.toAngels] : ['/discover/symbols', d.symbol.toSymbols];
  return (
    <div className="screen detail discover">
      <DetailHeader parsed={parsed} />
      <div className="empty">
        <h1 className="display h2" tabIndex={-1}>
          {text}
        </h1>
        <button type="button" className="btn btn--ghost" onClick={() => navigate(to[0]!, { replace: true })}>
          {to[1]}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Birth date */

export function BirthdatePage({ parsed }: { parsed: ParsedRoute }) {
  const { t, state, actions } = useApp();
  const d = useDiscoverText();
  const toast = useToast();
  const saved = state.personal?.birthDate ?? '';
  const [value, setValue] = useState(saved);
  const [invalid, setInvalid] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const locale = state.settings.locale;
  const today = state.todayKey;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPlausibleBirthDate(value, today)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setBusy(true);
    try {
      await actions.setBirthDate(value);
      toast(d.birthdate.saved);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setConfirm(false);
    try {
      await actions.deleteBirthDate();
      setValue('');
      toast(d.birthdate.deleted);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };

  return (
    <div className="screen detail discover birthdate">
      <DetailHeader parsed={parsed} />
      <Head eyebrow={d.birthdate.eyebrow} title={d.birthdate.title} />
      <div className="panel-stack">
        <p className="muted discover__intro">{d.birthdate.why}</p>
        <form className="panel panel--brass birthdate__form" onSubmit={(e) => void save(e)} noValidate>
          <label className="panel__label" htmlFor="birthdate-input">
            {d.birthdate.label}
          </label>
          <input
            id="birthdate-input"
            type="date"
            className="discover__input"
            value={value}
            min={`${MIN_BIRTH_YEAR}-01-01`}
            max={today}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? 'birthdate-error' : undefined}
            onChange={(e) => {
              setValue(e.target.value);
              setInvalid(false);
            }}
          />
          {invalid ? (
            <p id="birthdate-error" className="notice notice--error" role="alert">
              {d.birthdate.invalid}
            </p>
          ) : null}
          <button type="submit" className="btn btn--primary btn--block" disabled={busy || value === saved}>
            {d.birthdate.save}
          </button>
        </form>
        <p className="small birthdate__privacy">{d.birthdate.privacy}</p>
        {saved ? (
          <div className="panel birthdate__saved">
            <p>{fmt(d.birthdate.current, { date: formatDate(dateFromKey(saved), locale) })}</p>
            <div className="btn-stack">
              <button type="button" className="btn btn--ghost" onClick={() => navigate(`/discover/numbers?from=${originOf(parsed)}`)}>
                {d.birthdate.toNumbers}
              </button>
              <button type="button" className="btn btn--quiet" onClick={() => setConfirm(true)}>
                {d.birthdate.delete}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmDialog
        open={confirm}
        title={d.birthdate.deleteTitle}
        body={d.birthdate.deleteBody}
        confirmLabel={d.birthdate.deleteConfirm}
        cancelLabel={t.common.cancel}
        danger
        onConfirm={() => void remove()}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
