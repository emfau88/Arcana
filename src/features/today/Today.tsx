import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { navigate } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { findCard, getTheme, resolveTheme } from '../../content/index.ts';
import { cardKeywords } from '../../content/keywords.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { deriveCollection, journeyPosition } from '../../domain/oracle.ts';
import { lensArchetypeOf } from '../../domain/lens.ts';
import { journeyDayToday } from '../../domain/progress.ts';
import { milestoneMoment } from '../../domain/unlocks.ts';
import { MilestoneMoment } from '../journey/MilestoneMoment.tsx';
import { fmt, formatLongDate, toRoman } from '../../i18n/index.ts';
import { useToast } from '../../ui/feedback.tsx';
import { IconCandle, IconCheck, IconEye, IconQuill, IconSparkle } from '../../ui/Icons.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { Sigil } from '../../ui/Sigil.tsx';
import { CardStage } from '../../ui/CardStage.tsx';
import { Brand, CrescentDivider, Flank, OrnatePanel, StarGlyph } from '../../ui/Ornaments.tsx';
import { Journey } from '../../ui/Journey.tsx';
import { useReducedMotion } from '../../app/motion.ts';

type Phase = 'hidden' | 'drawing' | 'flipping' | 'shown';

export function Today() {
  const { t, pack, state, actions, today } = useApp();
  const toast = useToast();
  const reduced = useReducedMotion();
  const locale = state.settings.locale;
  const [rawPhase, setPhase] = useState<Phase>(today ? 'shown' : 'hidden');
  const [announce, setAnnounce] = useState('');
  const timer = useRef<number | null>(null);
  const messageRef = useRef<HTMLElement | null>(null);
  // The full reading below the fold renders after the visible part: when the main thread
  // is idle (at most 600 ms later), or after the reveal choreography when the card was
  // just turned. Nothing visible changes; the first screen and the reveal stay smooth (D-37).
  const [deepReady, setDeepReady] = useState(false);
  const justRevealed = useRef(false);
  // While the card is still covered and the main thread is idle, lay out an invisible,
  // off-screen copy of the reading's text styles once. The browser then already holds the
  // font instances and the glyph fallback for "✦" when the card turns, so the reveal frame
  // stays short (D-41, B-01). Removed again once the full reading is on screen.
  const [warm, setWarm] = useState(false);

  // Derived so a new local day (midnight or resume) shows a face-down card again,
  // and a record created elsewhere (another tab) shows up revealed.
  const phase: Phase = !today ? (rawPhase === 'drawing' ? 'drawing' : 'hidden') : rawPhase === 'hidden' ? 'shown' : rawPhase;

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const reveal = async () => {
    if (phase !== 'hidden') return;
    setPhase('drawing');
    try {
      const record = await actions.revealToday();
      setAnnounce(fmt(t.today.revealedAnnounce, { title: record.content.cardTitle }));
      if (reduced) {
        setPhase('shown');
        return;
      }
      justRevealed.current = true;
      setPhase('flipping');
      timer.current = window.setTimeout(() => setPhase('shown'), 700);
    } catch {
      setPhase('hidden');
      toast(t.errors.writeFailed, 'error');
    }
  };

  const shown = phase === 'shown';
  useEffect(() => {
    if (!shown) return;
    const show = () => setDeepReady(true);
    if (justRevealed.current && !reduced) {
      const to = window.setTimeout(show, 650);
      return () => window.clearTimeout(to);
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(show, { timeout: 600 });
      return () => window.cancelIdleCallback(id);
    }
    const to = window.setTimeout(show, 50);
    return () => window.clearTimeout(to);
  }, [shown, reduced]);

  useEffect(() => {
    if (phase !== 'hidden' || warm) return;
    const go = () => setWarm(true);
    // B-08: warm up after the page has loaded (its fonts no longer delay the first screen),
    // then at the next idle moment; at the latest 2.5 s after mounting.
    let idle = 0;
    let to = 0;
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(go, { timeout: 800 });
      else to = window.setTimeout(go, 200);
    };
    const cap = window.setTimeout(go, 2500);
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
    return () => {
      window.removeEventListener('load', whenIdle);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(to);
      window.clearTimeout(cap);
    };
  }, [phase, warm]);

  const skipAnimation = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setPhase('shown');
  };

  const dateLabel = formatLongDate(dateFromKey(state.todayKey), locale);
  const themeId = today?.themeId ?? resolveTheme(pack, state.profile?.themeId ?? pack.defaultTheme);
  const themeLabel = today ? today.content.themeLabel : getTheme(pack, themeId).label[locale];
  const card = today ? findCard(pack, today.cardId) ?? null : null;
  // V04.3: on complement days the lens (and its sigil) belongs to the second voice.
  const lensArchetype = today ? lensArchetypeOf(today) : null;
  const faceUp = phase === 'flipping' || phase === 'shown';
  const collection = deriveCollection(state.dailies, state.readings);
  // Today counts as a day of the journey as soon as the person is here, once (E6: never decreases).
  const position = journeyPosition(journeyDayToday({ dailies: state.dailies, readings: state.readings }, state.todayKey));
  const pathName = [t.today.pathOuter, t.today.pathInner, t.today.pathHigher][position.path];
  // Full sentence for screen readers; the plaque shows the short form.
  const journeyCaption = [
    fmt(t.today.journeyDay, { n: position.day }),
    pathName,
    position.round > 1 ? fmt(t.today.journeyRound, { n: position.round }) : null,
    fmt(t.today.journeyStation, { k: position.station, total: 7 }),
  ]
    .filter(Boolean)
    .join(' · ');
  const journey = (
    <Journey
      position={position}
      label={t.today.journeyLabel}
      plaque={`${fmt(t.today.journeyDayShort, { n: position.day })} · ${pathName}`}
      caption={journeyCaption}
    />
  );
  const keywords = card ? cardKeywords(card)?.[locale] : undefined;
  // A6: the milestone of the day reached today, once, when it opened something in this build.
  const moment = milestoneMoment({ dailies: state.dailies, readings: state.readings }, today !== null, state.seen);

  /** "Continue your journey": the next content is the full message of the day. */
  const continueJourney = () => {
    if (!deepReady) flushSync(() => setDeepReady(true));
    const target = messageRef.current;
    if (!target) return;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    target.querySelector<HTMLElement>('#today-message-title')?.focus({ preventScroll: true });
  };

  return (
    <div className="screen today">
      <header className="screen-head today__head">
        <Brand name={t.common.appName} />
        <Flank as="h1" className="today__heading" tabIndex={-1}>
          {t.today.eyebrow}
        </Flank>
        <p className="today__meta">
          <span>{dateLabel}</span>
          <span aria-hidden="true" className="today__dot">
            ✦
          </span>
          <span>{themeLabel}</span>
        </p>
      </header>

      <CardStage revealing={phase === 'flipping'} revealed={faceUp}>
        <OracleCard
          card={card}
          locale={locale}
          faceUp={faceUp}
          size="hero"
          animated={phase === 'flipping'}
          label={today ? `${toRoman(today.content.cardOrder)} · ${today.content.cardTitle}` : t.today.cardBackLabel}
          onActivate={phase === 'hidden' ? reveal : phase === 'flipping' ? skipAnimation : undefined}
          disabled={phase === 'drawing'}
        />
      </CardStage>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {phase === 'hidden' || phase === 'drawing' ? (
        <div className="today__draw">
          <p className="muted today__hint">{t.today.drawHint}</p>
          <button type="button" className="btn btn--ritual today__cta" onClick={reveal} disabled={phase === 'drawing'}>
            <StarGlyph size={14} /> {t.today.draw} <StarGlyph size={14} />
          </button>
          {journey}
          <p className="small today__symbolic">{t.common.symbolic}</p>
        </div>
      ) : null}

      {phase === 'flipping' ? (
        <div className="today__draw">
          <button type="button" className="btn btn--quiet" onClick={skipAnimation}>
            {t.today.skipAnimation}
          </button>
        </div>
      ) : null}

      {phase === 'shown' && today ? (
        <article className="today__reading" aria-labelledby="today-card-title">
          <div className="today__title rise">
            <Flank className="today__oracle-flank">
              {t.today.oracleToday}
              {'\u00a0·\u00a0'}
              {toRoman(today.content.cardOrder)}
            </Flank>
            <h2 id="today-card-title" className="display today__name">
              {today.content.cardTitle}
            </h2>
            {keywords ? (
              <p className="today__keywords">
                {keywords.split(' · ').map((k, i) => (
                  <span key={k}>
                    {i > 0 ? (
                      <span className="today__kw-sep" aria-hidden="true">
                        {' ✦ '}
                      </span>
                    ) : null}
                    {k}
                  </span>
                ))}
              </p>
            ) : null}
            <p className="italic-serif today__essence">{today.content.essence}</p>
          </div>
          <div className="today__journey rise rise-1">{journey}</div>
          <div className="today__next rise rise-2">
            <button type="button" className="btn btn--ritual today__continue" onClick={continueJourney}>
              {t.today.continueJourney} <span aria-hidden="true">›</span>
            </button>
          </div>
          {moment ? <MilestoneMoment milestone={moment.milestone} rewards={moment.rewards} /> : null}
          {deepReady ? (
            <>
              <div className="panel-stack today__deep">
                <section className="ornate-host" ref={messageRef} aria-labelledby="today-message-title">
                  <OrnatePanel className="today__oracle" as="div">
                    <h3 id="today-message-title" className="panel__label today__oracle-label" tabIndex={-1}>
                      <IconSparkle size={16} /> {t.today.message}
                    </h3>
                    <p className="today__message">{today.content.message}</p>
                  </OrnatePanel>
                </section>
                {today.content.lens && lensArchetype ? (
                  <section className="panel today__lens">
                    <Sigil archetype={lensArchetype} size={44} />
                    <div>
                      <h3 className="panel__label">{lensArchetype === today.archetypeId ? t.today.lens : t.today.lensComplement}</h3>
                      <p>{today.content.lens}</p>
                    </div>
                  </section>
                ) : null}
                <div className="today__pair">
                  <section className="panel">
                    <h3 className="panel__label">
                      <IconEye size={16} /> {t.today.reflection}
                    </h3>
                    <p className="italic-serif today__question">{today.content.reflection}</p>
                  </section>
                  <section className="panel">
                    <h3 className="panel__label">
                      <IconCandle size={16} /> {t.today.ritual}
                    </h3>
                    <p>{today.content.ritual}</p>
                  </section>
                </div>
                <section className="panel today__collected">
                  <span className="today__check" aria-hidden="true">
                    <IconCheck size={18} />
                  </span>
                  <div className="today__collected-text">
                    <p className="today__collected-title">{t.today.collected}</p>
                    <p className="small">{fmt(t.today.collectedCount, { n: collection.size, total: pack.cards.length })}</p>
                  </div>
                  <button type="button" className="btn btn--ghost today__open" onClick={() => navigate('/grimoire', { replace: true })}>
                    {t.today.openGrimoire}
                  </button>
                </section>
                <button
                  type="button"
                  className="btn btn--quiet today__note"
                  onClick={() => navigate(`/grimoire/day/${today.dateKey}?from=/today`)}
                >
                  <IconQuill size={18} /> {today.note ? t.detail.note : t.today.addNote}
                </button>
              </div>
              <CrescentDivider />
              <div className="today__footer-panel">
                <p className="small today__footer">{t.today.journeyNote}</p>
                <p className="small today__footer">{t.today.comeBack}</p>
                <p className="small today__footer">{t.common.symbolic}</p>
                {today.locale !== locale ? (
                  <p className="small today__footer">{fmt(t.today.storedLocale, { lang: t.languages[today.locale] })}</p>
                ) : null}
              </div>
            </>
          ) : null}
        </article>
      ) : null}

      {warm && !deepReady ? <ReadingWarmup /> : null}
    </div>
  );
}

/**
 * Invisible, off-screen text in the same classes as the revealed reading (D-41). Sample
 * text only: it is never shown, never read out and never focusable. Lies above the
 * viewport so layout probes and tests that look for on-screen text skip it.
 */
function ReadingWarmup() {
  const sample = 'Aa Gg Qq Ää Öö Üü ß';
  return (
    <div className="today__warmup" aria-hidden="true">
      <div className="today__title">
        <Flank className="today__oracle-flank">{sample}</Flank>
        <p className="display today__name">{sample}</p>
        <p className="today__keywords">
          <span>{sample}</span>
          <span className="today__kw-sep">{' ✦ '}</span>
          <span>{sample}</span>
        </p>
        <p className="italic-serif today__essence">{sample}</p>
      </div>
      <div className="today__oracle">
        <p className="today__message">{`${sample} Sternenhimmelsbeobachtungsplattform`}</p>
      </div>
      <p className="italic-serif today__question">{sample}</p>
    </div>
  );
}
