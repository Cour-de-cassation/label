import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { ChecklistDataFetcher };

function ChecklistDataFetcher(props: {
  children: (fetched: { checklist: apiRouteOutType<'get', 'checklist'> }) => ReactElement;
  documentId: string;
}) {
  const checklistFetchInfo = useApi(buildFetchChecklist(), { documentId: props.documentId });

  return (
    <DataFetcher
      buildComponentWithData={(checklist: apiRouteOutType<'get', 'checklist'>) => props.children({ checklist })}
      fetchInfo={checklistFetchInfo}
    />
  );
}

function buildFetchChecklist() {
  return async ({ documentId }: { documentId: string }) => {
    const { data: checklist, statusCode } = await apiCaller.get<'checklist'>('checklist', { documentId });
    return {
      data: checklist,
      statusCode,
    };
  };
}
