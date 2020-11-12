import { ReactElement } from 'react';
import { ApolloError } from '@apollo/client';

export { buildFetchComponent };

function buildFetchComponent<fetchedType, dataType>({
  buildComponentWithData,
  dataAdapter,
  errorPage,
  fetchInfos,
  loadingPage,
}: {
  buildComponentWithData: (returnedData: dataType) => ReactElement;
  dataAdapter: (fetchedData: fetchedType) => dataType;
  errorPage: ReactElement;
  fetchInfos: Array<{ loading: boolean; error?: ApolloError; data: unknown }>;
  loadingPage: ReactElement;
}) {
  const { loading, failure, fetchedData } = computeFetchStatus();

  if (loading) {
    return loadingPage;
  }

  if (failure) {
    return errorPage;
  }

  const data = dataAdapter(fetchedData);

  return buildComponentWithData(data);

  function computeFetchStatus() {
    const loading = isLoading();
    const error = isError();
    const { fetchedData, dataMissing } = computeData();

    return { loading, failure: error || dataMissing, fetchedData };
  }

  function isLoading(): boolean {
    return fetchInfos.reduce((loading: boolean, fetchInfo) => loading || fetchInfo.loading, false);
  }

  function isError(): boolean {
    return fetchInfos.reduce((error: boolean, fetchInfo) => error || !!fetchInfo.error, false);
  }

  function computeData(): { fetchedData: fetchedType; dataMissing: boolean } {
    const fetchedData = fetchInfos.reduce(
      (fetchedData, fetchInfo) => (fetchInfo.data !== undefined ? [...fetchedData, fetchInfo.data] : fetchedData),
      [] as unknown[],
    );
    const dataMissing = fetchedData.length !== fetchInfos.length;

    return { fetchedData: (fetchedData as unknown) as fetchedType, dataMissing };
  }
}
