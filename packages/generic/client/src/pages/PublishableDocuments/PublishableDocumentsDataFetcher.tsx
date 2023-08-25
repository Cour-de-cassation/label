import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { PublishableDocumentsDataFetcher };

function PublishableDocumentsDataFetcher(props: {
  children: (fetched: {
    publishableDocuments: apiRouteOutType<'get', 'publishableDocuments'>;
    refetch: () => void;
  }) => ReactElement;
}) {
  const publishableDocumentsFetchInfo = useApi(buildFetchPublishableDocuments(), {});

  return (
    <DataFetcher
      buildComponentWithData={(publishableDocuments: apiRouteOutType<'get', 'publishableDocuments'>) =>
        props.children({ publishableDocuments, refetch: publishableDocumentsFetchInfo.refetch })
      }
      fetchInfo={publishableDocumentsFetchInfo}
      route={'publishableDocuments'}
    />
  );
}

function buildFetchPublishableDocuments() {
  return async () => {
    const { data: publishableDocuments, statusCode } = await apiCaller.get<'publishableDocuments'>(
      'publishableDocuments',
    );

    return {
      data: publishableDocuments.map((publishableDocument) => ({
        ...publishableDocument,
        _id: idModule.lib.buildId(publishableDocument._id),
      })),
      statusCode,
    };
  };
}
