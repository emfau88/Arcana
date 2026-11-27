import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { goBack, navigate, type ParsedRoute } from '../../app/router.ts';
import { useReducedMotion } from '../../app/motion.ts';
import { muster } from '../../app/muster.ts';
import { useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { portraitSrc } from '../../content/assets.ts';
import { getArchetype } from '../../content/index.ts';
import { scoreArchetype } from '../../domain/archetypes.ts';
import type { ThemeId } from '../../domain/types.ts';
import { fmt } from '../../i18n/index.ts';
import { IconBack, IconInfo, IconMoon } from '../../ui/Icons.tsx';
import { Flank } from '../../ui/Ornaments.tsx';
import { cardSrc } from '../../ui/OracleCard.tsx';
import { Sigil } from '../../ui/Sigil.tsx';
import { useToast } from '../../ui/feedback.tsx';
import { ArchetypePortrait } from '../../ui/Portrait.tsx';
import { warmFont, warmImage, whenIdle } from '../../ui/warm.ts';
import { warmWorld } from '../../ui/World.tsx';

/* ----------------------------------------------------------------- Welcome */

export function Welcome() {
  const { t, actions } = useApp();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const skip = async () => {
    setBusy(true);
    try {
      await actions.skipOnboarding();
      navigate('/today', { replace: true });
    } catch {
      toast(t.errors.writeFailed, 'error');
      setBusy(false);
    }
  };
  return (
    <div className="screen screen--center welcome">
      <div className="welcome__fan rise" aria-hidden="true">
        <span className="welcome__ring" />
        <img src={cardSrc('card-back', true)} alt="" className="welcome__card welcome__card--l" />
        <img src={cardSrc('card-back', true)} alt="" className="welcome__card welcome__card--r" />
        <img src={cardSrc('card-back')} alt="" className="welcome__card welcome__card--c" />
      </div>
      <p className="welcome__wordmark rise rise-1" aria-hidden="true">
        {t.common.appName}
      </p>
      <Flank className="screen-head__flank rise rise-1">{t.welcome.eyebrow}</Flank>
      <h1 className="display h1 welcome__title rise rise-2" tabIndex={-1}>
        {t.welcome.title}
      </h1>
      <p className="lead welcome__body rise rise-3">{t.welcome.body}</p>
      <p className="notice welcome__note rise rise-3">
        <IconInfo size={18} />
        <span>{t.welcome.symbolic}</span>
      </p>
      <div className="btn-stack welcome__actions rise rise-4">
        <button type="button" className="btn btn--primary btn--block" onClick={() => navigate('/onboarding/1')}>
          {t.welcome.start}
        </button>
        <p className="small welcome__privacy">
          <IconMoon size={14} /> {t.welcome.privacy}
        </p>
        <button type="button" className="btn btn--quiet" onClick={skip} disabled={busy}>
          {t.welcome.skipAll}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Questions */

export function Questionnaire({ step }: { step: number }) {
  const { t, tx, pack, state, actions } = useApp();
  const toast = useToast();
  const total = pack.questions.length + 1;
  const question = pack.questions[step - 1];
  const locale = state.settings.locale;
  const answers = state.pendingAnswers;
  const [chosen, setChosen] = useState<string | null>(question ? (answers[question.id] ?? null) : null);
  const [theme, setTheme] = useState<ThemeId>(state.pendingTheme ?? state.profile?.themeId ?? pack.defaultTheme);
  const [busy, setBusy] = useState(false);
  const advance = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (advance.current) window.clearTimeout(advance.current);
    },
    [],
  );

  useEffect(() => {
    if (step > total) navigate(`/onboarding/${total}`, { replace: true });
  }, [step, total]);

  // Returning people load the questionnaire texts in the background (B-08); if that did not
  // work (web offline), try again here and say so if it still fails.
  const hasTexts = Boolean(state.modules.identity);
  useEffect(() => {
    if (hasTexts) return;
    actions.ensureModules().catch(() => toast(t.errors.contentLoad, 'error'));
  }, [hasTexts, actions, toast, t]);

  // B-13: the reveal follows the theme step. Its italic serif, the room A05 and the portraits load
  // now, so the screen change does not wait for them (reference emulator: the second long frame of
  // the change is gone). Nothing changes on screen.
  const onThemeStep = !question && step === total;
  const expected = onThemeStep ? scoreArchetype(pack.questions, answers) : null;
  const warmMain = expected?.archetypeId ?? null;
  const warmSecond = expected?.complementId ?? null;
  useEffect(() => {
    if (!onThemeStep) return;
    return whenIdle(() => {
      warmFont('italic 500 1em "Cormorant Garamond Variable"');
      warmWorld('profile');
      if (warmMain) warmImage(portraitSrc(warmMain, 720));
      if (warmSecond) warmImage(portraitSrc(warmSecond, 240));
    });
  }, [onThemeStep, warmMain, warmSecond]);
  if (step > total) return null;

  const next = () => navigate(`/onboarding/${step + 1}`);

  const choose = (answerId: string) => {
    if (!question) return;
    setChosen(answerId);
    actions.setPending({ ...answers, [question.id]: answerId }, state.pendingTheme);
    if (advance.current) window.clearTimeout(advance.current);
    advance.current = window.setTimeout(next, 260);
  };

  const skipQuestion = () => {
    if (!question) return;
    const rest = { ...answers };
    delete rest[question.id];
    actions.setPending(rest, state.pendingTheme);
    next();
  };

  const finish = async () => {
    setBusy(true);
    try {
      await actions.completeOnboarding(answers, theme);
      navigate('/archetype', { replace: true });
    } catch {
      toast(t.errors.writeFailed, 'error');
      setBusy(false);
    }
  };

  return (
    <div className="screen onboarding">
      <div className="onboarding__top">
        <button type="button" className="back-link" onClick={() => history.back()}>
          <IconBack size={20} /> {t.common.back}
        </button>
        {question ? (
          <button type="button" className="btn btn--quiet onboarding__skip" onClick={() => navigate(`/onboarding/${total}`)}>
            {t.onboarding.skipRest}
          </button>
        ) : null}
      </div>
      <div
        className="progress-steps"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={fmt(t.onboarding.progress, { n: step, total })}
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < step ? 'is-done' : ''} />
        ))}
      </div>
      <p className="eyebrow onboarding__count">{fmt(t.onboarding.progress, { n: step, total })}</p>

      {question ? (
        <div key={question.id} className="onboarding__body fade">
          <h1 className="display h2 onboarding__prompt" id="q-prompt" tabIndex={-1}>
            {tx('identity', `question.${question.id}.prompt`)}
          </h1>
          <div className="choice-list" role="radiogroup" aria-labelledby="q-prompt">
            {question.answers.map((a) => (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={chosen === a.id}
                className="choice"
                onClick={() => choose(a.id)}
              >
                <span className="choice__mark" aria-hidden="true" />
                <span className="choice__text">{tx('identity', `question.${question.id}.${a.id}`)}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--quiet onboarding__skipq" onClick={skipQuestion}>
            {t.onboarding.skipQuestion}
          </button>
          <p className="small onboarding__voluntary">{t.onboarding.voluntary}</p>
        </div>
      ) : (
        <div className="onboarding__body fade">
          <h1 className="display h2 onboarding__prompt" id="theme-prompt" tabIndex={-1}>
            {t.onboarding.themeTitle}
          </h1>
          <div className="choice-list" role="radiogroup" aria-labelledby="theme-prompt">
            {pack.themes.map((th) => (
              <button
                key={th.id}
                type="button"
                role="radio"
                aria-checked={theme === th.id}
                className="choice"
                onClick={() => {
                  setTheme(th.id);
                  actions.setPending(answers, th.id);
                }}
              >
                <span className="choice__mark" aria-hidden="true" />
                <span className="choice__text">
                  <span>{th.label[locale]}</span>
                  <span className="choice__sub">{th.description[locale]}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="small onboarding__voluntary">{t.onboarding.themeHint}</p>
          <div className="sticky-action">
            <button type="button" className="btn btn--primary btn--block onboarding__finish" onClick={finish} disabled={busy}>
              {t.onboarding.finish}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------- Archetype reveal */

/**
 * Moments of the portrait reveal in ms (V04.2): portrait, name, reveal sentence, then the second
 * voice as its own moment, then the rest. Everything is in place after REVEAL_TOTAL_MS (≤ 8 s);
 * "Skip" shows it at once, reduced motion shows it statically.
 */
export const REVEAL_STEPS = { portrait: 0, name: 900, sentence: 1500, second: 2700, rest: 3500 } as const;
export const REVEAL_TOTAL_MS = 4300;

const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function ArchetypeReveal({ parsed }: { parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  useModules(['archetypes']);
  const reduced = useReducedMotion();
  const [skipped, setSkipped] = useState(false);
  const [done, setDone] = useState(false);
  const locale = state.settings.locale;
  const profile = state.profile;
  const archetype = profile?.archetypeId ? getArchetype(pack, profile.archetypeId) : null;
  const second = archetype && profile?.secondaryArchetypeId ? getArchetype(pack, profile.secondaryArchetypeId) : null;
  const answered = profile ? Object.keys(profile.answers).length : 0;
  const manual = profile?.archetypeSource === 'manual';
  const fromProfile = parsed.from === '/me' || parsed.from === '/profile';
  const animate = Boolean(archetype) && !reduced && !skipped;
  const revealText = archetype ? tx('archetypes', `reveal.${archetype.id}`) : '';
  const complementText = second ? tx('archetypes', `complement.${second.id}`) : '';

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setDone(true), REVEAL_TOTAL_MS);
    return () => window.clearTimeout(id);
  }, [reduced]);

  const ctaButton = fromProfile ? (
    <button type="button" className="btn btn--primary btn--block archetype__cta" onClick={() => goBack(parsed)}>
      {t.archetype.toProfile}
    </button>
  ) : (
    <button type="button" className="btn btn--primary btn--block archetype__cta" onClick={() => navigate('/today', { replace: true })}>
      {t.archetype.toToday}
    </button>
  );
  // Design plan point 1: the way on stays in view while the profile scrolls underneath.
  const cta = <div className="sticky-action">{ctaButton}</div>;
  const explain = (
    <details className="explain">
      <summary>
        <IconInfo size={16} /> {t.archetype.howItWorks.split(':')[0]}
      </summary>
      <p className="small">{t.archetype.howItWorks}</p>
    </details>
  );

  if (!archetype) {
    return (
      <div className="screen archetype">
        <div className="archetype__emblem" aria-hidden="true">
          <span className="archetype__halo" />
          <Sigil archetype={null} size={168} className="archetype__sigil" />
        </div>
        <Flank className="screen-head__flank rise rise-1">{t.archetype.neutralEyebrow}</Flank>
        <h1 className="display h1 archetype__name rise rise-2" tabIndex={-1}>
          {t.archetype.neutralTitle}
        </h1>
        <p className="lead archetype__essence rise rise-3">{manual ? t.archetype.neutralBodyManual : t.archetype.neutralBody}</p>
        {answered > 0 ? (
          <button type="button" className="btn btn--ghost rise rise-4" onClick={() => navigate('/archetype/why?from=/archetype')}>
            {t.archetype.why}
          </button>
        ) : null}
        <div className="rise rise-5 reveal__full">{explain}</div>
        <div className="rise rise-5 reveal__full">{cta}</div>
      </div>
    );
  }

  const variant = muster('reveal');
  if (variant === 'a') {
    // Sample for design plan point 5, variant A: the reveal is one moment on one screen. Strength,
    // shadow, "Why?" and sharing live on "Ich", where they already are.
    return (
      <div className={`screen archetype reveal reveal--moment${animate ? ' is-animated' : ''}`}>
        {animate && !done ? (
          <button type="button" className="btn btn--quiet reveal__skip" onClick={() => setSkipped(true)}>
            {t.common.skip}
          </button>
        ) : null}
        <div className="reveal__stage reveal-step" style={at(REVEAL_STEPS.portrait)}>
          <span className="archetype__halo" aria-hidden="true" />
          <ArchetypePortrait id={archetype.id} size={720} alt={fmt(t.archetype.portraitAlt, { name: archetype.name[locale] })} eager seal className="reveal__portrait" />
        </div>
        <div className="reveal-step reveal__head" style={at(REVEAL_STEPS.name)}>
          <Flank className="screen-head__flank">{t.archetype.eyebrow}</Flank>
          <h1 className="display h1 archetype__name" tabIndex={-1}>
            {archetype.name[locale]}
          </h1>
        </div>
        <div className="reveal-step reveal__words" style={at(REVEAL_STEPS.sentence)}>
          <p className="italic-serif reveal__sentence">{revealText || archetype.essence[locale]}</p>
        </div>
        {second ? (
          <div className="reveal-step reveal__second" style={at(REVEAL_STEPS.second)}>
            <ArchetypePortrait id={second.id} size={240} alt="" className="reveal__second-portrait" />
            <div className="reveal__second-text">
              <p className="eyebrow">{t.archetype.secondVoice}</p>
              <p className="display h3">{second.name[locale]}</p>
            </div>
          </div>
        ) : null}
        <div className="reveal-step reveal__moment-actions" style={at(second ? REVEAL_STEPS.rest : REVEAL_STEPS.second)}>
          {ctaButton}
          {fromProfile ? null : (
            <button type="button" className="btn btn--quiet" onClick={() => navigate('/me', { replace: true })}>
              {locale === 'de' ? 'Mein Profil ansehen' : 'See my profile'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`screen archetype reveal${animate ? ' is-animated' : ''}`}>
      {animate && !done ? (
        <button type="button" className="btn btn--quiet reveal__skip" onClick={() => setSkipped(true)}>
          {t.common.skip}
        </button>
      ) : null}
      <div className="reveal__stage reveal-step" style={at(REVEAL_STEPS.portrait)}>
        <span className="archetype__halo" aria-hidden="true" />
        <ArchetypePortrait id={archetype.id} size={720} alt={fmt(t.archetype.portraitAlt, { name: archetype.name[locale] })} eager seal className="reveal__portrait" />
      </div>
      <div className="reveal-step reveal__head" style={at(REVEAL_STEPS.name)}>
        <Flank className="screen-head__flank">{t.archetype.eyebrow}</Flank>
        <h1 className="display h1 archetype__name" tabIndex={-1}>
          {archetype.name[locale]}
        </h1>
      </div>
      <div className="reveal-step reveal__words" style={at(REVEAL_STEPS.sentence)}>
        <p className="lead archetype__essence">{archetype.essence[locale]}</p>
        {revealText ? <p className="italic-serif reveal__sentence">{revealText}</p> : null}
      </div>
      {second ? (
        <div className="reveal-step reveal__second" style={at(REVEAL_STEPS.second)}>
          <ArchetypePortrait id={second.id} size={240} alt="" className="reveal__second-portrait" />
          <div className="reveal__second-text">
            <p className="eyebrow">{t.archetype.secondVoice}</p>
            <p className="display h3">{second.name[locale]}</p>
            {complementText ? <p className="small">{complementText}</p> : null}
          </div>
        </div>
      ) : null}
      <div className="reveal-step reveal__rest" style={at(second ? REVEAL_STEPS.rest : REVEAL_STEPS.second)}>
        <div className="me__links">
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/archetype/why?from=/archetype')}>
            {t.archetype.why}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/share/archetype?from=/archetype')}>
            {t.archetype.share}
          </button>
        </div>
        <div className="panel-stack archetype__panels">
          <section className="panel panel--brass">
            <h2 className="panel__label">{t.archetype.strength}</h2>
            <p>{archetype.strength[locale]}</p>
          </section>
          <section className="panel">
            <h2 className="panel__label">{t.archetype.shadow}</h2>
            <p className="italic-serif archetype__question">{archetype.shadow[locale]}</p>
          </section>
          <section className="panel">
            <h2 className="panel__label">{t.archetype.growth}</h2>
            <p>{archetype.growth[locale]}</p>
          </section>
          <section className="panel">
            <h2 className="panel__label">{t.archetype.reflection}</h2>
            <p className="italic-serif archetype__question">{archetype.reflection[locale]}</p>
          </section>
        </div>
        <p className="small archetype__basis">{manual ? t.archetype.basisManual : fmt(t.archetype.basis, { n: answered })}</p>
        {/* Sample, variant B: everything stays, only the second way to the same explanation goes. */}
        {variant === 'b' ? null : explain}
      </div>
      {/* Direct child of the screen, so it sticks from the first moment it appears (also with a second voice or large text). */}
      <div className="sticky-action reveal-step" style={at(second ? REVEAL_STEPS.rest : REVEAL_STEPS.second)}>
        {ctaButton}
      </div>
    </div>
  );
}
