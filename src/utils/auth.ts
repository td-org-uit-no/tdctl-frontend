import { accessTokenKey, refreshTokenKey } from 'constants/apiConstants';
import { TokenPair, TokenPayload } from 'models/apiModels';
import { getMemberAssociatedWithToken } from 'api';
import jwt from 'jwt-decode';

const getTokens = (): TokenPair => {
  const accessToken = sessionStorage.getItem(accessTokenKey) || '';
  const refreshToken = sessionStorage.getItem(refreshTokenKey) || '';
  return { accessToken, refreshToken };
};
const setTokens = (accessToken: string, refreshToken: string) => {
  sessionStorage.setItem(accessTokenKey, accessToken);
  sessionStorage.setItem(refreshTokenKey, refreshToken);
};

const clearTokens = () => {
  sessionStorage.clear();
};

const getRole = (): string => {
  try {
    const { accessToken } = getTokens();
    const payload = jwt(accessToken) as TokenPayload;
    return payload['role'];
  } catch (err) {
    return 'unconfirmed';
  }
};

// gets the number of milliseconds until the refreshToken expires
const findRefreshTokenExpInMs = (): number | undefined => {
  const { refreshToken } = getTokens();
  if (refreshToken === '') {
    return undefined;
  }
  const payload = jwt(refreshToken) as TokenPayload;
  // new date is based on milliseconds while jwt is based on second
  const exp = new Date(payload['exp'] * 1000).getTime();
  const now = new Date().getTime();
  if (isNaN(exp) || isNaN(now)) {
    return undefined;
  }
  const diff = exp - now;
  return exp - now > 0 ? diff : undefined;
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

export {
  setTokens,
  getTokens,
  clearTokens,
  verifyAuthentication,
  getRole,
  findRefreshTokenExpInMs,
};
