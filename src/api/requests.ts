import { baseUrl } from 'constants/apiConstants';
import { renewToken } from './auth';

/* Http error */
export class HttpError extends Error {
  statusCode: number;
  text: Promise<string>;
  constructor(message: string, statusCode: number, text: Promise<string>) {
    super(message);
    this.statusCode = statusCode;
    this.text = text;
  }

  public getText = async () => {
    try {
      let res = await this.text;
      const reason = JSON.parse(res);
      return reason.detail;
    } catch (error) {
      return '';
    }
  };
}

export const get = async <T>(url: string) => {
  const request = new Request(baseUrl + url, {
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
  });
  return authFetch<T>(request);
};

//Put and post are basicly equal :/
//could be moved into same function(PostOrPut) however its not pretty

export const post = async <T>(
  url: string,
  data: any,
  content_type = 'application/json'
) => {
  const request = new Request(baseUrl + url, {
    ...(content_type === 'application/json' && {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    }),
    method: 'POST',
    ...(content_type === 'multipart/form-data' && { body: data }),
  });

  return authFetch<T>(request);
};

export const put = async <T>(url: string, data: any) => {
  const request = new Request(baseUrl + url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'include',
  });
  return authFetch<T>(request);
};

export const Delete = async <T>(url: string) => {
  const request = new Request(baseUrl + url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  });
  return authFetch<T>(request);
};

const authFetch = async <T>(request: Request) => {
  return fetch(request)
    .then((res) => {
      try {
        return handleResponse<T>(res);
      } catch (error) {
        if (error.statusCode === 401) {
          return renewAndRetry<T>(request);
        } else {
          throw error;
        }
      }
    })
    .catch((error) => {
      if (error.statusCode === 401) {
        return renewAndRetry<T>(request);
      } else {
        throw error;
      }
    });
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new HttpError(response.statusText, response.status, response.text());
  }
  // Handle empty responses and missing content-lenght header when the response is encoded
  if (
    response.headers.get('content-length') === '0' &&
    response.headers.get('content-encoding') === null
  ) {
    return {} as Promise<T>;
  }

  // Response into json might fail, so return empty in that case
  try {
    return (await response.json()) as Promise<T>;
  } catch {
    return {} as Promise<T>;
  }
}

const renewAndRetry = async <T>(request: Request): Promise<T> => {
  try {
    await renewToken();
    return fetch(request).then((res) => handleResponse<T>(res));
  } catch (error) {
    throw error;
  }
};
