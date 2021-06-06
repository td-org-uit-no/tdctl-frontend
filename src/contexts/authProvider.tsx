import React, { useState, useEffect, createContext } from 'react';
import { verifyAuthentication } from 'utils/auth';

export const AuthenticateContext = createContext({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {},
  isValidating: true,
});

const AuthenticateProvider: React.FC = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(true);
  const [isValidating, setValidating] = useState(true);

  const isAuth = () => {
    verifyAuthentication().then((res) => {
      setAuthenticated(res);
      setValidating(false);
    });
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthenticateContext.Provider
      value={{ authenticated, setAuthenticated, isValidating }}>
      {children}
    </AuthenticateContext.Provider>
  );
};

export default AuthenticateProvider;
