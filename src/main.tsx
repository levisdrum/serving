import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from 'react-aria-components';
import { BrowserRouter } from 'react-router-dom';
import '@material-symbols/font-400/rounded.css';
import { App } from './app/App';
import './app/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider locale="pt-BR">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </React.StrictMode>
);
