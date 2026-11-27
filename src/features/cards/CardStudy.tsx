/**
 * Card study, part 2 of the card page (V05.1, PRODUCT_SYSTEMS D2, PROGRESSION_DESIGN §4): two short
 * parts, first looking at the painting, then the card in one's own life. A tap on "Read" is enough;
 * an answer is voluntary and kept as a journal entry of kind 'study'. Voluntary and repeatable:
 * nothing here counts down, and the level that follows is derived from the stored facts (D-09).
 */
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../app/store.tsx';
import type { CardLevel } from '../../domain/progress.ts';
import type { StudyPart, StudyStep } from '../../domain/study.ts';
import { fmt } from '../../i18n/index.ts';
import { useScreenText } from '../../i18n/screens.ts';
import { useToast } from '../../ui/feedback.tsx';

interface Props {
  id: string;
  step: StudyStep;
  level: CardLevel;
  texts: readonly [string, string];
}

export function CardStudy({ id, step, level, texts }: Props) {
  const { actions, t } = useApp();
  const s = useScreenText().card;
  const toast = useToast();
  // The part on offer: from the stored facts, or part 2 right after part 1 in this visit.
  const [part, setPart] = useState<StudyPart>(step.part);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ part: StudyPart; from: CardLevel } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const wasOpen = useRef(open);

  // Opening, finishing or closing moves the focus to the panel heading, so it never gets lost.
  useEffect(() => {
    if (wasOpen.current !== open) heading.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const finish = async () => {
    setBusy(true);
    try {
      await actions.studyCard(id, part, answer);
      setDone({ part, from: level });
      setAnswer('');
      setOpen(false);
      if (part === 1) setPart(2);
      else setPart(1);
    } catch {
      toast(t.errors.writeFailed, 'error');
    } finally {
      setBusy(false);
    }
  };

  if (open) {
    const text = texts[part - 1];
    return (
      <section className="panel card-layer card-study" aria-labelledby="card-study-title">
        <h2 id="card-study-title" className="panel__label" tabIndex={-1} ref={heading}>
          {fmt(s.studyPart, { n: part, name: s.studyParts[part - 1]! })}
        </h2>
        <p className="card-layer__text">{text}</p>
        <label className="small muted card-study__label" htmlFor="card-study-answer">
          {s.studyAnswer}
        </label>
        <textarea
          id="card-study-answer"
          className="note__field"
          value={answer}
          maxLength={2000}
          rows={4}
          placeholder={t.detail.notePlaceholder}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="card-study__actions">
          <button type="button" className="btn btn--quiet" onClick={() => setOpen(false)} disabled={busy}>
            {s.studyLater}
          </button>
          <button type="button" className="btn btn--primary" onClick={finish} disabled={busy}>
            {answer.trim() ? s.studyKeep : s.studyRead}
          </button>
        </div>
      </section>
    );
  }

  // Closed: one quiet sentence and the way in. After part 1 the next step is part 2.
  const intro = part === 2 ? s.studyIntroPart2 : step.again ? s.studyAgain : s.studyIntro;
  const action = part === 2 ? s.studyContinue : step.again ? s.studyRepeat : s.studyStart;
  return (
    <section className="panel card-layer card-study" aria-labelledby="card-study-title">
      <h2 id="card-study-title" className="panel__label" tabIndex={-1} ref={heading}>
        {s.study}
      </h2>
      <div aria-live="polite">
        {done ? (
          <p className="card-study__done">
            {fmt(s.studyDone, { n: done.part })}
            {level > done.from ? ` ${fmt(s.studyLevel, { n: level, name: s.levelNames[level]! })}` : ''}
          </p>
        ) : null}
      </div>
      <p className="card-layer__text">{intro}</p>
      <button type="button" className="btn btn--ghost card-study__start" onClick={() => setOpen(true)}>
        {action}
      </button>
    </section>
  );
}
