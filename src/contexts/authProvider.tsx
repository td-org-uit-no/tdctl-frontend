import React, { useState, useEffect, createContext } from 'react';
import { getRole, verifyAuthentication } from 'utils/auth';

export const AuthenticateContext = createContext({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {},
  isValidating: true,
  role: "unconfirmed",
  updateCredentials: () => {}
});

type RoleOptions = 'unconfirmed' | 'member' | 'admin';

const AuthenticateProvider: React.FC = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(true);
  const [isValidating, setValidating] = useState(true);
  const [role, setRole] = useState<RoleOptions>('unconfirmed');

  const updateCredentials = () => {
    verifyAuthentication().then((res) => {
      if (res) {
        try {
          const userRole = getRole() as RoleOptions;
          setRole(userRole);
        } catch (error) {
          setRole("unconfirmed");
        }
        setAuthenticated(res);
        setValidating(false);
      } else {
        setValidating(true);
        setRole("unconfirmed")
        setAuthenticated(false)
        setValidating(false);
      }
    });
  };

  useEffect(() => {
    updateCredentials();
  }, []);

  return (
    <AuthenticateContext.Provider
      value={{ authenticated, setAuthenticated, isValidating, role, updateCredentials}}>
      {children}
    </AuthenticateContext.Provider>
  );
};

export default AuthenticateProvider;
