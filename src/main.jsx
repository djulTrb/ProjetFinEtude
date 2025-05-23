import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './i18n'; // Import i18n configuration before rendering the app

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
