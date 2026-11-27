/**
 * Identity screens of V04 (PRODUCT_SYSTEMS C3–C7, D-57 proposals): the archetype portrait,
 * the full profile (shared by "Ich" and the grimoire), "Why?" and the library of all eight.
 * Profile texts come from the module `archetypes`, loaded on demand; until it is there the
 * core texts are shown, so nothing is ever empty.
 */
import { navigate, originOf, type ParsedRoute } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { findCard, getArchetype } from '../../content/index.ts';
import { RESONANCE } from '../../content/resonance.ts';
import { deriveCollection } from '../../domain/oracle.ts';
import { isArchetypeId, type ArchetypeId } from '../../domain/types.ts';
import { explainArchetype } from '../../domain/why.ts';
import { useScreenText } from '../../i18n/screens.ts';
import { fmt, toRoman } from '../../i18n/index.ts';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { Flank, StarGlyph } from '../../ui/Ornaments.tsx';
import { ArchetypePortrait } from '../../ui/Portrait.tsx';
import { Sigil } from '../../ui/Sigil.tsx';
import { DetailHeader, NotFound } from '../grimoire/Grimoire.tsx';
import './identity.css';

/* ------------------------------------------------------- Full profile */

/** Description, strengths, shadows, growth, reflections and resonance of one archetype. */
export function ArchetypeProfile({ id, from }: { id: ArchetypeId; from: string }) {
  const { t, pack, state, tx } = useApp();
  const s = useScreenText();
  const { status, retry } = useModules(['archetypes']);
  const locale = state.settings.locale;
  const a = getArchetype(pack, id);
  const collection = deriveCollection(state.dailies, state.readings);
  const res = RESONANCE[id];
  const ready = status === 'ready';
  const m = (key: string) => tx('archetypes', key);
  const strengths = ready ? [1, 2, 3].map((n) => m(`strength.${id}.${n}`)) : [a.strength[locale]];
  const shadows = [a.shadow[locale], ...(ready ? [2, 3].map((n) => m(`shadow.${id}.${n}`)) : [])];
  const growth = [a.growth[locale], ...(ready ? [m(`growth.${id}.2`)] : [])];
  const reflections = [a.reflection[locale], ...(ready ? [2, 3, 4, 5].map((n) => m(`reflection.${id}.${n}`)) : [])];
  const uid = `ap-${id}`;

  return (
    <div className="arch-profile panel-stack">
      {status === 'loading' ? (
        <p className="small arch-profile__status" role="status">
          {s.me.loading}
        </p>
      ) : null}
      {status === 'error' ? (
        <div className="notice arch-profile__status">
          <p>{s.me.loadFailed}</p>
          <button type="button" className="btn btn--quiet" onClick={retry}>
            {t.common.retry}
          </button>
        </div>
      ) : null}
      {ready ? (
        <section className="panel panel--brass" aria-labelledby={`${uid}-desc`}>
          <h2 id={`${uid}-desc`} className="panel__label">
            {s.me.description}
          </h2>
          <p className="arch-profile__description">{m(`description.${id}`)}</p>
        </section>
      ) : null}
      <section className="panel" aria-labelledby={`${uid}-str`}>
        <h2 id={`${uid}-str`} className="panel__label">
          {s.me.strengths}
        </h2>
        <ul className="star-list">
          {strengths.map((s) => (
            <li key={s}>
              <StarGlyph size={10} className="star-list__mark" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel" aria-labelledby={`${uid}-sha`}>
        <h2 id={`${uid}-sha`} className="panel__label">
          {s.me.shadows}
        </h2>
        <ul className="question-list">
          {shadows.map((q) => (
            <li key={q} className="italic-serif">
              {q}
            </li>
          ))}
        </ul>
      </section>
      <section className="panel" aria-labelledby={`${uid}-gro`}>
        <h2 id={`${uid}-gro`} className="panel__label">
          {s.me.growth}
        </h2>
        <ul className="star-list">
          {growth.map((g) => (
            <li key={g}>
              <StarGlyph size={10} className="star-list__mark" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel" aria-labelledby={`${uid}-ref`}>
        <h2 id={`${uid}-ref`} className="panel__label">
          {s.me.reflections}
        </h2>
        <ul className="question-list">
          {reflections.map((q) => (
            <li key={q} className="italic-serif">
              {q}
            </li>
          ))}
        </ul>
      </section>
      <section className="panel arch-profile__resonance" aria-labelledby={`${uid}-res`}>
        <h2 id={`${uid}-res`} className="panel__label">
          {s.me.resonance}
        </h2>
        <h3 className="arch-profile__sub">{s.me.resonanceCards}</h3>
        <ul className="resonance-cards">
          {res.cards.map((cid) => {
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
            // Knowledge is never locked (L-rules): every face is shown; the card page opens once
            // the card has been met, like everywhere else in the grimoire.
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
        {ready ? (
          <>
            <h3 className="arch-profile__sub">{s.me.resonanceSymbols}</h3>
            <ul className="symbol-chips">
              {res.symbols.map((sym, i) => (
                <li key={sym} className={i === 0 ? 'symbol-chip symbol-chip--lead' : 'symbol-chip'}>
                  {i === 0 ? <span className="symbol-chip__lead">{s.me.guidingSymbol}</span> : null}
                  <span>{m(`symbol.${sym}`)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ Why */

export function WhyScreen({ parsed }: { parsed: ParsedRoute }) {
  const { t, pack, state, tx, actions } = useApp();
  const s = useScreenText();
  const locale = state.settings.locale;
  const profile = state.profile;
  const answers = profile?.answers ?? {};
  const why = explainArchetype(pack.questions, answers);
  const name = (id: ArchetypeId) => getArchetype(pack, id).name[locale];
  const current = profile?.archetypeId ?? null;
  const manual = profile?.archetypeSource === 'manual';
  const main = why.result.archetypeId;
  const max = Math.max(1, ...why.totals.map((x) => x.points));
  const points = (n: number) => (n === 1 ? s.why.pointsOne : fmt(s.why.points, { n }));
  const c = why.complement;
  const secondId = c.kind === 'named' ? c.archetypeId : null;
  const complementText =
    c.kind === 'named' && main
      ? fmt(c.gap === 0 ? s.why.named0 : s.why.named1, { name: name(c.archetypeId), main: name(main) })
      : c.kind === 'gap-too-large'
        ? fmt(s.why.gapTooLarge, { name: name(c.archetypeId), gap: c.gap })
        : c.kind === 'too-few-answers'
          ? fmt(s.why.tooFew, { needed: c.needed, answered: c.answered })
          : null;

  const answer = () => {
    actions.setPending(answers, profile?.themeId ?? null);
    navigate('/onboarding/1');
  };

  return (
    <div className="screen detail why">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{s.why.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {current ? fmt(s.why.title, { name: name(current) }) : s.why.titleOpen}
        </h1>
      </header>

      {manual && current ? <p className="notice why__manual">{fmt(s.why.manual, { name: name(current) })}</p> : null}

      {why.lines.length === 0 ? (
        <div className="empty">
          <p className="muted">{s.why.noAnswers}</p>
          <button type="button" className="btn btn--ghost" onClick={answer}>
            {s.why.toAnswers}
          </button>
        </div>
      ) : (
        <>
          <p className="lead why__intro">{fmt(s.why.intro, { p: why.weights.primary, s: why.weights.secondary })}</p>
          {!main ? <p className="muted why__open">{fmt(s.why.open, { n: why.minAnswers })}</p> : null}

          <section className="panel panel--brass why__totals" aria-labelledby="why-totals">
            <h2 id="why-totals" className="panel__label">
              {s.why.totals}
            </h2>
            <ol className="why__bars">
              {why.totals.map(({ archetypeId, points: p }) => (
                <li key={archetypeId} className={`why__bar${archetypeId === main ? ' is-main' : ''}${archetypeId === secondId ? ' is-second' : ''}`}>
                  <Sigil archetype={archetypeId} size={30} />
                  <span className="why__bar-name">
                    {name(archetypeId)}
                    {archetypeId === secondId ? <span className="why__tag">{s.why.secondVoice}</span> : null}
                  </span>
                  <span className="why__bar-points">{points(p)}</span>
                  <span className="why__bar-track" aria-hidden="true">
                    <span style={{ width: `${(p / max) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="small why__tie">{s.why.tie}</p>
          </section>

          {complementText ? (
            <section className="panel why__complement" aria-labelledby="why-second">
              <h2 id="why-second" className="panel__label">
                {s.why.secondVoice}
              </h2>
              <p>{complementText}</p>
            </section>
          ) : null}

          <section className="why__answers-group" aria-labelledby="why-answers">
            <h2 id="why-answers" className="panel__label">
              {s.why.answers}
            </h2>
            <ol className="why__answers">
              {why.lines.map((l) => (
                <li key={l.questionId} className="panel why__answer">
                  <p className="small why__question">{tx('identity', `question.${l.questionId}.prompt`)}</p>
                  <p className="why__choice">{tx('identity', `question.${l.questionId}.${l.answerId}`)}</p>
                  <p className="why__gives">
                    {fmt(s.why.gives, { p: why.weights.primary, a: name(l.primary), s: why.weights.secondary, b: name(l.secondary) })}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
      <p className="small why__symbolic">{t.common.symbolic}</p>
    </div>
  );
}

/* -------------------------------------------------------------- Library */

export function ArchetypeLibrary({ parsed }: { parsed: ParsedRoute }) {
  const { pack, state } = useApp();
  const s = useScreenText();
  const locale = state.settings.locale;
  const own = state.profile?.archetypeId ?? null;
  const second = state.profile?.secondaryArchetypeId ?? null;
  return (
    <div className="screen detail library">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{s.library.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {s.library.title}
        </h1>
        <p className="muted library__intro">{s.library.intro}</p>
      </header>
      <ul className="library__grid">
        {pack.archetypes.map((a) => (
          <li key={a.id}>
            <button type="button" className="library__item" onClick={() => navigate(`/grimoire/archetypes/${a.id}?from=${originOf(parsed)}`)}>
              <ArchetypePortrait id={a.id} size={240} alt="" />
              {a.id === own ? (
                <span className="chip library__badge">{s.library.yours}</span>
              ) : a.id === second ? (
                <span className="chip library__badge library__badge--quiet">{s.library.secondVoice}</span>
              ) : null}
              <span className="display library__name">{a.name[locale]}</span>
              <span className="small library__essence">{a.essence[locale]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArchetypeDetail({ id, parsed }: { id: string; parsed: ParsedRoute }) {
  if (!isArchetypeId(id)) return <NotFound parsed={parsed} />;
  return <ArchetypeDetailBody id={id} parsed={parsed} />;
}

function ArchetypeDetailBody({ id, parsed }: { id: ArchetypeId; parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  const s = useScreenText();
  const locale = state.settings.locale;
  const a = getArchetype(pack, id);
  const own = state.profile?.archetypeId === id;
  const second = state.profile?.secondaryArchetypeId === id;
  const reveal = tx('archetypes', `reveal.${id}`);
  const self = `/grimoire/archetypes/${id}`;
  return (
    <div className="screen detail arch-detail">
      <DetailHeader parsed={parsed} />
      <div className="arch-detail__hero">
        <ArchetypePortrait id={id} size={720} alt={fmt(s.me.portraitAlt, { name: a.name[locale] })} eager seal className="arch-detail__portrait" />
        <Flank className="screen-head__flank">{own ? s.library.yours : second ? s.library.secondVoice : t.profile.archetype}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {a.name[locale]}
        </h1>
        <p className="lead italic-serif arch-detail__essence">{a.essence[locale]}</p>
        {reveal ? <p className="arch-detail__reveal">{reveal}</p> : null}
      </div>
      <ArchetypeProfile id={id} from={self} />
      <button type="button" className="btn btn--ghost btn--block arch-detail__share" onClick={() => navigate(`/share/archetype/${id}?from=${self}`)}>
        {s.me.share}
      </button>
      <p className="small arch-detail__symbolic">{t.common.symbolic}</p>
    </div>
  );
}
