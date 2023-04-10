import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import { Button, Container, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import NotFoundPage from './NotFoundPage.jsx';
import MainPage from './MainPage.jsx';
import LoginPage from './LoginPage.jsx';
import Signup from './Signup.jsx';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import AuthProvider from '../contexts/AuthProvider.jsx';
import SocketProvider from '../contexts/SocketProvider.jsx';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  return (
    auth.loggedIn ? children : <Navigate to={routes.loginPagePath()} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('exit')}</Button>
      : null
  );
};

const App = ({ chatApi }) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column h-100">
      <AuthProvider>
        <SocketProvider chatApi={chatApi}>
          <Router>
            <Navbar className="shadow-sm" bg="white" expand="lg" variant="white">
              <Container>
                <Navbar.Brand as={Link} to={routes.mainPagePath()}>
                  {t('name')}
                </Navbar.Brand>
                <AuthButton />
              </Container>
            </Navbar>
            <Routes>
              <Route path={routes.notFoundPath()} element={<NotFoundPage />} />
              <Route path={routes.loginPagePath()} element={<LoginPage />} />
              <Route path={routes.signUpPagePath()} element={<Signup />} />
              <Route
                path={routes.mainPagePath()}
                element={(
                  <PrivateRoute>
                    <MainPage />
                  </PrivateRoute>
                    )}
              />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
