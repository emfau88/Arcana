import { useEffect, useRef, useState } from 'react';
import { goBack, navigate, type ParsedRoute } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { getArchetype } from '../../content/index.ts';
import type { ThemeId } from '../../domain/types.ts';
import { fmt } from '../../i18n/index.ts';
import { IconBack, IconInfo, IconMoon } from '../../ui/Icons.tsx';
import { cardSrc } from '../../ui/OracleCard.tsx';
import { Sigil } from '../../ui/Sigil.tsx';
import { useToast } from '../../ui/feedback.tsx';

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
      <p className="eyebrow rise rise-1">{t.welcome.eyebrow}</p>
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
        <button type="button" className="btn btn--quiet" onClick={skip} disabled={busy}>
          {t.welcome.skipAll}
        </button>
      </div>
      <p className="small welcome__privacy rise rise-5">
        <IconMoon size={14} /> {t.welcome.privacy}
      </p>
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
          <button type="button" className="btn btn--primary btn--block onboarding__finish" onClick={finish} disabled={busy}>
            {t.onboarding.finish}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------- Archetype reveal */

export function ArchetypeReveal({ parsed }: { parsed: ParsedRoute }) {
  const { t, pack, state } = useApp();
  const locale = state.settings.locale;
  const profile = state.profile;
  const archetype = profile?.archetypeId ? getArchetype(pack, profile.archetypeId) : null;
  const answered = profile ? Object.keys(profile.answers).length : 0;
  const manual = profile?.archetypeSource === 'manual';
  const fromProfile = parsed.from === '/profile';

  return (
    <div className="screen archetype">
      <div className="archetype__emblem" aria-hidden="true">
        <span className="archetype__halo" />
        <Sigil archetype={profile?.archetypeId ?? null} size={168} className="archetype__sigil" />
      </div>
      {archetype ? (
        <>
          <p className="eyebrow rise rise-1">{t.archetype.eyebrow}</p>
          <h1 className="display h1 archetype__name rise rise-2" tabIndex={-1}>
            {archetype.name[locale]}
          </h1>
          <p className="lead archetype__essence rise rise-3">{archetype.essence[locale]}</p>
          <div className="panel-stack archetype__panels rise rise-4">
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
          <p className="small archetype__basis rise rise-5">{manual ? t.archetype.basisManual : fmt(t.archetype.basis, { n: answered })}</p>
        </>
      ) : (
        <>
          <p className="eyebrow rise rise-1">{t.archetype.neutralEyebrow}</p>
          <h1 className="display h1 archetype__name rise rise-2" tabIndex={-1}>
            {t.archetype.neutralTitle}
          </h1>
          <p className="lead archetype__essence rise rise-3">{manual ? t.archetype.neutralBodyManual : t.archetype.neutralBody}</p>
        </>
      )}
      <details className="explain rise rise-5">
        <summary>
          <IconInfo size={16} /> {t.archetype.howItWorks.split(':')[0]}
        </summary>
        <p className="small">{t.archetype.howItWorks}</p>
      </details>
      {fromProfile ? (
        <button type="button" className="btn btn--primary btn--block archetype__cta rise rise-5" onClick={() => goBack(parsed)}>
          {t.archetype.toProfile}
        </button>
      ) : (
        <button type="button" className="btn btn--primary btn--block archetype__cta rise rise-5" onClick={() => navigate('/today', { replace: true })}>
          {t.archetype.toToday}
        </button>
      )}
    </div>
  );
}
