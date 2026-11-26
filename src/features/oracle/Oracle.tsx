import { useState } from 'react';
import { navigate } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { findCard, getTheme, resolveTheme } from '../../content/index.ts';
import { composeReading, isFullyRevealed } from '../../domain/oracle.ts';
import { POSITIONS, type Reading, type ReadingContent, type ReadingDraft, type ThemeId } from '../../domain/types.ts';
import { fmt, toRoman } from '../../i18n/index.ts';
import { ConfirmDialog, Divider, useToast } from '../../ui/feedback.tsx';
import { IconCheck, IconEye, IconSparkle } from '../../ui/Icons.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';

export function Oracle() {
  const { state } = useApp();
  const [savedId, setSavedId] = useState<string | null>(null);
  // Drafts that already existed when this screen opened were restored from storage.
  const [restoredDraftId] = useState(state.draft?.id ?? null);

  if (state.draft) {
    return <DraftReading draft={state.draft} restored={restoredDraftId === state.draft.id} onSaved={setSavedId} />;
  }
  const saved = savedId ? state.readings.find((r) => r.id === savedId) : undefined;
  if (saved) return <SavedReading reading={saved} onNew={() => setSavedId(null)} />;
  return <OracleEntry />;
}

/* -------------------------------------------------------------------- Entry */

function OracleEntry() {
  const { t, pack, state, actions } = useApp();
  const toast = useToast();
  const locale = state.settings.locale;
  const [theme, setTheme] = useState<ThemeId>(resolveTheme(pack, state.profile?.themeId ?? pack.defaultTheme));
  const [busy, setBusy] = useState(false);

  const draw = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await actions.startReading(theme);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen oracle">
      <header className="screen-head">
        <p className="eyebrow">{t.oracle.eyebrow}</p>
        <h1 className="display h1" tabIndex={-1}>
          {t.oracle.title}
        </h1>
        <p className="muted oracle__subtitle">{t.oracle.subtitle}</p>
      </header>

      <section aria-labelledby="oracle-theme" className="oracle__section">
        <h2 id="oracle-theme" className="panel__label">
          {t.oracle.chooseTheme}
        </h2>
        <div className="choice-list" role="radiogroup" aria-labelledby="oracle-theme">
          {pack.themes.map((th) => (
            <button key={th.id} type="button" role="radio" aria-checked={theme === th.id} className="choice" onClick={() => setTheme(th.id)}>
              <span className="choice__mark" aria-hidden="true" />
              <span className="choice__text">
                <span>{th.label[locale]}</span>
                <span className="choice__sub">{th.description[locale]}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="oracle-positions" className="oracle__section">
        <h2 id="oracle-positions" className="panel__label">
          {t.oracle.positionsTitle}
        </h2>
        <ol className="positions">
          {POSITIONS.map((p, i) => (
            <li key={p} className="positions__item">
              <span className="positions__slot" aria-hidden="true">
                {toRoman(i + 1)}
              </span>
              <span className="positions__name">{pack.positionLabels[p][locale]}</span>
              <span className="small">{t.oracle.positionHelp[p]}</span>
            </li>
          ))}
        </ol>
      </section>

      <button type="button" className="btn btn--primary btn--block oracle__draw" onClick={draw} disabled={busy}>
        <IconSparkle size={18} /> {t.oracle.draw}
      </button>
      <p className="small oracle__ethics">{t.oracle.ethics}</p>
    </div>
  );
}

/* -------------------------------------------------------------- Draft view */

function DraftReading({ draft, restored, onSaved }: { draft: ReadingDraft; restored: boolean; onSaved(id: string): void }) {
  const { t, pack, state, actions } = useApp();
  const toast = useToast();
  const locale = state.settings.locale;
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justRevealed, setJustRevealed] = useState<Set<number>>(new Set());
  const allUp = isFullyRevealed(draft);
  const content = allUp ? composeReading(pack, draft.cardIds, draft.themeId, locale) : null;
  const themeLabel = getTheme(pack, draft.themeId).label[locale];

  const flip = async (i: 0 | 1 | 2) => {
    if (draft.revealed[i]) return;
    setJustRevealed((s) => new Set(s).add(i));
    try {
      await actions.revealReadingCard(i);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };
  const flipAll = async () => {
    setJustRevealed(new Set([0, 1, 2]));
    try {
      await actions.revealAllReading();
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };
  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const reading = await actions.saveReading();
      onSaved(reading.id);
    } catch {
      toast(t.errors.writeFailed, 'error');
      setSaving(false);
    }
  };
  const discard = async () => {
    setConfirm(false);
    try {
      await actions.discardReading();
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };

  return (
    <div className="screen oracle">
      <header className="screen-head">
        <p className="eyebrow">{t.oracle.eyebrow}</p>
        <h1 className="display h2" tabIndex={-1}>
          {themeLabel}
        </h1>
      </header>
      {restored ? <p className="notice oracle__resumed">{t.oracle.resumed}</p> : null}

      <Spread
        cardIds={draft.cardIds}
        revealed={draft.revealed}
        animated={justRevealed}
        onFlip={allUp ? undefined : flip}
      />

      {!allUp ? (
        <div className="oracle__controls">
          <p className="muted">{t.oracle.tapToReveal}</p>
          <button type="button" className="btn btn--ghost" onClick={flipAll}>
            {t.oracle.revealAll}
          </button>
          <button type="button" className="btn btn--quiet" onClick={() => setConfirm(true)}>
            {t.oracle.discard}
          </button>
        </div>
      ) : null}

      {content ? (
        <>
          <Interpretation content={content} />
          <div className="btn-stack oracle__actions rise rise-5">
            <button type="button" className="btn btn--primary btn--block" onClick={save} disabled={saving}>
              {t.oracle.save}
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => setConfirm(true)} disabled={saving}>
              {t.oracle.discard}
            </button>
          </div>
          <p className="small oracle__ethics">{t.oracle.ethics}</p>
        </>
      ) : null}

      <ConfirmDialog
        open={confirm}
        title={t.oracle.discardTitle}
        body={t.oracle.discardBody}
        confirmLabel={t.oracle.discardConfirm}
        cancelLabel={t.common.cancel}
        danger
        onConfirm={discard}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}

/* -------------------------------------------------------------- Saved view */

function SavedReading({ reading, onNew }: { reading: Reading; onNew(): void }) {
  const { t } = useApp();
  return (
    <div className="screen oracle">
      <header className="screen-head">
        <p className="eyebrow">{t.oracle.eyebrow}</p>
        <h1 className="display h2" tabIndex={-1}>
          {reading.content.themeLabel}
        </h1>
      </header>
      <Spread cardIds={reading.cardIds} revealed={[true, true, true]} />
      <div className="notice oracle__saved" role="status">
        <IconCheck size={18} />
        <span>{t.oracle.saved}</span>
        <button type="button" className="btn btn--ghost oracle__saved-open" onClick={() => navigate(`/grimoire/reading/${reading.id}?from=/oracle`)}>
          {t.oracle.openSaved}
        </button>
      </div>
      <Interpretation content={reading.content} />
      <div className="btn-stack oracle__actions">
        <button type="button" className="btn btn--primary btn--block" onClick={onNew}>
          {t.oracle.newReading}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Shared UI */

export function Spread({
  cardIds,
  revealed,
  animated,
  onFlip,
}: {
  cardIds: readonly [string, string, string];
  revealed: readonly [boolean, boolean, boolean];
  animated?: Set<number>;
  onFlip?: (i: 0 | 1 | 2) => void;
}) {
  const { t, pack, state } = useApp();
  const locale = state.settings.locale;
  return (
    <ol className="spread">
      {POSITIONS.map((p, i) => {
        const idx = i as 0 | 1 | 2;
        const card = findCard(pack, cardIds[idx]) ?? null;
        const up = revealed[idx];
        const posLabel = pack.positionLabels[p][locale];
        const title = card ? card.title[locale] : '';
        return (
          <li key={p} className="spread__slot">
            <span className="spread__pos">{posLabel}</span>
            <OracleCard
              card={card}
              locale={locale}
              faceUp={up}
              size="spread"
              animated={animated?.has(idx) ?? false}
              label={up ? fmt(t.oracle.cardShown, { position: posLabel, title }) : fmt(t.oracle.cardHidden, { position: posLabel })}
              onActivate={onFlip && !up ? () => onFlip(idx) : undefined}
            />
            <span className={`spread__name ${up ? 'is-shown' : ''}`} aria-hidden={!up}>
              {up && card ? (
                <>
                  <span className="spread__num">{toRoman(card.order)}</span> {title}
                </>
              ) : (
                <span className="spread__placeholder">◇</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Interpretation({ content }: { content: ReadingContent }) {
  const { t, pack, state } = useApp();
  const locale = state.settings.locale;
  return (
    <article className="interpretation">
      <p className="lead interpretation__intro rise">{content.intro}</p>
      <Divider />
      <ol className="panel-stack interpretation__positions">
        {content.positions.map((pos, i) => {
          const card = findCard(pack, pos.cardId) ?? null;
          return (
            <li key={pos.position} className={`panel interpretation__pos rise rise-${i + 1}`}>
              <OracleCard card={card} locale={locale} faceUp size="mini" label={pos.cardTitle} />
              <div>
                <p className="eyebrow">
                  {toRoman(i + 1)} · {pos.positionLabel}
                </p>
                <h3 className="display h3">{pos.cardTitle}</h3>
                <p className="italic-serif interpretation__essence">{pos.essence}</p>
                <p>{pos.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <section className="panel panel--brass interpretation__synthesis rise rise-4">
        <h3 className="panel__label">
          <IconSparkle size={16} /> {t.oracle.synthesis}
        </h3>
        <p className="small interpretation__via">{content.synthesisTitle}</p>
        <p>{content.synthesis}</p>
      </section>
      <section className="panel rise rise-5">
        <h3 className="panel__label">
          <IconEye size={16} /> {t.oracle.sharedReflection}
        </h3>
        <p className="italic-serif interpretation__question">{content.reflection}</p>
      </section>
    </article>
  );
}
