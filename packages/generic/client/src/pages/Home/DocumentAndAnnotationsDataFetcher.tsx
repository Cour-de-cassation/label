import React, { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { fetchedAnnotationType, fetchedDocumentType, idModule, graphQLReceivedDataType } from '@label/core';
import { DataFetcher } from '../../services/dataFetcher';
import { graphQLClientBuilder } from '../../graphQL';

export { DocumentAndAnnotationsDataFetcher };

type annotationsGraphQLType = {
  annotations: Array<graphQLReceivedDataType<fetchedAnnotationType>>;
};

type documentGraphQLType = {
  document: graphQLReceivedDataType<fetchedDocumentType>;
};

function DocumentAndAnnotationsDataFetcher(props: {
  children: (fetched: { document: fetchedDocumentType; annotations: fetchedAnnotationType[] }) => ReactElement;
}) {
  const documentsFetchInfo = useQuery<documentGraphQLType>(graphQLClientBuilder.buildQuery('document'));
  const annotationsFetchInfo = useQuery<annotationsGraphQLType>(graphQLClientBuilder.buildQuery('annotations'), {
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
