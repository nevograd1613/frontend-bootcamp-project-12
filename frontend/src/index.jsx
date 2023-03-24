import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import i18n from 'i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ToastContainer } from 'react-toastify';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-toastify/dist/ReactToastify.css';
import App from './components/App';
import store from './slices/index.js';
import resources from './locales/index.js';

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'ru',
    resources,

  });

const rollbarConfig = {
  accessToken: 'e47597a1bdbf4dbea6f61c5c245cdd2d',
  environment: 'testenv',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <React.StrictMode>
        <Provider store={store}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* Same as */}
          <ToastContainer />
          <App />
        </Provider>
      </React.StrictMode>
    </ErrorBoundary>
  </RollbarProvider>,
);
