/**
 * Share preview (V04.7, PRODUCT_SYSTEMS J2, IA #/share/:template): the archetype card drawn on
 * this device in Story or Post format, then handed to the system share sheet (S-16). The model
 * holds content only (name, essence, three strengths), never answers, notes or dates.
 */
import { useEffect, useState } from 'react';
import type { ParsedRoute } from '../../app/router.ts';
import { useApp } from '../../app/store.tsx';
import { useModules } from '../../app/useModules.ts';
import { getArchetype } from '../../content/index.ts';
import { isArchetypeId } from '../../domain/types.ts';
import { useScreenText } from '../../i18n/screens.ts';
import { fmt } from '../../i18n/index.ts';
import { archetypeShareModel, isComplete, SHARE_SIZE, type ShareFormat } from '../../share/model.ts';
import { useToast } from '../../ui/feedback.tsx';
import { Flank } from '../../ui/Ornaments.tsx';
import { DetailHeader, NotFound } from '../grimoire/Grimoire.tsx';
import './share.css';

interface Rendered {
  format: ShareFormat;
  blob: Blob;
  url: string;
  ms: number;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('read failed'));
    reader.readAsDataURL(blob);
  });
}

export function SharePreview({ id, parsed }: { id: string; parsed: ParsedRoute }) {
  const { t, pack, state, tx } = useApp();
  const s = useScreenText();
  const toast = useToast();
  const { status } = useModules(['archetypes']);
  const locale = state.settings.locale;
  const archetypeId = id === '' ? (state.profile?.archetypeId ?? null) : isArchetypeId(id) ? id : null;
  const [format, setFormat] = useState<ShareFormat>('story');
  const [rendered, setRendered] = useState<Rendered | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const model = archetypeId && status === 'ready' ? archetypeShareModel(pack, archetypeId, locale, (k) => tx('archetypes', k)) : null;
  const modelKey = model && isComplete(model) ? `${model.archetypeId}|${model.locale}|${format}` : null;

  useEffect(() => {
    if (!modelKey || !model) return;
    let live = true;
    // The renderer (canvas, fonts, 1024 px portrait) loads only when someone opens this page.
    // The preview is a data: URL because the CSP allows images only from 'self' and data:.
    import('../../share/render.ts')
      .then(({ renderArchetypeCard }) => renderArchetypeCard(model, format))
      .then(async (r) => {
        const url = await blobToDataUrl(r.blob);
        if (live) {
          setFailed(false);
          setRendered({ format, blob: r.blob, url, ms: r.ms });
        }
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
    // modelKey captures everything the image depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelKey]);

  if (id !== '' && !isArchetypeId(id)) return <NotFound parsed={parsed} />;

  const name = archetypeId ? getArchetype(pack, archetypeId).name[locale] : '';
  const current = rendered && rendered.format === format ? rendered : null;
  const size = SHARE_SIZE[format];

  const share = async () => {
    if (!current || !archetypeId) return;
    setBusy(true);
    try {
      const { shareImage } = await import('../../share/share.ts');
      const outcome = await shareImage(current.blob, `arcana-${archetypeId}-${format}.png`, `${t.common.appName} · ${name}`);
      if (outcome === 'downloaded') toast(s.share.downloaded);
    } catch {
      toast(s.share.failed, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen detail share-page">
      <DetailHeader parsed={parsed} />
      <header className="screen-head">
        <Flank className="screen-head__flank">{s.share.eyebrow}</Flank>
        <h1 className="display h1" tabIndex={-1}>
          {s.share.title}
        </h1>
        {name ? <p className="muted">{name}</p> : null}
      </header>

      {!archetypeId ? (
        <div className="empty">
          <p className="muted">{s.share.unavailable}</p>
        </div>
      ) : (
        <>
          <div className="segmented share-page__formats" role="radiogroup" aria-label={s.share.formatLabel}>
            {(['story', 'feed'] as const).map((f) => (
              <button key={f} type="button" role="radio" aria-checked={format === f} onClick={() => setFormat(f)}>
                {f === 'story' ? s.share.story : s.share.feed}
              </button>
            ))}
          </div>

          <figure
            className={`share-page__preview share-page__preview--${format}`}
            style={{ aspectRatio: `${size.width} / ${size.height}` }}
            data-export-ms={current ? current.ms : undefined}
            aria-busy={!current && !failed}
          >
            {current ? (
              <img src={current.url} alt={fmt(s.share.previewAlt, { name })} width={size.width} height={size.height} />
            ) : (
              <figcaption className="small" role="status">
                {failed ? s.share.failed : s.share.preparing}
              </figcaption>
            )}
          </figure>

          <button type="button" className="btn btn--primary btn--block" onClick={() => void share()} disabled={!current || busy}>
            {s.share.action}
          </button>
          <p className="small share-page__privacy">{s.share.privacy}</p>
        </>
      )}
    </div>
  );
}
