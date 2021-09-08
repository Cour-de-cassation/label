import React, { ReactElement } from 'react';
import { annotationType, fetchedDocumentType, httpStatusCodeHandler, idModule } from '@label/core';
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
  documentsMaxCount: number;
}) {
  const documentsForUserFetchInfo = useApi(buildFetchDocumentsForUser(), {
    documentsMaxCount: props.documentsMaxCount,
  });

  return (
    <DataFetcher
      buildComponentWithData={(
        documentsForUser: {
          document: fetchedDocumentType;
          annotations: annotationType[];
        }[],
      ) => props.children({ documentsForUser, fetchNewDocumentsForUser: () => documentsForUserFetchInfo.refetch() })}
      fetchInfo={documentsForUserFetchInfo}
      showLoadingOnRefetch
    />
  );
}

function buildFetchDocumentsForUser() {
  return async ({ documentsMaxCount }: { documentsMaxCount: number }) => {
    const { documentsForUser, statusCode } = await fetchDocumentsForUser(documentsMaxCount);

    return { data: documentsForUser, statusCode };
  };
}

async function fetchDocumentsForUser(documentsMaxCount: number) {
  const documentsForUser = [];
  const statusCodesAnnotations = [];

  const { data: documents, statusCode: statusCodeDocuments } = await apiCaller.get<'documentsForUser'>(
    'documentsForUser',
    {
      documentsMaxCount,
    },
  );

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];

    try {
      const { data: annotations, statusCode: statusCodeAnnotations } = await apiCaller.get<'annotations'>(
        'annotations',
        {
          documentId: document._id,
        },
      );

      documentsForUser.push({
        document: {
          ...document,
          _id: idModule.lib.buildId(document._id),
        },
        annotations,
      });
      statusCodesAnnotations.push(statusCodeAnnotations);
    } catch (error) {
      console.warn(error);
    }
  }

  return {
    documentsForUser,
    statusCode: httpStatusCodeHandler.merge([statusCodeDocuments, ...statusCodesAnnotations]),
  };
}
