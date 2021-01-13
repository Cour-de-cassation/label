import { apiSchema } from '@label/core';
import { environment } from '../config/environment';
import { localStorage } from '../services/localStorage';
import { apiArgsType, apiResultType } from './apiArgsType';

export { apiCaller };

const DEFAULT_HEADER = { 'Content-Type': 'application/json' };

const apiCaller = {
  async get<routeNameT extends keyof typeof apiSchema.get>(
    routeName: routeNameT,
    args?: apiArgsType<'get', routeNameT>,
  ): Promise<{
    data: apiResultType<'get', routeNameT>;
    statusCode: number;
  }> {
    const bearerToken = localStorage.bearerTokenHandler.get();

    const response = await fetch(buildUrlWithParams(`${environment.API_URL}/api/${routeName}`, args), {
      cache: 'default',
      headers: bearerToken ? { ...DEFAULT_HEADER, authorization: `Bearer ${bearerToken}` } : DEFAULT_HEADER,
      method: 'get',
      mode: 'cors',
    });

    return {
      data: (await computeDataFromResponse(response)) as apiResultType<'get', routeNameT>,
      statusCode: response.status,
    };
  },

  async post<routeNameT extends keyof typeof apiSchema.post>(
    routeName: routeNameT,
    args?: apiArgsType<'post', routeNameT>,
  ): Promise<{
    data: apiResultType<'post', routeNameT>;
    statusCode: number;
  }> {
    const bearerToken = localStorage.bearerTokenHandler.get();

    const response = await fetch(`${environment.API_URL}/api/${routeName}`, {
      body: JSON.stringify(args),
      cache: 'default',
      headers: bearerToken ? { ...DEFAULT_HEADER, authorization: `Bearer ${bearerToken}` } : DEFAULT_HEADER,
      method: 'post',
      mode: 'cors',
    });

    return {
      data: (await computeDataFromResponse(response)) as apiResultType<'post', routeNameT>,
      statusCode: response.status,
    };
  },
};

function buildUrlWithParams(url: string, params?: { [key: string]: any }) {
  const urlParameters = new URLSearchParams();

  if (params) {
    Object.entries(params).map(([key, value]) => urlParameters.append(key, JSON.stringify(value)));
    return `${url}?${urlParameters.toString()}`;
  } else {
    return url;
  }
}

async function computeDataFromResponse(response: Response): Promise<any> {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  try {
    const textData = await response.text();
    try {
      const data: any = JSON.parse(textData);
      return data;
    } catch (_) {
      return textData;
    }
  } catch (_) {
    return undefined;
  }
}
