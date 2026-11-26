import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ Toast */

interface ToastMsg {
  id: number;
  text: string;
  tone: 'info' | 'error';
}
const ToastCtx = createContext<(text: string, tone?: ToastMsg['tone']) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  const seq = useRef(0);
  const show = useCallback((text: string, tone: ToastMsg['tone'] = 'info') => {
    seq.current += 1;
    setMsg({ id: seq.current, text, tone });
  }, []);
  useEffect(() => {
    if (!msg) return;
    const timer = window.setTimeout(() => setMsg(null), msg.tone === 'error' ? 6000 : 3200);
    return () => window.clearTimeout(timer);
  }, [msg]);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {msg ? (
          <div key={msg.id} className={`toast ${msg.tone === 'error' ? 'toast--error' : ''}`}>
            {msg.text}
          </div>
        ) : null}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

/* ------------------------------------------------------------ Confirm */

export interface ConfirmProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  onConfirm(): void;
  onCancel(): void;
}

/** Native <dialog> for focus trapping, Escape and screen-reader semantics. */
export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, danger, onConfirm, onCancel }: ConfirmProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const uid = useId();
  const ids = { t: `${uid}-title`, b: `${uid}-body` };
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={ids.t}
      aria-describedby={ids.b}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <h2 id={ids.t}>{title}</h2>
      <p id={ids.b}>{body}</p>
      <div className="btn-stack">
        <button type="button" className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button type="button" className="btn btn--quiet" onClick={onCancel} autoFocus>
          {cancelLabel}
        </button>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------ Ornaments */

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
    </div>
  );
}
