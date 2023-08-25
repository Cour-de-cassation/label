import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../../api';
import { DataFetcher } from '../../../DataFetcher';

export { AnnotationsDiffDetailsDataFetcher };

function AnnotationsDiffDetailsDataFetcher(props: {
  children: (fetched: { annotationsDiffDetails: apiRouteOutType<'get', 'annotationsDiffDetails'> }) => ReactElement;
  documentId: string;
}) {
  const annotationsDiffDetailsFetchInfo = useApi(buildFetchAnnotations(), { documentId: props.documentId });

  return (
    <DataFetcher
      buildComponentWithData={(annotationsDiffDetails: apiRouteOutType<'get', 'annotationsDiffDetails'>) =>
        props.children({ annotationsDiffDetails })
      }
      fetchInfo={annotationsDiffDetailsFetchInfo}
      route={'annotationsDiffDetails'}
    />
  );
}

function buildFetchAnnotations() {
  return async ({ documentId }: { documentId: string }) =>
    apiCaller.get<'annotationsDiffDetails'>('annotationsDiffDetails', { documentId });
}
