import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function App() {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
}

export default App;
