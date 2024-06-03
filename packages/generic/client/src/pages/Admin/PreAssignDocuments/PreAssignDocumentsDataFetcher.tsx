import React, { ReactElement } from 'react';
import { apiRouteOutType, idModule } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { PreAssignDocumentsDataFetcher };

function PreAssignDocumentsDataFetcher(props: {
  children: (fetched: {
    preAssignations: apiRouteOutType<'get', 'preAssignations'>;
    refetch: () => void;
    isLoading: boolean;
  }) => ReactElement;
}) {
  const preAssignationsFetchInfo = useApi(buildFetchPreAssignations(), {});

  return (
    <DataFetcher
      buildComponentWithData={(preAssignations: apiRouteOutType<'get', 'preAssignations'>) =>
        props.children({
          preAssignations,
          refetch: () => preAssignationsFetchInfo.refetch({}),
          isLoading: !preAssignationsFetchInfo.isLoaded,
        })
      }
      fetchInfo={preAssignationsFetchInfo}
      route={'preAssignations'}
    />
  );
}

function buildFetchPreAssignations() {
  return async () => {
    const { data: preAssignations, statusCode } = await apiCaller.get<'preAssignations'>('preAssignations');
    return {
      data: preAssignations.map((preAssignation) => ({
        preAssignation: {
          ...preAssignation.preAssignation,
          _id: idModule.lib.buildId(preAssignation.preAssignation._id),
          userId: idModule.lib.buildId(preAssignation.preAssignation.userId),
        },
        userName: preAssignation.userName,
      })),
      statusCode,
    };
  };
}
