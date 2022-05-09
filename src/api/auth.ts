import { TokenPair } from 'models/apiModels';
import { post } from './requests';
import { clearTokens, getTokens, setTokens } from 'utils/auth';

const authenticate = (email: string, password: string) =>
  post<TokenPair>('auth/login', { email, password });

const renewToken = (refreshToken: string): Promise<TokenPair> =>
  post<TokenPair>('auth/renew', { refreshToken: refreshToken });

const authLogout = (refreshToken: string) =>
  post<{}>('auth/logout', { refreshToken: refreshToken });

const login = async (email: string, password: string) =>
  authenticate(email, password).then((tokens) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
  });

const logout = async () => {
  const { refreshToken } = getTokens();
  await authLogout(refreshToken);
  clearTokens();
};

export { login, logout, authenticate, renewToken, authLogout };
