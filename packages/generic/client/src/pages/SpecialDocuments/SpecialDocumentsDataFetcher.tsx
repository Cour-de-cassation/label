import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { SpecialDocumentsDataFetcher };

function SpecialDocumentsDataFetcher(props: {
  children: (fetched: {
    specialDocuments: apiRouteOutType<'get', 'specialDocuments'>;
    refetch: () => void;
  }) => ReactElement;
}) {
  const specialDocumentsFetchInfo = useApi(buildFetchSpecialDocuments(), {});

  return (
    <DataFetcher
      buildComponentWithData={(specialDocuments: apiRouteOutType<'get', 'specialDocuments'>) =>
        props.children({ specialDocuments, refetch: specialDocumentsFetchInfo.refetch })
      }
      fetchInfo={specialDocumentsFetchInfo}
    />
  );
}

function buildFetchSpecialDocuments() {
  return async () => {
    const { data: specialDocuments, statusCode } = await apiCaller.get<'specialDocuments'>('specialDocuments');

    return {
      data: specialDocuments.map((specialDocument) => ({
        ...specialDocument,
        _id: idModule.lib.buildId(specialDocument._id),
      })),
      statusCode,
    };
  };
}
