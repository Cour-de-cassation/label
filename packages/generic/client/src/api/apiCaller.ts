import { apiSchema, apiRouteInType, apiRouteOutType, environment, networkType } from '@label/core';
import { localStorage } from '../services/localStorage';

export { apiCaller };

const DEFAULT_HEADER = { 'Content-Type': 'application/json' };

const apiCaller = {
  async get<routeNameT extends keyof typeof apiSchema.get>(
    routeName: routeNameT,
    args?: apiRouteInType<'get', routeNameT>,
  ): Promise<{
    data: networkType<apiRouteOutType<'get', routeNameT>>;
    statusCode: number;
  }> {
    const bearerToken = localStorage.bearerTokenHandler.get();

    const response = await fetch(buildUrlWithParams(`${environment.url.server}/api/${routeName}`, args), {
      cache: 'default',
      headers: bearerToken ? { ...DEFAULT_HEADER, authorization: `Bearer ${bearerToken}` } : DEFAULT_HEADER,
      method: 'get',
      mode: 'cors',
    });

    return {
      data: (await computeDataFromResponse(response)) as networkType<apiRouteOutType<'get', routeNameT>>,
      statusCode: response.status,
    };
  },

  async post<routeNameT extends keyof typeof apiSchema.post>(
    routeName: routeNameT,
    args?: apiRouteInType<'post', routeNameT>,
  ): Promise<{
    data: networkType<apiRouteOutType<'post', routeNameT>>;
    statusCode: number;
  }> {
    const bearerToken = localStorage.bearerTokenHandler.get();

    const response = await fetch(`${environment.url.server}/api/${routeName}`, {
      body: JSON.stringify(args),
      cache: 'default',
      headers: bearerToken ? { ...DEFAULT_HEADER, authorization: `Bearer ${bearerToken}` } : DEFAULT_HEADER,
      method: 'post',
      mode: 'cors',
    });

    return {
      data: (await computeDataFromResponse(response)) as networkType<apiRouteOutType<'post', routeNameT>>,
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
