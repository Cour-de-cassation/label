import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { TreatedDocumentsDataFetcher };

function TreatedDocumentsDataFetcher(props: {
  children: (fetched: { treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'> }) => ReactElement;
}) {
  const treatedDocumentsFetchInfo = useApi(buildFetchTreatedDocuments(), {});

  return (
    <DataFetcher
      buildComponentWithData={(treatedDocuments: apiRouteOutType<'get', 'treatedDocuments'>) =>
        props.children({ treatedDocuments })
      }
      fetchInfo={treatedDocumentsFetchInfo}
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
        treatments: treatedDocument.treatments.map((treatment) => ({
          ...treatment,
          _id: idModule.lib.buildId(treatment._id),
          documentId: idModule.lib.buildId(treatment.documentId),
        })),
      })),
      statusCode,
    };
  };
}
