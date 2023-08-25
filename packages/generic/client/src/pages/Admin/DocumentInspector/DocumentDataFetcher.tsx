import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { DocumentDataFetcher };

function DocumentDataFetcher(props: {
  children: (fetched: { document: apiRouteOutType<'get', 'document'> }) => ReactElement;
  documentId: string;
}) {
  const documentFetchInfo = useApi(buildFetchDocument(), { documentId: props.documentId });

  return (
    <DataFetcher
      buildComponentWithData={(document: apiRouteOutType<'get', 'document'>) => props.children({ document })}
      fetchInfo={documentFetchInfo}
      route={'document'}
    />
  );
}

function buildFetchDocument() {
  return async ({ documentId }: { documentId: string }) => {
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
