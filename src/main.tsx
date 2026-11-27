import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/screens.css';
import './styles/muster.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import { AppProvider } from './app/store.tsx';
import { ToastProvider } from './ui/feedback.tsx';
import { applyTextZoom } from './platform/textZoom.ts';

const container = document.getElementById('root');
if (!container) throw new Error('#root missing');
applyTextZoom();

createRoot(container).render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <div className="world">
          <div className="world__aside" aria-hidden="true" />
          <App />
        </div>
      </ToastProvider>
    </AppProvider>
  </StrictMode>,
);
