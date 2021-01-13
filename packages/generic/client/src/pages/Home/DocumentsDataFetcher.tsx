import React, { ReactElement } from 'react';
import {
  autoLinker,
  fetchedAnnotationType,
  fetchedDocumentType,
  httpStatusCodeHandler,
  idModule,
  idType,
} from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { DocumentsDataFetcher };

function DocumentsDataFetcher(props: {
  alwaysDisplayHeader?: boolean;
  children: (fetched: {
    documentsToBeTreated: {
      document: fetchedDocumentType;
      annotations: fetchedAnnotationType[];
    }[];
    fetchNewDocumentsToBeTreated: () => void;
  }) => ReactElement;
  numberOfDocuments: number;
}) {
  const documentsToBeTreatedFetchInfo = useApi(buildFetchDocumentsToBeTreated(props.numberOfDocuments));

  return (
    <DataFetcher
      alwaysDisplayHeader={props.alwaysDisplayHeader}
      buildComponentWithData={(
        documentsToBeTreated: {
          document: fetchedDocumentType;
          annotations: fetchedAnnotationType[];
        }[],
      ) =>
        props.children({ documentsToBeTreated, fetchNewDocumentsToBeTreated: documentsToBeTreatedFetchInfo.refetch })
      }
      fetchInfo={documentsToBeTreatedFetchInfo}
    />
  );
}

function buildFetchDocumentsToBeTreated(numberOfDocuments: number) {
  return async () => {
    const documentsToBeTreated = [];
    const documentIdsToExclude = [] as idType[];
    const statusCodes = [];

    for (let i = 0; i < numberOfDocuments; i++) {
      const { documentToBeTreated, statusCode } = await fetchDocumentToBeTreated(documentIdsToExclude);
      documentsToBeTreated.push(documentToBeTreated);
      documentIdsToExclude.push(idModule.lib.buildId(documentToBeTreated.document._id));
      statusCodes.push(statusCode);
    }

    return { data: documentsToBeTreated, statusCode: httpStatusCodeHandler.merge(statusCodes) };
  };
}

async function fetchDocumentToBeTreated(documentIdsToExclude: idType[]) {
  const { data: document, statusCode: statusCodeDocument } = await apiCaller.get<'document'>('document', {
    documentIdsToExclude: documentIdsToExclude || [],
  });
  const { data: annotations, statusCode: statusCodeAnnotations } = await apiCaller.get<'annotations'>('annotations', {
    documentId: document._id,
  });

  return {
    documentToBeTreated: {
      document: {
        ...document,
        _id: idModule.lib.buildId(document._id),
      },
      annotations: autoLinker.autoLinkAll(
        annotations.map((annotation) => ({
          ...annotation,
          _id: idModule.lib.buildId(annotation._id),
        })),
      ),
    },
    statusCode: httpStatusCodeHandler.merge([statusCodeDocument, statusCodeAnnotations]),
  };
}
