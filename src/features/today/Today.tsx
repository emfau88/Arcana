import { useEffect, useRef, useState } from 'react';
import { navigate } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { findCard, getTheme, resolveTheme } from '../../content/index.ts';
import { cardKeywords } from '../../content/keywords.ts';
import { dateFromKey } from '../../domain/clock.ts';
import { deriveCollection, journeyDays } from '../../domain/oracle.ts';
import { fmt, formatLongDate, toRoman } from '../../i18n/index.ts';
import { useToast } from '../../ui/feedback.tsx';
import { IconCandle, IconCheck, IconEye, IconQuill, IconSparkle } from '../../ui/Icons.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';
import { Sigil } from '../../ui/Sigil.tsx';
import { CardStage } from '../../ui/CardStage.tsx';
import { Brand, CrescentDivider, Flank, OrnatePanel, StarGlyph } from '../../ui/Ornaments.tsx';
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
      setPhase('flipping');
      timer.current = window.setTimeout(() => setPhase('shown'), 700);
    } catch {
      setPhase('hidden');
      toast(t.errors.writeFailed, 'error');
    }
  };

  const skipAnimation = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setPhase('shown');
  };

  const dateLabel = formatLongDate(dateFromKey(state.todayKey), locale);
  const themeId = today?.themeId ?? resolveTheme(pack, state.profile?.themeId ?? pack.defaultTheme);
  const themeLabel = today ? today.content.themeLabel : getTheme(pack, themeId).label[locale];
  const card = today ? findCard(pack, today.cardId) ?? null : null;
  const faceUp = phase === 'flipping' || phase === 'shown';
  const collection = deriveCollection(state.dailies, state.readings);
  // Today counts as a day of the journey as soon as the person is here (E6: never decreases).
  const day = journeyDays(state.dailies, state.readings) + (today ? 0 : 1);

  return (
    <div className="screen today">
      <header className="screen-head today__head">
        <Brand name={t.common.appName} compact />
        <Flank className="today__journey">{fmt(t.today.journeyDay, { n: day })}</Flank>
        <h1 className="display today__heading" tabIndex={-1}>
          {t.today.eyebrow}
        </h1>
        <p className="today__meta">
          <span>{dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>
            {t.today.theme}: {themeLabel}
          </span>
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
            <Flank>
              {t.today.oracleToday} · {toRoman(today.content.cardOrder)}
            </Flank>
            <h2 id="today-card-title" className="display today__name">
              {today.content.cardTitle}
            </h2>
            {card && cardKeywords(card) ? <p className="today__keywords">{cardKeywords(card)?.[locale]}</p> : null}
            <p className="italic-serif today__essence">{today.content.essence}</p>
          </div>
          <div className="panel-stack">
            <OrnatePanel className="today__oracle rise rise-1">
              <h3 className="panel__label today__oracle-label">
                <IconSparkle size={16} /> {t.today.message}
              </h3>
              <p className="today__message">{today.content.message}</p>
            </OrnatePanel>
            {today.content.lens && today.archetypeId ? (
              <section className="panel today__lens rise rise-2">
                <Sigil archetype={today.archetypeId} size={44} />
                <div>
                  <h3 className="panel__label">{t.today.lens}</h3>
                  <p>{today.content.lens}</p>
                </div>
              </section>
            ) : null}
            <div className="today__pair rise rise-3">
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
            <section className="panel today__collected rise rise-4">
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
              className="btn btn--quiet today__note rise rise-5"
              onClick={() => navigate(`/grimoire/day/${today.dateKey}?from=/today`)}
            >
              <IconQuill size={18} /> {today.note ? t.detail.note : t.today.addNote}
            </button>
          </div>
          <CrescentDivider />
          <p className="small today__footer">{t.today.comeBack}</p>
          <p className="small today__footer">{t.common.symbolic}</p>
          {today.locale !== locale ? (
            <p className="small today__footer">{fmt(t.today.storedLocale, { lang: t.languages[today.locale] })}</p>
          ) : null}
        </article>
      ) : null}
    </div>
  );
}
