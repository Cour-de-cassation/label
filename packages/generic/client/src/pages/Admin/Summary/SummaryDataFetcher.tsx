import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { SummaryDataFetcher };

function SummaryDataFetcher(props: {
  children: (fetched: {
    summary: apiRouteOutType<'get', 'summary'>;
    refetch: () => void;
    isLoading: boolean;
  }) => ReactElement;
}) {
  const summaryFetchInfo = useApi(buildFetchSummary(), {});

  return (
    <DataFetcher
      buildComponentWithData={({ summary }) =>
        props.children({
          summary,
          refetch: summaryFetchInfo.refetch,
          isLoading: !summaryFetchInfo.isLoaded,
        })
      }
      fetchInfo={summaryFetchInfo}
    />
  );
}

function buildFetchSummary() {
  return async () => {
    let summary = {
      loadedDocuments: -1,
      nlpAnnotatingDocuments: -1,
      freeDocuments: -1,
      pendingDocuments: -1,
      savedDocuments: -1,
      doneDocuments: -1,
      lockedDocuments: -1,
      rejectedDocuments: -1,
    };
    let statusCodeSummary = 200;

    const { data: summaryFetch, statusCode: statusCodeSummaryFetch } = await apiCaller.get<'summary'>('summary');
    summary = summaryFetch;
    statusCodeSummary = statusCodeSummaryFetch;

    return {
      data: { summary },
      statusCode: statusCodeSummary,
    };
  };
}
