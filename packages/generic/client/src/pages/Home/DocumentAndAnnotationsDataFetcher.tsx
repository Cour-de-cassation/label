import React, { ReactElement } from 'react';
import {
  autoLinker,
  fetchedAnnotationType,
  fetchedDocumentType,
  idModule,
  idType,
  graphQLReceivedDataType,
} from '@label/core';
import { useGraphQLQuery } from '../../graphQL';
import { DataFetcher } from '../DataFetcher';

export { DocumentAndAnnotationsDataFetcher };

type annotationsGraphQLType = {
  annotations: Array<graphQLReceivedDataType<fetchedAnnotationType>>;
};

type documentGraphQLType = {
  document: graphQLReceivedDataType<fetchedDocumentType>;
};

function DocumentAndAnnotationsDataFetcher(props: {
  children: (fetched: {
    document: fetchedDocumentType;
    annotations: fetchedAnnotationType[];
    fetchNewDocument: () => Promise<void>;
  }) => ReactElement;
  documentIdsToExclude?: idType[];
}) {
  const documentsFetchInfo = useGraphQLQuery<'document'>('document', {
    args: { documentIdsToExclude: props.documentIdsToExclude || [] },
  });
  const annotationsFetchInfo = useGraphQLQuery<'annotations'>('annotations', {
    args: { documentId: documentsFetchInfo.data?.document._id },
    skip: !documentsFetchInfo.data?.document,
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

    return [document, autoLinker.autoLinkAll(annotations)] as [fetchedDocumentType, fetchedAnnotationType[]];
  };

  return (
    <DataFetcher
      buildComponentWithData={([document, annotations]) => props.children({ document, annotations, fetchNewDocument })}
      fetchInfos={[documentsFetchInfo, annotationsFetchInfo]}
      dataAdapter={documentAndAnnotationsDataAdapter}
    />
  );

  async function fetchNewDocument() {
    await documentsFetchInfo.refetch();
    await annotationsFetchInfo.refetch();
  }
}
