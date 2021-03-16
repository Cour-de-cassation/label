import React, { ReactElement } from 'react';
import { annotationType, fetchedDocumentType, httpStatusCodeHandler, idModule, idType } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { DocumentsDataFetcher };

function DocumentsDataFetcher(props: {
  children: (fetched: {
    documentsForUser: {
      document: fetchedDocumentType;
      annotations: annotationType[];
    }[];
    fetchNewDocumentsForUser: () => void;
  }) => ReactElement;
  numberOfDocuments: number;
}) {
  const documentsForUserFetchInfo = useApi(buildFetchDocumentsForUser(props.numberOfDocuments));

  return (
    <DataFetcher
      buildComponentWithData={(
        documentsForUser: {
          document: fetchedDocumentType;
          annotations: annotationType[];
        }[],
      ) => props.children({ documentsForUser, fetchNewDocumentsForUser: documentsForUserFetchInfo.refetch })}
      fetchInfo={documentsForUserFetchInfo}
    />
  );
}

function buildFetchDocumentsForUser(numberOfDocuments: number) {
  return async () => {
    const documentsForUser = [];
    const documentIdsToExclude = [] as idType[];
    const statusCodes = [];

    for (let i = 0; i < numberOfDocuments; i++) {
      const { documentForUser, statusCode } = await fetchDocumentForUser(documentIdsToExclude);
      documentsForUser.push(documentForUser);
      documentIdsToExclude.push(idModule.lib.buildId(documentForUser.document._id));
      statusCodes.push(statusCode);
    }

    return { data: documentsForUser, statusCode: httpStatusCodeHandler.merge(statusCodes) };
  };
}

async function fetchDocumentForUser(documentIdsToExclude: idType[]) {
  const { data: document, statusCode: statusCodeDocument } = await apiCaller.get<'documentForUser'>('documentForUser', {
    documentIdsToExclude: documentIdsToExclude || [],
  });
  const { data: annotations, statusCode: statusCodeAnnotations } = await apiCaller.get<'annotations'>('annotations', {
    documentId: document._id,
  });

  const { data: annotationReport } = await apiCaller.get<'annotationReport'>('annotationReport', {
    documentId: document._id,
  });

  /* eslint-disable no-console */
  console.log(document.title);
  /* eslint-disable no-console */
  annotationReport.checkList.map((item) => console.log(item));
  /* eslint-disable no-console */
  console.log('———————————————————————————————————');

  return {
    documentForUser: {
      document: {
        ...document,
        _id: idModule.lib.buildId(document._id),
      },
      annotations: annotations,
    },
    statusCode: httpStatusCodeHandler.merge([statusCodeDocument, statusCodeAnnotations]),
  };
}
