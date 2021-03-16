import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { UntreatedDocumentsDataFetcher };

function UntreatedDocumentsDataFetcher(props: {
  children: (fetched: { untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'> }) => ReactElement;
}) {
  const untreatedDocumentsFetchInfo = useApi(buildFetchUntreatedDocuments());

  return (
    <DataFetcher
      buildComponentWithData={(untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>) =>
        props.children({ untreatedDocuments })
      }
      fetchInfo={untreatedDocumentsFetchInfo}
    />
  );
}

function buildFetchUntreatedDocuments() {
  return async () => {
    const { data: untreatedDocuments, statusCode } = await apiCaller.get<'untreatedDocuments'>('untreatedDocuments');

    return {
      data: untreatedDocuments.map((untreatedDocument) => ({
        ...untreatedDocument,
        _id: idModule.lib.buildId(untreatedDocument._id),
      })),
      statusCode,
    };
  };
}
