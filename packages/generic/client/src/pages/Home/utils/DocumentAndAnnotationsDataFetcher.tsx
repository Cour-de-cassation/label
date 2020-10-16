import React, { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { idModule } from '@label/core';
import { DataFetcher } from '../../../services/dataFetcher';
import { fetchedAnnotationType, fetchedDocumentType } from '../../../types';
import {
  annotationsGraphQLType,
  ANNOTATIONS_GRAPHQL_QUERY,
  documentGraphQLType,
  DOCUMENT_GRAPHQL_QUERY,
} from '../DocumentAnnotator/graphql';

export { DocumentAndAnnotationsDataFetcher };

function DocumentAndAnnotationsDataFetcher(props: {
  children: (fetched: { document: fetchedDocumentType; annotations: fetchedAnnotationType[] }) => ReactElement;
}) {
  const documentsFetchInfo = useQuery<documentGraphQLType>(DOCUMENT_GRAPHQL_QUERY);
  const annotationsFetchInfo = useQuery<annotationsGraphQLType>(ANNOTATIONS_GRAPHQL_QUERY, {
    skip: !documentsFetchInfo.data?.document,
    variables: { documentId: documentsFetchInfo.data?.document._id },
  });

  const documentAndAnnotationsDataAdapter = ([{ document: fetchedDocument }, { annotations: fetchedAnnotations }]: [
    documentGraphQLType,
    annotationsGraphQLType,
  ]) => {
    const document = {
      ...fetchedDocument,
      _id: idModule.lib.buildId(fetchedDocument._id),
    };
    const annotations = fetchedAnnotations.map((annotation) => ({
      ...annotation,
      _id: idModule.lib.buildId(annotation._id),
    }));

    return [document, annotations] as [fetchedDocumentType, fetchedAnnotationType[]];
  };

  return (
    <DataFetcher<[documentGraphQLType, annotationsGraphQLType], [fetchedDocumentType, fetchedAnnotationType[]]>
      fetchInfos={[documentsFetchInfo, annotationsFetchInfo]}
      dataAdapter={documentAndAnnotationsDataAdapter}
    >
      {([document, annotations]) => props.children({ document, annotations })}
    </DataFetcher>
  );
}
