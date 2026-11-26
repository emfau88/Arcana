import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/screens.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import { AppProvider } from './app/store.tsx';
import { ToastProvider } from './ui/feedback.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('#root missing');

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
