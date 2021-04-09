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
  maxNumberOfDocuments: number;
}) {
  const documentsForUserFetchInfo = useApi(buildFetchDocumentsForUser(props.maxNumberOfDocuments));

  return (
    <DataFetcher
      buildComponentWithData={(
        documentsForUser: {
          document: fetchedDocumentType;
          annotations: annotationType[];
        }[],
      ) => props.children({ documentsForUser, fetchNewDocumentsForUser: documentsForUserFetchInfo.refetch })}
      fetchInfo={documentsForUserFetchInfo}
      showLoadingOnRefetch
    />
  );
}

function buildFetchDocumentsForUser(maxNumberOfDocuments: number) {
  return async () => {
    const documentsForUser = [];
    const documentIdsToExclude = [] as idType[];
    const statusCodes = [];

    for (let i = 0; i < maxNumberOfDocuments; i++) {
      const fetchInfo = await fetchDocumentForUser(documentIdsToExclude);
      if (!fetchInfo) {
        break;
      }
      documentsForUser.push(fetchInfo.documentForUser);
      documentIdsToExclude.push(idModule.lib.buildId(fetchInfo.documentForUser.document._id));
      statusCodes.push(fetchInfo.statusCode);
    }

    return { data: documentsForUser, statusCode: httpStatusCodeHandler.merge(statusCodes) };
  };
}

async function fetchDocumentForUser(documentIdsToExclude: idType[]) {
  try {
    const { data: document, statusCode: statusCodeDocument } = await apiCaller.get<'documentForUser'>(
      'documentForUser',
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
  } catch (error) {
    console.warn(error);
    return undefined;
  }
}
