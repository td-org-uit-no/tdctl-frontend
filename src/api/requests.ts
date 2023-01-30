import { baseUrl } from 'constants/apiConstants';
import { setTokens, getTokens } from 'utils/auth';
import { renewToken } from './auth';

/* Http error */
export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const get = async <T>(
  url: string,
  auth = false,
  content_type = 'application/json'
) => {
  const request = new Request(baseUrl + url, {
    headers: {
      accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (auth) {
    return authFetch<T>(request);
  }
  console.log(request);
  return fetch(request).then((res) => handleResponse<T>(res));
};

//Put and post are basicly equal :/
//could be moved into same function(PostOrPut) however its not pretty

export const post = async <T>(
  url: string,
  data: any,
  auth = false,
  content_type = 'application/json'
) => {
  const request = new Request(baseUrl + url, {
    ...(content_type === 'application/json' && {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    }),
    method: 'POST',
    ...(content_type === 'multipart/form-data' && { body: data }),
  });

  if (auth) {
    return authFetch<T>(request);
  }
  return fetch(request).then((res) => handleResponse<T>(res));
};

export const put = async <T>(url: string, data: any, auth = false) => {
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

export const Delete = async <T>(url: string, auth = false) => {
  const request = new Request(baseUrl + url, {
    method: 'DELETE',
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
  // Handle empty responses and missing content-lenght header when the response is encoded
  if (
    response.headers.get('content-length') === '0' &&
    response.headers.get('content-encoding') === null
  ) {
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
