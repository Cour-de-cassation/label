import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ToBeConfirmedDocumentsDataFetcher };

function ToBeConfirmedDocumentsDataFetcher(props: {
  children: (fetched: {
    toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>;
    refetch: () => void;
    isLoading: boolean;
  }) => ReactElement;
}) {
  const toBeConfirmedDocumentsFetchInfo = useApi(buildFetchTreatedDocuments(), {});

  return (
    <DataFetcher
      buildComponentWithData={(toBeConfirmedDocuments: apiRouteOutType<'get', 'toBeConfirmedDocuments'>) =>
        props.children({
          toBeConfirmedDocuments,
          refetch: toBeConfirmedDocumentsFetchInfo.refetch,
          isLoading: !toBeConfirmedDocumentsFetchInfo.isLoaded,
        })
      }
      fetchInfo={toBeConfirmedDocumentsFetchInfo}
      route={'toBeConfirmedDocuments'}
    />
  );
}

function buildFetchTreatedDocuments() {
  return async () => {
    const { data: toBeConfirmedDocuments, statusCode } = await apiCaller.get<'toBeConfirmedDocuments'>(
      'toBeConfirmedDocuments',
    );

    return {
      data: toBeConfirmedDocuments.map((treatedDocument) => ({
        ...treatedDocument,
        document: {
          ...treatedDocument.document,
          _id: idModule.lib.buildId(treatedDocument.document._id),
        },
      })),
      statusCode,
    };
  };
}
