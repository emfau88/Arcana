import { useContext, useState } from 'react';
import { navigate, type ParsedRoute } from '../../app/router.ts';
import { factsOf, useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { getArchetype, resolveTheme } from '../../content/index.ts';
import { ModuleLoadError } from '../../content/modules/registry.ts';
import { QUESTIONNAIRE_VERSION } from '../../domain/archetypes.ts';
import { CARD_BACKS, openBacks } from '../../domain/cardbacks.ts';
import { journeyDays } from '../../domain/progress.ts';
import { LOCALES, type ArchetypeId, type Locale, type MotionPreference } from '../../domain/types.ts';
import { useScreenText } from '../../i18n/screens.ts';
import { fmt } from '../../i18n/index.ts';
import { ConfirmDialog, useToast } from '../../ui/feedback.tsx';
import { Flank } from '../../ui/Ornaments.tsx';
import { backSrc, CardBackContext } from '../../ui/OracleCard.tsx';
import { Sigil } from '../../ui/Sigil.tsx';
import { DetailHeader } from '../grimoire/Grimoire.tsx';
import { ArchetypePortrait } from '../../ui/Portrait.tsx';
import { ArchetypeProfile } from '../identity/Identity.tsx';

export const APP_VERSION = '0.4.1';
/** Gesehen-Markierung: the offer of questionnaire v2 was dismissed (E9, D-47). */
export const OFFER_V2_KEY = 'offer:questionnaire-v2';

function useGuard() {
  const { t } = useApp();
  const toast = useToast();
  return async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      toast(e instanceof ModuleLoadError ? t.errors.contentLoad : t.errors.writeFailed, 'error');
    }
  };
}

/**
 * "Ich" (V04.6, IA §3): the archetype pillar with portrait, second voice and the full profile.
 * The numbers pillar joins in V06; until then nothing stands in for it (no dummies).
 * Settings, privacy and version moved to their own page (#/me/settings).
 */
export function Profile() {
  const { t, pack, state, actions, tx } = useApp();
  const s = useScreenText();
  const toast = useToast();
  const guard = useGuard();
  useModules(['archetypes']);
  const locale = state.settings.locale;
  const profile = state.profile;
  const archetype = profile?.archetypeId ? getArchetype(pack, profile.archetypeId) : null;
  const second = archetype && profile?.secondaryArchetypeId ? getArchetype(pack, profile.secondaryArchetypeId) : null;
  const theme = resolveTheme(pack, profile?.themeId ?? pack.defaultTheme);
  const [choosing, setChoosing] = useState(false);
  const manual = profile?.archetypeSource === 'manual';
  const current = profile?.archetypeId ?? null;
  const answered = profile ? Object.keys(profile.answers).length : 0;
  // E9: people who answered the shorter questionnaire are offered the new questions once; their
  // profile stays as it is until they finish. Nothing changes if they dismiss it.
  const offerV2 = profile !== null && answered > 0 && (profile.questionnaireVersion ?? 1) < QUESTIONNAIRE_VERSION && !state.seen.some((s) => s.key === OFFER_V2_KEY);
  const complementText = second ? tx('archetypes', `complement.${second.id}`) : '';

  const redo = () => {
    actions.setPending(profile?.answers ?? {}, profile?.themeId ?? null);
    navigate('/onboarding/1');
  };

  /** Starts at the first unanswered question; earlier answers stay filled in. */
  const answerNew = () => {
    const answers = profile?.answers ?? {};
    const first = pack.questions.findIndex((q) => answers[q.id] === undefined);
    actions.setPending(answers, profile?.themeId ?? null);
    navigate(`/onboarding/${first === -1 ? 1 : first + 1}`);
  };

  const pick = (id: ArchetypeId | null) =>
    void guard(async () => {
      if (id === current && manual) return;
      await actions.setArchetype(id);
      toast(t.profile.archetypeSaved);
    });

  return (
    <div className="screen profile me">
      <header className="screen-head">
        <Flank className="screen-head__flank">{t.profile.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {t.profile.title}
        </h1>
      </header>

      <section className={`panel panel--brass profile__archetype${archetype ? ' me__pillar' : ''}`} aria-labelledby="prof-arch">
        {archetype ? (
          <ArchetypePortrait id={archetype.id} size={720} alt={fmt(s.me.portraitAlt, { name: archetype.name[locale] })} eager seal className="me__portrait" />
        ) : (
          <Sigil archetype={null} size={92} />
        )}
        <div className="profile__archetype-text">
          <h2 id="prof-arch" className="panel__label">
            {t.profile.archetype}
          </h2>
          <p className="display h3">{archetype ? archetype.name[locale] : t.archetype.neutralTitle}</p>
          <p className="small">{archetype ? archetype.essence[locale] : t.archetype.neutralEyebrow}</p>
          {manual ? <p className="small profile__manual">{t.profile.manual}</p> : null}
        </div>

        {second ? (
          <div className="me__second">
            <ArchetypePortrait id={second.id} size={240} alt="" className="me__second-portrait" />
            <div className="me__second-text">
              <p className="eyebrow">{s.me.secondVoice}</p>
              <p className="display me__second-name">{second.name[locale]}</p>
              {complementText ? <p className="small">{complementText}</p> : null}
              <button type="button" className="text-link" onClick={() => navigate(`/grimoire/archetypes/${second.id}?from=/me`)}>
                {s.me.readProfile} <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        ) : archetype && !manual && profile?.secondaryArchetypeId === null ? (
          <p className="small me__one-voice">{s.me.oneVoice}</p>
        ) : null}

        {archetype || answered > 0 ? (
          <div className="me__links">
            {answered > 0 ? (
              <button type="button" className="btn btn--ghost" onClick={() => navigate('/archetype/why?from=/me')}>
                {s.me.why}
              </button>
            ) : null}
            {archetype ? (
              <button type="button" className="btn btn--ghost" onClick={() => navigate('/share/archetype?from=/me')}>
                {s.me.share}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="profile__actions">
          <button type="button" className="btn btn--quiet btn--block" onClick={() => navigate('/archetype?from=/me')}>
            {t.profile.view}
          </button>
          <button type="button" className="btn btn--quiet btn--block" onClick={redo}>
            {archetype || manual ? t.profile.redo : t.profile.determine}
          </button>
          <button type="button" className="btn btn--quiet btn--block" aria-expanded={choosing} aria-controls="prof-choose" onClick={() => setChoosing((v) => !v)}>
            {choosing ? t.profile.chooseClose : t.profile.choose}
          </button>
        </div>
      </section>

      {offerV2 ? (
        <section className="panel profile__offer" aria-labelledby="prof-offer">
          <h2 id="prof-offer" className="panel__label">
            {t.profile.offerTitle}
          </h2>
          <p className="small">{t.profile.offerBody}</p>
          <div className="profile__actions">
            <button type="button" className="btn btn--ghost btn--block" onClick={answerNew}>
              {t.profile.offerStart}
            </button>
            <button type="button" className="btn btn--quiet btn--block" onClick={() => void guard(() => actions.markSeen(OFFER_V2_KEY))}>
              {t.profile.offerLater}
            </button>
          </div>
        </section>
      ) : null}

      {choosing ? (
        <section id="prof-choose" className="profile__group" aria-labelledby="prof-choose-title">
          <h2 id="prof-choose-title" className="panel__label">
            {t.profile.chooseTitle}
          </h2>
          <p className="small profile__hint">{t.profile.chooseHint}</p>
          <div className="choice-list" role="radiogroup" aria-labelledby="prof-choose-title">
            {pack.archetypes.map((a) => (
              <button key={a.id} type="button" role="radio" aria-checked={current === a.id} className="choice choice--sigil" onClick={() => pick(a.id)}>
                <Sigil archetype={a.id} size={40} />
                <span className="choice__text">
                  <span>{a.name[locale]}</span>
                  <span className="choice__sub">{a.essence[locale]}</span>
                </span>
              </button>
            ))}
            <button type="button" role="radio" aria-checked={current === null} className="choice choice--sigil" onClick={() => pick(null)}>
              <Sigil archetype={null} size={40} />
              <span className="choice__text">
                <span>{t.profile.neutralOption}</span>
                <span className="choice__sub">{t.profile.neutralOptionSub}</span>
              </span>
            </button>
          </div>
        </section>
      ) : null}

      {archetype ? (
        <div className="profile__group">
          <ArchetypeProfile id={archetype.id} from="/me" />
        </div>
      ) : null}

      <div className="profile__group">
        <button type="button" className="btn btn--ghost btn--block" onClick={() => navigate('/grimoire/archetypes?from=/me')}>
          {s.me.library}
        </button>
      </div>

      <section className="profile__group" aria-labelledby="prof-theme">
        <h2 id="prof-theme" className="panel__label">
          {t.profile.theme}
        </h2>
        <div className="choice-list" role="radiogroup" aria-labelledby="prof-theme">
          {pack.themes.map((th) => (
            <button key={th.id} type="button" role="radio" aria-checked={theme === th.id} className="choice" onClick={() => void guard(() => actions.setTheme(th.id))}>
              <span className="choice__mark" aria-hidden="true" />
              <span className="choice__text">
                <span>{th.label[locale]}</span>
                <span className="choice__sub">{th.description[locale]}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="small">{t.profile.themeNote}</p>
      </section>

      <div className="profile__group">
        <button type="button" className="row-link" onClick={() => navigate('/me/settings')}>
          <span className="row-link__text">
            <span>{t.profile.settings}</span>
            <span className="small">
              {t.profile.language} · {t.profile.motion} · {t.profile.privacy}
            </span>
          </span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Settings */

export function Settings({ parsed }: { parsed: ParsedRoute }) {
  const { t, pack, state, actions } = useApp();
  const toast = useToast();
  const guard = useGuard();
  const locale = state.settings.locale;
  const [confirm, setConfirm] = useState(false);

  const wipe = async () => {
    setConfirm(false);
    try {
      await actions.clearAllData();
      navigate('/welcome', { replace: true });
      toast(t.profile.deleted);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };

  const back = useContext(CardBackContext);
  const open = openBacks(journeyDays(factsOf(state)));

  const motions: { id: MotionPreference; label: string }[] = [
    { id: 'system', label: t.profile.motionSystem },
    { id: 'reduced', label: t.profile.motionReduced },
    { id: 'full', label: t.profile.motionFull },
  ];

  return (
    <div className="screen detail profile settings">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{t.profile.title}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {t.profile.settings}
        </h1>
      </header>

      <section className="profile__group" aria-label={t.profile.settings}>
        <div className="panel profile__settings">
          <div className="setting">
            <span className="setting__label" id="set-lang">
              {t.profile.language}
            </span>
            <div className="segmented" role="radiogroup" aria-labelledby="set-lang">
              {LOCALES.map((l: Locale) => (
                <button key={l} type="button" role="radio" aria-checked={locale === l} lang={l} onClick={() => void guard(() => actions.setLocale(l))}>
                  {t.languages[l]}
                </button>
              ))}
            </div>
          </div>
          <div className="setting">
            <span className="setting__label" id="set-motion">
              {t.profile.motion}
            </span>
            <div className="segmented" role="radiogroup" aria-labelledby="set-motion">
              {motions.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={state.settings.motion === m.id} onClick={() => void guard(() => actions.setMotion(m.id))}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {open.length > 1 ? (
        <section className="profile__group" aria-labelledby="set-backs">
          <h2 id="set-backs" className="panel__label">
            {t.profile.cardBack}
          </h2>
          <div className="panel backs">
            <p className="small muted backs__body">{t.profile.cardBackBody}</p>
            <div className="backs__list" role="radiogroup" aria-labelledby="set-backs">
              {open.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={back === id}
                  className="backs__item"
                  onClick={() => void guard(() => actions.setCardBack(id))}
                >
                  <img src={backSrc(id, true)} alt="" width={240} height={360} decoding="async" loading="lazy" draggable={false} />
                  <span className="backs__name">{t.profile.backs[id]}</span>
                </button>
              ))}
            </div>
            {open.length < CARD_BACKS.length ? <p className="small muted backs__more">{t.profile.cardBackMore}</p> : null}
          </div>
        </section>
      ) : null}

      <section className="profile__group" aria-labelledby="prof-privacy">
        <h2 id="prof-privacy" className="panel__label">
          {t.profile.privacy}
        </h2>
        <div className="panel">
          <p className="muted">{t.profile.privacyBody}</p>
        </div>
        <button type="button" className="btn btn--danger btn--block" onClick={() => setConfirm(true)}>
          {t.profile.delete}
        </button>
      </section>

      <section className="profile__group" aria-labelledby="prof-about">
        <h2 id="prof-about" className="panel__label">
          {t.profile.about}
        </h2>
        <div className="panel profile__about">
          <p className="display h3">{t.common.appName}</p>
          <p className="small">{fmt(t.profile.version, { v: APP_VERSION, c: pack.version })}</p>
          <p className="small">{t.profile.aboutBody}</p>
          <p className="small">{t.common.symbolic}</p>
        </div>
      </section>

      <ConfirmDialog
        open={confirm}
        title={t.profile.deleteTitle}
        body={t.profile.deleteBody}
        confirmLabel={t.profile.deleteConfirm}
        cancelLabel={t.common.cancel}
        danger
        onConfirm={() => void wipe()}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
