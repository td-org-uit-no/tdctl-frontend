import { getTokenInfo, renewToken } from 'api';
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
  const [exp, setExp] = useState<number | undefined>();

  const updateCredentials = () => {
    getTokenInfo()
      .then((res) => {
        const userRole = res.role as RoleOptions;
        setExp(res.exp);
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

  // Automatically refresh token when it is expired
  useEffect(() => {
    if (!exp) {
      return;
    }

    const timeout = exp * 1000 - Date.now();
    const timer = setTimeout(async () => {
      await renewToken();
      updateCredentials();
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [exp]);

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
