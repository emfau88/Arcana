import { useState } from 'react';
import { navigate } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { getArchetype, resolveTheme } from '../../content/index.ts';
import { LOCALES, type ArchetypeId, type Locale, type MotionPreference } from '../../domain/types.ts';
import { fmt } from '../../i18n/index.ts';
import { ConfirmDialog, useToast } from '../../ui/feedback.tsx';
import { Sigil } from '../../ui/Sigil.tsx';

export const APP_VERSION = '0.2.0';

export function Profile() {
  const { t, pack, state, actions } = useApp();
  const toast = useToast();
  const locale = state.settings.locale;
  const profile = state.profile;
  const archetype = profile?.archetypeId ? getArchetype(pack, profile.archetypeId) : null;
  const theme = resolveTheme(pack, profile?.themeId ?? pack.defaultTheme);
  const [confirm, setConfirm] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const manual = profile?.archetypeSource === 'manual';
  const current = profile?.archetypeId ?? null;

  const guard = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };

  const redo = () => {
    actions.setPending(profile?.answers ?? {}, profile?.themeId ?? null);
    navigate('/onboarding/1');
  };

  const pick = (id: ArchetypeId | null) =>
    void guard(async () => {
      if (id === current && manual) return;
      await actions.setArchetype(id);
      toast(t.profile.archetypeSaved);
    });

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

  const motions: { id: MotionPreference; label: string }[] = [
    { id: 'system', label: t.profile.motionSystem },
    { id: 'reduced', label: t.profile.motionReduced },
    { id: 'full', label: t.profile.motionFull },
  ];

  return (
    <div className="screen profile">
      <header className="screen-head">
        <p className="eyebrow">{t.profile.eyebrow}</p>
        <h1 className="display h1" tabIndex={-1}>
          {t.profile.title}
        </h1>
      </header>

      <section className="panel panel--brass profile__archetype" aria-labelledby="prof-arch">
        <Sigil archetype={profile?.archetypeId ?? null} size={92} />
        <div className="profile__archetype-text">
          <h2 id="prof-arch" className="panel__label">
            {t.profile.archetype}
          </h2>
          <p className="display h3">{archetype ? archetype.name[locale] : t.archetype.neutralTitle}</p>
          <p className="small">{archetype ? archetype.essence[locale] : t.archetype.neutralEyebrow}</p>
          {manual ? <p className="small profile__manual">{t.profile.manual}</p> : null}
        </div>
        <div className="profile__actions">
          <button type="button" className="btn btn--ghost btn--block" onClick={() => navigate('/archetype?from=/profile')}>
            {t.profile.view}
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={redo}>
            {archetype || manual ? t.profile.redo : t.profile.determine}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--block"
            aria-expanded={choosing}
            aria-controls="prof-choose"
            onClick={() => setChoosing((v) => !v)}
          >
            {choosing ? t.profile.chooseClose : t.profile.choose}
          </button>
        </div>
      </section>

      {choosing ? (
        <section id="prof-choose" className="profile__group" aria-labelledby="prof-choose-title">
          <h2 id="prof-choose-title" className="panel__label">
            {t.profile.chooseTitle}
          </h2>
          <p className="small">{t.profile.chooseHint}</p>
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

      <section className="profile__group" aria-labelledby="prof-theme">
        <h2 id="prof-theme" className="panel__label">
          {t.profile.theme}
        </h2>
        <div className="choice-list" role="radiogroup" aria-labelledby="prof-theme">
          {pack.themes.map((th) => (
            <button
              key={th.id}
              type="button"
              role="radio"
              aria-checked={theme === th.id}
              className="choice"
              onClick={() => void guard(() => actions.setTheme(th.id))}
            >
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

      <section className="profile__group" aria-labelledby="prof-settings">
        <h2 id="prof-settings" className="panel__label">
          {t.profile.settings}
        </h2>
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
