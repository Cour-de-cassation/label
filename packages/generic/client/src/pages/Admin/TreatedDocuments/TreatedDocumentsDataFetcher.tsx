import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { TreatedDocumentsDataFetcher };

function TreatedDocumentsDataFetcher(props: {
  children: (fetched: {
    treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>;
    refetch: () => void;
    isLoading: boolean;
  }) => ReactElement;
}) {
  const treatedDocumentsFetchInfo = useApi(buildFetchTreatedDocuments(), {});

  return (
    <DataFetcher
      buildComponentWithData={(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) =>
        props.children({
          treatedDocuments,
          refetch: treatedDocumentsFetchInfo.refetch,
          isLoading: !treatedDocumentsFetchInfo.isLoaded,
        })
      }
      fetchInfo={treatedDocumentsFetchInfo}
      route={'treatedDocuments'}
    />
  );
}

function buildFetchTreatedDocuments() {
  return async () => {
    const { data: treatedDocuments, statusCode } = await apiCaller.get<'treatedDocuments'>('treatedDocuments');

    return {
      data: treatedDocuments.map((treatedDocument) => ({
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
