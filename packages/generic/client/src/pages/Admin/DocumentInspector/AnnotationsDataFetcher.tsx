import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { AnnotationsDataFetcher };

function AnnotationsDataFetcher(props: {
  children: (fetched: { annotations: apiRouteOutType<'get', 'annotations'> }) => ReactElement;
  documentId: string;
}) {
  const annotationsFetchInfo = useApi(buildFetchAnnotations(), { documentId: props.documentId });

  return (
    <DataFetcher
      buildComponentWithData={(annotations: apiRouteOutType<'get', 'annotations'>) => props.children({ annotations })}
      fetchInfo={annotationsFetchInfo}
      route={'annotations'}
    />
  );
}

function buildFetchAnnotations() {
  return async ({ documentId }: { documentId: string }) => {
    const { data: annotations, statusCode } = await apiCaller.get<'annotations'>('annotations', { documentId });
    return {
      data: annotations,
      statusCode,
    };
  };
}
