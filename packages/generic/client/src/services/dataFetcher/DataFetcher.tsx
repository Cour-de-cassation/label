import React, { ReactElement } from 'react';
import { ApolloError } from '@apollo/client';

export { DataFetcher };

function DataFetcher<fetchedType, dataType>(props: {
  children: (returnedData: dataType) => ReactElement;
  fetchInfos: Array<{ loading: boolean; error?: ApolloError; data: unknown }>;
  dataAdapter: (fetchedData: fetchedType) => dataType;
}) {
  const { loading, failure, fetchedData } = computeFetchStatus(props.fetchInfos);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (failure) {
    return <div>Une erreur est survenue</div>;
  }

  const data = props.dataAdapter(fetchedData);

  return props.children(data);

  function computeFetchStatus(fetchInfos: Array<{ loading: boolean; error?: ApolloError; data: unknown }>) {
    const loading = isLoading(fetchInfos);
    const error = isError(fetchInfos);
    const { fetchedData, dataMissing } = computeData(fetchInfos);

    return { loading, failure: error || dataMissing, fetchedData };
  }

  function isLoading(fetchInfos: Array<{ loading: boolean }>): boolean {
    return fetchInfos.reduce((loading: boolean, fetchInfo) => loading || fetchInfo.loading, false);
  }

  function isError(fetchInfos: Array<{ error?: ApolloError }>): boolean {
    return fetchInfos.reduce((error: boolean, fetchInfo) => error || !!fetchInfo.error, false);
  }

  function computeData(fetchInfos: Array<{ data: unknown }>): { fetchedData: fetchedType; dataMissing: boolean } {
    const fetchedData = fetchInfos.reduce(
      (fetchedData, fetchInfo) => (fetchInfo.data !== undefined ? [...fetchedData, fetchInfo.data] : fetchedData),
      [] as unknown[],
    );
    const dataMissing = fetchedData.length !== fetchInfos.length;

    return { fetchedData: (fetchedData as unknown) as fetchedType, dataMissing };
  }
}
