import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { io } from 'socket.io-client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ToastContainer } from 'react-toastify';
// eslint-disable-next-line import/no-extraneous-dependencies
import App from './components/App';
import store from './slices/index.js';
import resources from './locales/index.js';

const socket = io();

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'ru',
    resources,

  });

const rollbarConfig = {
  accessToken: process.env.KEY,
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
          <App socket={socket} />
        </Provider>
      </React.StrictMode>
    </ErrorBoundary>
  </RollbarProvider>,
);
