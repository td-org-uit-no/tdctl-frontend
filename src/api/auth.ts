import { baseUrl } from 'constants/apiConstants';
import { post } from './requests';

const login = (email: string, password: string) =>
  post<{}>('auth/login', { email, password });

// Use regular fetch here since we don't need to retry refreshing the token
const renewToken = () =>
  fetch(baseUrl + 'auth/renew', { method: 'POST', credentials: 'include' });

const logout = () => post<{}>('auth/logout', {});

export { login, logout, renewToken };
