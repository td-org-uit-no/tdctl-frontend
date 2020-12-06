import React, { SetStateAction } from 'react';
export const Authenticated = React.createContext({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {},
});
