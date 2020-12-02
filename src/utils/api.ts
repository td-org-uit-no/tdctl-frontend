import {
  accessTokenKey,
  refreshTokenKey,
  baseUrl,
} from '../constants/apiConstants';
import { PartialMember, Member, TokenPair } from '../models/apiModels';

const get = <T>(url: string, auth = false) => {
  const request = new Request(baseUrl + url);
  if (auth) {
    return authFetch<T>(request);
  }
  return fetch(request).then((res) => handleResponse<T>(res));
};

const post = <T>(url: string, data: any, auth = false) => {
  const request = new Request(baseUrl + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  return auth
    ? authFetch<T>(request)
    : fetch(request).then(
        (res) => handleResponse<T>(res),
        (error: Error) => {
          throw error;
        }
      );
};

function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(response.statusText + response.status);
  }
  return response.json() as Promise<T>;
}

const renewTokensAndRetry = <T>(request: Request): Promise<T> => {
  const refreshToken = localStorage.getItem('REFRESH_TOKEN') || '';

  return renewToken(refreshToken).then((tokens) => {
    // Set new tokens
    localStorage.setItem(accessTokenKey, tokens.accessToken);
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
    // Set new access token
    request.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    return fetch(request).then((res) => handleResponse<T>(res));
  });
};

const authFetch = <T>(request: Request) => {
  const accessToken = localStorage.getItem(accessTokenKey) || '';
  request.headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(request).then((res) =>
    handleResponse<T>(res).catch((error) => {
      if (error instanceof HttpError && error.statusCode === 401) {
        return renewTokensAndRetry<T>(request);
      } else {
        throw error;
      }
    })
  );
};

/* Http error */
class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/* Endpoints */

export const registerMember = (partialMember: PartialMember): Promise<Member> =>
  post<Member>('member/', partialMember);

export const login = async (
  email: string,
  password: string
): Promise<TokenPair> =>
  post<TokenPair>('auth/login', { email: email, password: password }).then(
    (tokens) => {
      localStorage.setItem(accessTokenKey, tokens.accessToken);
      localStorage.setItem(refreshTokenKey, tokens.refreshToken);
      return tokens;
    }
  );

export const renewToken = (refreshToken: string): Promise<TokenPair> =>
  post<TokenPair>('auth/renew/', refreshToken);

export const getMemberAssociatedWithToken = (): Promise<any> =>
  get('member/', true);
