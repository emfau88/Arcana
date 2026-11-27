import { navigate } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { milestoneTextKey } from '../../domain/journey.ts';
import type { Reward } from '../../domain/progress.ts';
import { fmt, type Messages } from '../../i18n/index.ts';
import { StarGlyph } from '../../ui/Ornaments.tsx';

/* ----------------------------------------------------- Milestone moment */

function rewardLabel(t: Messages, r: Reward): string | null {
  const [kind, sub] = r.id.split(':');
  if (kind === 'archetype-chapter') return t.milestone.chapter;
  if (kind === 'review') return sub === 'week' ? t.milestone.reviewWeek : t.milestone.reviewMonth;
  if (kind === 'constellation') return t.milestone.constellation;
  return null;
}

/** Shown once on "Today" after the card, on a journey day that opened something (A6). */
export function MilestoneMoment({ milestone, rewards }: { milestone: { day: number; key: string }; rewards: Reward[] }) {
  const { t, tx, actions } = useApp();
  useModules(['journey']);
  const key = milestoneTextKey(milestone.day);
  const text = key ? tx('journey', key) : '';
  const labels = [...new Set(rewards.map((r) => rewardLabel(t, r)).filter((l): l is string => l !== null))];
  const close = (then?: () => void) => {
    actions.markSeen(milestone.key).catch(() => undefined);
    then?.();
  };
  return (
    <section className="panel panel--brass milestone-moment rise" aria-labelledby="ms-title">
      <p className="eyebrow">{t.milestone.eyebrow}</p>
      <h2 id="ms-title" className="display h3">
        {fmt(t.today.journeyDay, { n: milestone.day })}
      </h2>
      {text ? <p className="italic-serif milestone-moment__text">{text}</p> : null}
      {labels.length ? (
        <>
          <p className="panel__label milestone-moment__label">{t.milestone.opened}</p>
          <ul className="star-list">
            {labels.map((l) => (
              <li key={l}>
                <StarGlyph size={10} className="star-list__mark" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="milestone-moment__actions">
        <button type="button" className="btn btn--ghost" onClick={() => close(() => navigate('/grimoire/journey?from=/today'))}>
          {t.milestone.view}
        </button>
        <button type="button" className="btn btn--quiet" onClick={() => close()}>
          {t.milestone.dismiss}
        </button>
      </div>
    </section>
  );
}
