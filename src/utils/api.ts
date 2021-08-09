import { baseUrl } from 'constants/apiConstants';
import {
  PartialMember,
  MemberUpdate,
  Member,
  TokenPair,
  ChangePasswordPayload,
  Event
} from 'models/apiModels';
import { setTokens, getTokens } from './auth';

/* Http error */
export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const get = async <T>(url: string, auth = false) => {
  const request = new Request(baseUrl + url);
  if (auth) {
    return authFetch<T>(request);
  }
  return fetch(request).then((res) => handleResponse<T>(res));
};

//Put and post are basicly equal :/
//could be moved into same function(PostOrPut) however its not pretty

export const post = async <T>(
  url: string,
  data: any,
  auth = false,
) => {
  const request = new Request(baseUrl + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (auth) {
    return authFetch<T>(request);
  }
  return fetch(request).then((res) => handleResponse<T>(res));
};

export const put = async <T>(
  url: string,
  data: any,
  auth = false,
) => {
  const request = new Request(baseUrl + url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (auth) {
    return authFetch<T>(request);
  }
  return fetch(request).then((res) => handleResponse<T>(res));
};


const authFetch = <T>(request: Request) => {
  const { accessToken } = getTokens();
  request.headers.set('Authorization', `Bearer ${accessToken}`);
  return fetch(request).then((res) => {
    try {
      return handleResponse<T>(res);
    } catch (error) {
      if (error.statusCode === 401) {
        return renewAndRetry<T>(request);
      } else {
        throw error;
      }
    }
  });
};

function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new HttpError(response.statusText, response.status);
  }

  // Handle no response bodies.
  if (!response.headers.get('content-length')) {
    return {} as Promise<T>;
  }

  return response.json() as Promise<T>;
}

const renewAndRetry = async <T>(request: Request): Promise<T> => {
  const { refreshToken } = getTokens();
  try {
    const tokens = await renewToken(refreshToken);
    setTokens(tokens.accessToken, tokens.refreshToken);
    request.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    return fetch(request).then((res) => handleResponse<T>(res));
  } catch (error) {
    throw error;
  }
};

/* Endpoints */

export const registerMember = (partialMember: PartialMember) =>
  post<string>('member/', partialMember);

export const authenticate = (email: string, password: string) =>
  post<TokenPair>('auth/login', { email, password });

export const renewToken = (refreshToken: string): Promise<TokenPair> =>
  post<TokenPair>('auth/renew', { refreshToken: refreshToken });

export const getMemberAssociatedWithToken = (): Promise<Member> =>
  get<Member>('member/', true);

export const authLogout = (refreshToken: string) =>
  post<{}>('auth/logout', { refreshToken: refreshToken });

export const updateMember = (memberUpdate: MemberUpdate) =>
  put<MemberUpdate>('member/', memberUpdate, true);

export const activateUser = () => post<{}>('member/activate', {}, true);

export const changePassword = (passwordPayload: ChangePasswordPayload) =>
  post<ChangePasswordPayload>('auth/password', passwordPayload, true);

export const createEvent = (event: Event): Promise<{ id : string}> =>
  post<{ id : string}>('event/', event, true);
