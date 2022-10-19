import React, { useState, useEffect, createContext } from 'react';
import { getRole, verifyAuthentication } from 'utils/auth';

export const AuthenticateContext = createContext({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {},
  isValidating: true,
  role: 'unconfirmed' as RoleOptions,
  updateCredentials: () => {},
});

export type RoleOptions = 'unconfirmed' | 'member' | 'admin';

interface Role {
  [key: string]: RoleOptions;
}

export const Roles = {
  admin: 'admin',
  member: 'member',
  unconfirmed: 'unconfirmed',
} as Role;

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
          setRole('unconfirmed');
        }
        setAuthenticated(res);
        setValidating(false);
      } else {
        setValidating(true);
        setRole('unconfirmed');
        setAuthenticated(false);
        setValidating(false);
      }
    });
  };

  useEffect(() => {
    if (authenticated === false) {
      setRole(Roles.unconfirmed);
    }
  }, [authenticated]);

  useEffect(() => {
    updateCredentials();
  }, []);

  return (
    <AuthenticateContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        isValidating,
        role,
        updateCredentials,
      }}>
      {children}
    </AuthenticateContext.Provider>
  );
};

export default AuthenticateProvider;
