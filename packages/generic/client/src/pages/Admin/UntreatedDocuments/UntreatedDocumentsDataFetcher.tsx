import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { UntreatedDocumentsDataFetcher };

function UntreatedDocumentsDataFetcher(props: {
  children: (fetched: {
    untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>;
    refetch: () => void;
    isLoading: boolean;
  }) => ReactElement;
}) {
  const untreatedDocumentsFetchInfo = useApi(buildFetchUntreatedDocuments(), {});

  return (
    <DataFetcher
      buildComponentWithData={(untreatedDocuments: apiRouteOutType<'get', 'untreatedDocuments'>) =>
        props.children({
          untreatedDocuments,
          refetch: untreatedDocumentsFetchInfo.refetch,
          isLoading: !untreatedDocumentsFetchInfo.isLoaded,
        })
      }
      fetchInfo={untreatedDocumentsFetchInfo}
      route={'untreatedDocuments'}
    />
  );
}

function buildFetchUntreatedDocuments() {
  return async () => {
    const { data: untreatedDocuments, statusCode } = await apiCaller.get<'untreatedDocuments'>('untreatedDocuments');

    return {
      data: untreatedDocuments.map((untreatedDocument) => ({
        ...untreatedDocument,
        document: {
          ...untreatedDocument.document,
          _id: idModule.lib.buildId(untreatedDocument.document._id),
        },
      })),
      statusCode,
    };
  };
}
