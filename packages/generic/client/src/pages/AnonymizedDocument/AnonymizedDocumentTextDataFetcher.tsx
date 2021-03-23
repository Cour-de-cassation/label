import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { AnonymizedDocumentTextDataFetcher };

function AnonymizedDocumentTextDataFetcher(props: {
  children: (fetched: { anonymizedDocumentText: apiRouteOutType<'get', 'anonymizedDocumentText'> }) => ReactElement;
  documentId: string;
}) {
  const anonymizedDocumentTextFetchInfo = useApi(buildFetchDocument(props.documentId));

  return (
    <DataFetcher
      buildComponentWithData={(anonymizedDocumentText: apiRouteOutType<'get', 'anonymizedDocumentText'>) =>
        props.children({ anonymizedDocumentText })
      }
      fetchInfo={anonymizedDocumentTextFetchInfo}
    />
  );
}

function buildFetchDocument(documentId: string) {
  return async () => {
    const { data: anonymizedDocumentText, statusCode } = await apiCaller.get<'anonymizedDocumentText'>(
      'anonymizedDocumentText',
      { documentId },
    );
    return {
      data: anonymizedDocumentText,
      statusCode,
    };
  };
}
