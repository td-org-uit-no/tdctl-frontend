import React, { useState, useEffect, createContext } from 'react';
import {
  findRefreshTokenExpInMs,
  getRole,
  verifyAuthentication,
} from 'utils/auth';

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
    verifyAuthentication().then((res) => {
      if (res) {
        const userRole = getRole() as RoleOptions;
        setRole(userRole);
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

  // function for checking the refreshToken after it expired to set the user to not authenticated when inactive
  const monitorRefreshToken = () => {
    // small offset to handle if renewal was valid but it took time for the tokens to be retrieved ans sat
    const offset = 10 * 1000;
    const exp = findRefreshTokenExpInMs();
    if (exp === undefined) {
      // refreshToken is expired
      setAuthenticated(false);
      return;
    }
    setTimeout(monitorRefreshToken, exp + offset);
  };

  useEffect(() => {
    if (authenticated) {
      monitorRefreshToken();
    } else {
      // reset role matching not authenticated user
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
      }}
    >
      {children}
    </AuthenticateContext.Provider>
  );
};

export default AuthenticateProvider;
