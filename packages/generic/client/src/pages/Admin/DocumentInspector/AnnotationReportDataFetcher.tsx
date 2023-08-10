import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { AnnotationReportDataFetcher };

function AnnotationReportDataFetcher(props: {
  children: (fetched: { annotationReport: apiRouteOutType<'get', 'annotationReport'> }) => ReactElement;
  documentId: string;
}) {
  const annotationReportFetchInfo = useApi(buildFetchAnnotationReport(), { documentId: props.documentId });

  return (
    <DataFetcher
      buildComponentWithData={(annotationReport: apiRouteOutType<'get', 'annotationReport'>) => props.children({ annotationReport })}
      fetchInfo={annotationReportFetchInfo}
    />
  );
}

function buildFetchAnnotationReport() {
  return async ({ documentId }: { documentId: string }) => {
    const { data: annotationReport, statusCode } = await apiCaller.get<'annotationReport'>('annotationReport', { documentId });
    return {
      data: annotationReport,
      statusCode,
    };
  };
}
