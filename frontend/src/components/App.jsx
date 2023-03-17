import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import NotFoundPage from './NotFoundPage.jsx';
import MainPage from './MainPage.jsx';
import LoginPage from './LoginPage.jsx';
import Header from './Header.jsx';
import useAuth from '../hooks/index.jsx';
import AuthContext from '../contexts/index.jsx';
import routes from '../routes.js';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const memo = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  return (
    <AuthContext.Provider value={memo}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => {
  const a = '';
  console.log(a);
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            )}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
