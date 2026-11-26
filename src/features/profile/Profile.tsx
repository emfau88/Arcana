import { useState } from 'react';
import { navigate } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { getArchetype, resolveTheme } from '../../content/index.ts';
import { LOCALES, type Locale, type MotionPreference } from '../../domain/types.ts';
import { fmt } from '../../i18n/index.ts';
import { ConfirmDialog, useToast } from '../../ui/feedback.tsx';
import { Sigil } from '../../ui/Sigil.tsx';

export const APP_VERSION = '0.1.0';

export function Profile() {
  const { t, pack, state, actions } = useApp();
  const toast = useToast();
  const locale = state.settings.locale;
  const profile = state.profile;
  const archetype = profile?.archetypeId ? getArchetype(pack, profile.archetypeId) : null;
  const theme = resolveTheme(pack, profile?.themeId ?? pack.defaultTheme);
  const [confirm, setConfirm] = useState(false);

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
        </div>
        <button type="button" className="btn btn--ghost btn--block profile__redo" onClick={redo}>
          {archetype ? t.profile.redo : t.profile.determine}
        </button>
      </section>

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
          <p className="small">
            <span className="prototype-tag">{t.common.prototype}</span> {t.profile.prototypeNote}
          </p>
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
