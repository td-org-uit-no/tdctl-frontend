import { accessTokenKey, refreshTokenKey } from 'constants/apiConstants';
import { TokenPair, TokenPayload } from 'models/apiModels';
import { getMemberAssociatedWithToken } from 'api';
import jwt from 'jwt-decode'

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
  try{
    const { accessToken } = getTokens();
    const payload = jwt(accessToken) as TokenPayload;
    return payload["role"]
  } catch (err) {
    throw err
  }
}

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
};
