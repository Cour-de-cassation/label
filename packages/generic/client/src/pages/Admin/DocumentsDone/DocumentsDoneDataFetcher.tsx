import React, { ReactElement } from 'react';
import { documentType } from '@label/core';
import { useGraphQLQuery } from '../../../graphQL';
import { DataFetcher } from '../../DataFetcher';

export { DocumentsDoneDataFetcher };

type documentsDoneGraphQLType = {
  documents: documentType[];
};

function DocumentsDoneDataFetcher(props: { children: (fetched: { documentsDone: documentType[] }) => ReactElement }) {
  const documentsDoneFetchInfo = useGraphQLQuery<'documents'>('documents');
  const documentsDoneDataAdapter = ([data]: [documentsDoneGraphQLType]) => [data.documents];

  return (
    <DataFetcher
      buildComponentWithData={([documentsDone]) => props.children({ documentsDone })}
      fetchInfos={[documentsDoneFetchInfo]}
      dataAdapter={documentsDoneDataAdapter}
    />
  );
}
