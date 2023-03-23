import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import { Button, Container, Navbar } from 'react-bootstrap';
import NotFoundPage from './NotFoundPage.jsx';
import MainPage from './MainPage.jsx';
import LoginPage from './LoginPage.jsx';
import Signup from './Signup.jsx';
import useAuth from '../hooks/index.jsx';
import AuthContext from '../contexts/index.jsx';

const AuthProvider = ({ children }) => {
  const initialState = Boolean(localStorage.getItem('userData'));
  const [loggedIn, setLoggedIn] = useState(initialState);

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

  return (
    auth.loggedIn ? children : <Navigate to="/login" />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  console.log(auth.loggedIn);

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Выход</Button>
      : null
  );
};

const App = () => {
  const a = '';
  console.log(a);
  return (
    <AuthProvider>
      <Router>
        <Navbar className="shadow-sm" bg="white" expand="lg" variant="white">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Hexlet Chat
            </Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
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
