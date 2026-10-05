import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { loadContent } from './data/content.js';
import './index.css';

// Public pages wait (briefly) for live content from the admin database; the admin panel loads its own data.
const ready = window.location.pathname.startsWith('/admin') ? Promise.resolve() : loadContent();

ready.then(() =>
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </MotionConfig>
      </BrowserRouter>
    </StrictMode>
  )
);
