import { getMemberAssociatedWithToken } from 'api';
import React, { useState, useEffect, createContext } from 'react';

export const AuthenticateContext = createContext({
  authenticated: false,
  setAuthenticated: (_: boolean) => {},
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
    getMemberAssociatedWithToken()
      .then((res) => {
        const userRole = res.role as RoleOptions;
        setRole(userRole);
        setAuthenticated(true);
        setValidating(false);
      })
      .catch(() => {
        setRole('unconfirmed');
        setAuthenticated(false);
        setValidating(false);
      });
  };

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
