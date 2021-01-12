import React, { ReactElement } from 'react';
import { autoLinker, fetchedAnnotationType, fetchedDocumentType, idModule, idType } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { DocumentAndAnnotationsDataFetcher };

function DocumentAndAnnotationsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: {
    document: fetchedDocumentType;
    annotations: fetchedAnnotationType[];
    fetchNewDocument: () => Promise<void>;
  }) => ReactElement;
  documentIdsToExclude?: idType[];
}) {
  const documentAndAnnotationsFetchInfo = useApi(async () => {
    const { data: document, statusCode: statusCodeDocument } = await apiCaller.get<'document'>('document', {
      documentIdsToExclude: props.documentIdsToExclude || [],
    });
    const { data: annotations, statusCode: statusCodeAnnotations } = await apiCaller.get<'annotations'>('annotations', {
      documentId: document._id,
    });

    // TODO: Add better status code handling
    return { data: { document, annotations }, statusCode: Math.max(statusCodeDocument, statusCodeAnnotations) };
  });

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={({
        document,
        annotations,
      }: {
        document: fetchedDocumentType;
        annotations: fetchedAnnotationType[];
      }) => props.children({ document, annotations, fetchNewDocument })}
      fetchInfo={documentAndAnnotationsFetchInfo}
      dataAdapter={({ document: fetchedDocument, annotations: fetchedAnnotations }) => {
        const document = {
          ...fetchedDocument,
          _id: idModule.lib.buildId(fetchedDocument._id),
        };
        const annotations = fetchedAnnotations.map((annotation) => ({
          ...annotation,
          _id: idModule.lib.buildId(annotation._id),
        }));

        return { document, annotations: autoLinker.autoLinkAll(annotations) } as {
          document: fetchedDocumentType;
          annotations: fetchedAnnotationType[];
        };
      }}
    />
  );

  /* eslint-disable @typescript-eslint/no-empty-function */
  async function fetchNewDocument() {}
}
