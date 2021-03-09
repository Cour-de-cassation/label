import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { AnnotationsDataFetcher };

function AnnotationsDataFetcher(props: {
  children: (fetched: { annotations: apiRouteOutType<'get', 'annotations'> }) => ReactElement;
  documentId: string;
}) {
  const annotationsFetchInfo = useApi(buildFetchAnnotations(props.documentId));

  return (
    <DataFetcher
      buildComponentWithData={(annotations: apiRouteOutType<'get', 'annotations'>) => props.children({ annotations })}
      fetchInfo={annotationsFetchInfo}
    />
  );
}

function buildFetchAnnotations(documentId: string) {
  return async () => {
    const { data: annotations, statusCode } = await apiCaller.get<'annotations'>('annotations', { documentId });
    return {
      data: annotations,
      statusCode,
    };
  };
}
