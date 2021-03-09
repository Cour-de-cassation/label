import React, { ReactElement } from 'react';
import { annotationType, fetchedDocumentType, httpStatusCodeHandler, idModule, idType } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { DocumentsDataFetcher };

function DocumentsDataFetcher(props: {
  children: (fetched: {
    documentsToBeTreated: {
      document: fetchedDocumentType;
      annotations: annotationType[];
    }[];
    fetchNewDocumentsToBeTreated: () => void;
  }) => ReactElement;
  numberOfDocuments: number;
}) {
  const documentsToBeTreatedFetchInfo = useApi(buildFetchDocumentsToBeTreated(props.numberOfDocuments));

  return (
    <DataFetcher
      buildComponentWithData={(
        documentsToBeTreated: {
          document: fetchedDocumentType;
          annotations: annotationType[];
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
  const { data: document, statusCode: statusCodeDocument } = await apiCaller.get<'documentToBeTreated'>(
    'documentToBeTreated',
    {
      documentIdsToExclude: documentIdsToExclude || [],
    },
  );
  const { data: annotations, statusCode: statusCodeAnnotations } = await apiCaller.get<'annotations'>('annotations', {
    documentId: document._id,
  });

  const { data: annotationReport } = await apiCaller.get<'annotationReport'>('annotationReport', {
    documentId: document._id,
  });

  console.log(document.title);
  annotationReport.checkList.map((item) => console.log(item));
  console.log('———————————————————————————————————');

  return {
    documentToBeTreated: {
      document: {
        ...document,
        _id: idModule.lib.buildId(document._id),
      },
      annotations: annotations,
    },
    statusCode: httpStatusCodeHandler.merge([statusCodeDocument, statusCodeAnnotations]),
  };
}
