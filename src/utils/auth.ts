import { accessTokenKey, refreshTokenKey } from 'constants/apiConstants';
import { TokenPair } from 'models/apiModels';
import { authenticate, getMemberAssociatedWithToken } from './api';

const getTokens = (): TokenPair => {
  const accessToken = sessionStorage.getItem(accessTokenKey) || '';
  const refreshToken = sessionStorage.getItem(refreshTokenKey) || '';
  return { accessToken, refreshToken };
};
const setTokens = (accessToken: string, refreshToken: string) => {
  sessionStorage.setItem(accessTokenKey, accessToken);
  sessionStorage.setItem(refreshTokenKey, refreshToken);
};

const login = async (email: string, password: string) => {
  try {
    const { accessToken, refreshToken } = await authenticate(email, password);
    setTokens(accessToken, refreshToken);
  } catch (error) {
    throw error;
  }
};

/* Deeply checks if user is authenticated by 
   performing a query to the API */
const verifyAuthentication = async () => {
  const tokens = getTokens();
  if (tokens.accessToken === '' || tokens.refreshToken === '') {
    return false;
  }
  try {
    await getMemberAssociatedWithToken();
    return true;
  } catch {
    return false;
  }
};

export { login, setTokens, getTokens, verifyAuthentication };
