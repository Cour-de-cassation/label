import React, { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { documentType, annotationType } from '@label/core';
import { DataFetcher } from '../../../services/dataFetcher';
import {
  annotationsGraphQLType,
  ANNOTATIONS_GRAPHQL_QUERY,
  documentGraphQLType,
  DOCUMENTS_GRAPHQL_QUERY,
} from '../DocumentAnnotator/graphql';

export { DocumentAndAnnotationsDataFetcher };

function DocumentAndAnnotationsDataFetcher(props: {
  children: (fetched: { document: documentType; annotations: annotationType[] }) => ReactElement;
}) {
  const documentsFetchInfo = useQuery<documentGraphQLType>(DOCUMENTS_GRAPHQL_QUERY);
  const annotationsFetchInfo = useQuery<annotationsGraphQLType>(ANNOTATIONS_GRAPHQL_QUERY, {
    skip: !documentsFetchInfo.data?.documents[0]?._id,
    variables: { documentId: documentsFetchInfo.data?.documents[0]?._id },
  });

  const documentAndAnnotationsDataAdapter = ([documentsData, annotationsData]: [
    documentGraphQLType,
    annotationsGraphQLType,
  ]) => [documentsData.documents[0], annotationsData.annotations] as [documentType, annotationType[]];

  return (
    <DataFetcher<[documentGraphQLType, annotationsGraphQLType], [documentType, annotationType[]]>
      fetchInfos={[documentsFetchInfo, annotationsFetchInfo]}
      dataAdapter={documentAndAnnotationsDataAdapter}
    >
      {([document, annotations]) => props.children({ document, annotations })}
    </DataFetcher>
  );
}
