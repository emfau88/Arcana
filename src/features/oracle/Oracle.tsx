/**
 * The oracle as a stage (design plan point 2, variant A, D-64): the painted observatory (A03),
 * the cards of the chosen spread in a row on the table, spreads and themes as one line each, the
 * main action at the bottom. After drawing, the cards turn over where they lie. Spreads come
 * from the engine of V05.2; edition spreads stay invisible without their right (no placeholders).
 */
import { useState, type CSSProperties } from 'react';
import { navigate } from '../../app/router.ts';
import { factsOf, useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { findCard, getTheme, resolveTheme } from '../../content/index.ts';
import { composeDraft, isFullyRevealed } from '../../domain/oracle.ts';
import { journeyDayToday } from '../../domain/progress.ts';
import { availableSpreads, CLASSIC_SPREAD, getSpread, spreadTheme, type SpreadDef, type SpreadId } from '../../domain/spreads.ts';
import { POSITIONS, type Reading, type ReadingContent, type ReadingDraft, type ThemeId } from '../../domain/types.ts';
import { fmt, toRoman } from '../../i18n/index.ts';
import { ConfirmDialog, Divider, useToast } from '../../ui/feedback.tsx';
import { Flank } from '../../ui/Ornaments.tsx';
import { IconCheck, IconEye, IconSparkle } from '../../ui/Icons.tsx';
import { OracleCard } from '../../ui/OracleCard.tsx';
import './oracle-stage.css';

/** Number of cards in a row, for the stage layout (cards stand on the painted table). */
const stageStyle = (n: number) => ({ '--n': n }) as CSSProperties;

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
  const { t, pack, state, actions, has } = useApp();
  const toast = useToast();
  const locale = state.settings.locale;
  const [theme, setTheme] = useState<ThemeId>(resolveTheme(pack, state.profile?.themeId ?? pack.defaultTheme));
  const [chosen, setChosen] = useState<SpreadId>(CLASSIC_SPREAD);
  const [busy, setBusy] = useState(false);
  // Names, taglines and position names of the spreads (module `spreads`, 1.5 kB). Until it is
  // there, or offline without it, the classic three cards are offered as before.
  const { status } = useModules(['spreads']);
  const texts = status === 'ready' ? state.modules.spreads : undefined;
  const facts = factsOf(state);
  const offered = texts ? availableSpreads({ has, journeyDay: journeyDayToday(facts, state.todayKey), facts }) : [];
  const spread: SpreadDef = offered.find((s) => s.id === chosen) ?? getSpread(CLASSIC_SPREAD);
  const fixedTheme = spread.theme === 'chosen' ? null : spreadTheme(pack, spread, theme);
  const labels =
    spread.id === CLASSIC_SPREAD ? POSITIONS.map((p) => pack.positionLabels[p][locale]) : spread.roles.map((_, i) => texts?.[`pos.${spread.id}.${i + 1}.label`] ?? '');
  // A review lays the thread card face up; only the new card is drawn.
  const toDraw = spread.review ? 1 : spread.roles.length;
  const drawLabel = toDraw === 3 ? t.oracle.draw : t.oracle.drawCount[toDraw as 1 | 4 | 5];

  const draw = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await actions.startReading(theme, spread.id);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen oracle oracle-stage" style={stageStyle(spread.roles.length)}>
      <div className="oracle-stage__top">
        <header className="screen-head">
          <Flank className="screen-head__flank">{t.oracle.eyebrow}</Flank>
          <h1 className="display h2" tabIndex={-1}>
            {t.oracle.title}
          </h1>
        </header>
      </div>
      <ol className="stage-spread" data-n={labels.length}>
        {labels.map((label, i) => (
          <li key={`${spread.id}-${i}`} className="stage-spread__slot">
            <OracleCard card={null} locale={locale} faceUp={false} size="spread" label={label} />
            <span className="stage-spread__pos">
              <span className="stage-spread__num">{toRoman(i + 1)}</span> {label}
            </span>
          </li>
        ))}
      </ol>

      {offered.length > 1 ? (
        <>
          <div className="theme-row oracle-stage__spreads" role="radiogroup" aria-label={t.oracle.chooseSpread}>
            {offered.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={spread.id === s.id} className="theme-pill" onClick={() => setChosen(s.id)}>
                {texts?.[`spread.${s.id}.name`]}
              </button>
            ))}
          </div>
          <p className="oracle-stage__tagline">{texts?.[`spread.${spread.id}.tagline`]}</p>
        </>
      ) : null}

      {fixedTheme ? null : (
        <div className="theme-row" role="radiogroup" aria-label={t.oracle.chooseTheme}>
          {pack.themes.map((th) => (
            <button key={th.id} type="button" role="radio" aria-checked={theme === th.id} className="theme-pill" onClick={() => setTheme(th.id)}>
              {th.label[locale]}
            </button>
          ))}
        </div>
      )}
      <p className="oracle-stage__theme">{getTheme(pack, fixedTheme ?? theme).description[locale]}</p>
      <p className="small oracle__ethics">{t.oracle.ethics}</p>
      <div className="sticky-action">
        <button type="button" className="btn btn--primary btn--block oracle__draw" onClick={draw} disabled={busy}>
          <IconSparkle size={18} /> {drawLabel}
        </button>
      </div>
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
  const content = allUp ? composeDraft(pack, draft, locale, { spreads: state.modules.spreads, deep: state.modules['cards-deep'] }) : null;
  // Position names of spreads other than the classic one come from the module (V05.2).
  const labels =
    draft.spreadId && draft.spreadId !== CLASSIC_SPREAD ? draft.cardIds.map((_, i) => state.modules.spreads?.[`pos.${draft.spreadId}.${i + 1}.label`] ?? '') : undefined;
  const themeLabel = getTheme(pack, draft.themeId).label[locale];
  const spreadName = draft.spreadId && draft.spreadId !== CLASSIC_SPREAD ? state.modules.spreads?.[`spread.${draft.spreadId}.name`] : undefined;

  const flip = async (i: number) => {
    if (draft.revealed[i]) return;
    setJustRevealed((s) => new Set(s).add(i));
    try {
      await actions.revealReadingCard(i);
    } catch {
      toast(t.errors.writeFailed, 'error');
    }
  };
  const flipAll = async () => {
    setJustRevealed(new Set(draft.cardIds.map((_, i) => i).filter((i) => !draft.revealed[i])));
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
    <div className="screen oracle oracle-stage oracle-stage--laid" style={stageStyle(draft.cardIds.length)}>
      <div className="oracle-stage__top">
        <header className="screen-head">
          <Flank className="screen-head__flank">{spreadName ?? t.oracle.eyebrow}</Flank>
          <h1 className="display h2" tabIndex={-1}>
            {themeLabel}
          </h1>
        </header>
        {restored ? <p className="notice oracle__resumed">{t.oracle.resumed}</p> : null}
      </div>

      <Spread
        cardIds={draft.cardIds}
        revealed={draft.revealed}
        labels={labels}
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
    <div className="screen oracle oracle-stage oracle-stage--laid" style={stageStyle(reading.cardIds.length)}>
      <div className="oracle-stage__top">
        <header className="screen-head">
          <Flank className="screen-head__flank">{reading.content.spreadName ?? t.oracle.eyebrow}</Flank>
          <h1 className="display h2" tabIndex={-1}>
            {reading.content.themeLabel}
          </h1>
        </header>
      </div>
      <Spread {...savedSpread(reading)} />
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

/** Props of a saved reading's spread: all cards face up, stored position names for V05.2 spreads. */
export function savedSpread(reading: Reading): { cardIds: readonly string[]; revealed: readonly boolean[]; labels?: readonly string[] } {
  return {
    cardIds: reading.cardIds,
    revealed: reading.cardIds.map(() => true),
    labels: reading.spreadId ? reading.content.positions.map((p) => p.positionLabel) : undefined,
  };
}

export function Spread({
  cardIds,
  revealed,
  labels,
  animated,
  onFlip,
}: {
  cardIds: readonly string[];
  revealed: readonly boolean[];
  /** Position names; missing = the classic positions in the current language. */
  labels?: readonly string[];
  animated?: Set<number>;
  onFlip?: (i: number) => void;
}) {
  const { t, pack, state } = useApp();
  const locale = state.settings.locale;
  return (
    <ol className="spread" data-n={cardIds.length} style={stageStyle(cardIds.length)}>
      {cardIds.map((cardId, idx) => {
        const card = findCard(pack, cardId) ?? null;
        const up = revealed[idx] === true;
        const posLabel = labels?.[idx] ?? pack.positionLabels[POSITIONS[idx] ?? 'situation'][locale];
        const title = card ? card.title[locale] : '';
        return (
          <li key={idx} className="spread__slot">
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
      {content.past && content.past.cards.length > 0 ? (
        // Reviews begin with the person's own cards of the period (V05.2, S-47), stored with the reading.
        <section className="panel past-cards rise">
          <h3 className="panel__label">{content.past.title}</h3>
          <ul className="past-cards__list">
            {content.past.cards.map((c) => (
              <li key={c.cardId} className="past-cards__item">
                <OracleCard card={findCard(pack, c.cardId) ?? null} locale={locale} faceUp size="mini" label={c.cardTitle} />
                <div>
                  <p className="past-cards__title">
                    <span className="past-cards__num">{toRoman(c.cardOrder)}</span> {c.cardTitle}
                  </p>
                  <p className="small italic-serif past-cards__essence">{c.essence}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
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
                {pos.question ? <p className="interpretation__ask">{pos.question}</p> : null}
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
