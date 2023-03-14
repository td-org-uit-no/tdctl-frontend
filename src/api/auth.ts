import { baseUrl } from 'constants/apiConstants';
import { TokenInfo } from 'models/apiModels';
import { get, post } from './requests';

const login = (email: string, password: string) =>
  post<{}>('auth/login', { email, password });

// Use regular fetch here since we don't need to retry refreshing the token
const renewToken = () =>
  fetch(baseUrl + 'auth/renew', { method: 'POST', credentials: 'include' });

const logout = () => post<{}>('auth/logout', {});

const getTokenInfo = () => get<TokenInfo>('auth/token-info/');

export { login, logout, renewToken, getTokenInfo };
