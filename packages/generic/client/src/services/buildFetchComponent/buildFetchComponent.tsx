import { ReactElement } from 'react';
import { ApolloError } from '@apollo/client';

export { buildFetchComponent };

function buildFetchComponent<fetchedType, dataType>({
  buildComponentWithData,
  dataAdapter,
  errorPage,
  fetchInfos,
  loadingPage,
  loginRedirect,
}: {
  buildComponentWithData: (returnedData: dataType) => ReactElement;
  dataAdapter: (fetchedData: fetchedType) => dataType;
  errorPage: ReactElement;
  fetchInfos: Array<{ loading: boolean; error?: ApolloError; data: unknown }>;
  loadingPage: ReactElement;
  loginRedirect: ReactElement;
}) {
  const { loading, errorCode, fetchedData } = computeFetchStatus();

  if (loading) {
    return loadingPage;
  }

  if (errorCode) {
    switch (errorCode) {
      case 'AUTHENTICATION_ERROR':
        return loginRedirect;
      default:
        return errorPage;
    }
  }

  const data = dataAdapter(fetchedData);

  return buildComponentWithData(data);

  function computeFetchStatus() {
    const loading = fetchInfos.some((fetchInfo) => fetchInfo.loading);

    const fetchedData = fetchInfos.reduce(
      (fetchedData, fetchInfo) => (fetchInfo.data !== undefined ? [...fetchedData, fetchInfo.data] : fetchedData),
      [] as unknown[],
    );
    if (loading) {
      return { loading, fetchedData: (fetchedData as unknown) as fetchedType, errorCode: undefined };
    }

    const errorCode = getErrorCode(fetchedData);

    return { loading, errorCode, fetchedData: (fetchedData as unknown) as fetchedType };
  }

  function getErrorCode(fetchedData: unknown[]): string | undefined {
    for (const fetchInfo of fetchInfos) {
      if (fetchInfo.error?.message === 'AUTHENTICATION_ERROR' || fetchInfo.error?.message === 'PERMISSION_ERROR') {
        return fetchInfo.error?.message;
      }
    }

    if (fetchedData.length !== fetchInfos.length) {
      return 'MISSING_DATA';
    }

    return undefined;
  }
}
