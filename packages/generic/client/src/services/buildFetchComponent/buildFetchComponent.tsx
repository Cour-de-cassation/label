import { ReactElement } from 'react';
import { errorHandlers } from '@label/core';

export { buildFetchComponent };

function buildFetchComponent<fetchedType, dataType>({
  buildComponentWithData,
  dataAdapter,
  errorPage,
  fetchInfo: { data, isLoaded, statusCode },
  loadingPage,
  loginRedirect,
}: {
  buildComponentWithData: (returnedData: dataType) => ReactElement;
  dataAdapter: (fetchedData: fetchedType) => dataType;
  errorPage: ReactElement;
  fetchInfo: { data?: fetchedType; isLoaded: boolean; statusCode?: number };
  loadingPage: ReactElement;
  loginRedirect: ReactElement;
}) {
  console.log('fetchInfo', { data, isLoaded, statusCode });
  if (!isLoaded) {
    return loadingPage;
  }

  if (statusCode) {
    if (isSuccessStatus(statusCode) && data) {
      const adaptedData = dataAdapter(data);
      return buildComponentWithData(adaptedData);
    } else if (errorHandlers.authenticationErrorHandler.check(statusCode)) {
      return loginRedirect;
    } else {
      return errorPage;
    }
  }

  return errorPage;
}

function isSuccessStatus(statusCode: number) {
  return statusCode === 200 || statusCode === 201;
}
