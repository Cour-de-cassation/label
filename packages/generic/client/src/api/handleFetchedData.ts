import { errorHandlers, httpStatusCodeHandler } from '@label/core';

export { handleFetchedData };

type dataFetchStatus<dataT> =
  | { kind: 'loading' }
  | { kind: 'error'; error: 'authentication' | 'unknown' }
  | { kind: 'data'; data: dataT };

function handleFetchedData<dataT>(
  fetchInfo: { isLoaded: boolean; statusCode?: number; data?: dataT },
  showLoadingOnRefetch?: boolean,
): dataFetchStatus<dataT> {
  if (!fetchInfo.isLoaded && (showLoadingOnRefetch || !fetchInfo.data)) {
    return { kind: 'loading' };
  }

  if (fetchInfo.statusCode) {
    if (httpStatusCodeHandler.isSuccess(fetchInfo.statusCode) && fetchInfo.data) {
      return { kind: 'data', data: fetchInfo.data };
    } else if (errorHandlers.authenticationErrorHandler.check(fetchInfo.statusCode)) {
      return { kind: 'error', error: 'authentication' };
    } else {
      return { kind: 'error', error: 'unknown' };
    }
  }

  if (fetchInfo.data) {
    return { kind: 'data', data: fetchInfo.data };
  }

  return { kind: 'error', error: 'unknown' };
}
