import React, { ReactElement } from 'react';
import { apiRouteOutType } from '@label/core';
import { apiCaller, useApi } from '../../../api';
import { DataFetcher } from '../../DataFetcher';

export { MandatoryReplacementTermsDataFetcher };

function MandatoryReplacementTermsDataFetcher(props: {
  children: (fetched: {
    mandatoryReplacementTerms: apiRouteOutType<'get', 'mandatoryReplacementTerms'>;
  }) => ReactElement;
  documentId: string;
}) {
  const mandatoryReplacementTermsFetchInfo = useApi(buildFetchMandatoryReplacementTerms(), {
    documentId: props.documentId,
  });
  return (
    <DataFetcher
      buildComponentWithData={(mandatoryReplacementTerms: apiRouteOutType<'get', 'mandatoryReplacementTerms'>) =>
        props.children({ mandatoryReplacementTerms })
      }
      fetchInfo={mandatoryReplacementTermsFetchInfo}
      route={'mandatoryReplacementTerms'}
    />
  );
}

function buildFetchMandatoryReplacementTerms() {
  return async ({ documentId }: { documentId: string }) => {
    const { data: mandatoryReplacementTerms, statusCode } = await apiCaller.get<'mandatoryReplacementTerms'>(
      'mandatoryReplacementTerms',
      { documentId },
    );
    return {
      data: mandatoryReplacementTerms,
      statusCode,
    };
  };
}
