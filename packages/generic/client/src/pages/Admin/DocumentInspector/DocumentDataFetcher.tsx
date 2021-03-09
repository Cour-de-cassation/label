import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { DocumentDataFetcher };

function DocumentDataFetcher(props: {
  children: (fetched: { document: apiRouteOutType<'get', 'document'> }) => ReactElement;
  documentId: string;
}) {
  const documentFetchInfo = useApi(buildFetchDocument(props.documentId));

  return (
    <DataFetcher
      buildComponentWithData={(document: apiRouteOutType<'get', 'document'>) => props.children({ document })}
      fetchInfo={documentFetchInfo}
    />
  );
}

function buildFetchDocument(documentId: string) {
  return async () => {
    const { data: document, statusCode } = await apiCaller.get<'document'>('document', { documentId });
    return {
      data: {
        ...document,
        _id: idModule.lib.buildId(document._id),
      },
      statusCode,
    };
  };
}
