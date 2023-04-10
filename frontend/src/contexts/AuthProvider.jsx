import React, { useState, useMemo } from 'react';
import AuthContext from './index.jsx';

const AuthProvider = ({ children }) => {
  const initialState = Boolean(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(initialState);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }

    return {};
  };

  const userName = () => JSON.parse(localStorage.getItem('userId')).username;

  const memo = useMemo(() => ({
    loggedIn, logIn, logOut, getAuthHeader, userName,
  }), [loggedIn]);

  return (
    <AuthContext.Provider value={memo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
