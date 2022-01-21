import React, { ReactElement } from 'react';
import { annotationType, assignationType, fetchedDocumentType, httpStatusCodeHandler, idModule } from '@label/core';
import { apiCaller, useApi } from '../../api';
import { DataFetcher } from '../DataFetcher';

export { DocumentsDataFetcher };

function DocumentsDataFetcher(props: {
  children: (fetched: {
    documentsForUser: {
      assignationId: assignationType['_id'];
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
          assignationId: assignationType['_id'];
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
  const documentsForUser: Array<{
    document: fetchedDocumentType;
    assignationId: assignationType['_id'];
    annotations: annotationType[];
  }> = [];
  const statusCodesAnnotations = [];

  const { data: assignatedDocuments, statusCode: statusCodeDocuments } = await apiCaller.get<'documentsForUser'>(
    'documentsForUser',
    {
      documentsMaxCount,
    },
  );

  for (let i = 0; i < assignatedDocuments.length; i++) {
    const assignatedDocument = assignatedDocuments[i];

    try {
      const { data: annotations, statusCode: statusCodeAnnotations } = await apiCaller.get<'annotations'>(
        'annotations',
        {
          documentId: assignatedDocument.document._id,
        },
      );

      documentsForUser.push({
        document: {
          ...assignatedDocument.document,
          _id: idModule.lib.buildId(assignatedDocument.document._id),
        },
        assignationId: idModule.lib.buildId(assignatedDocument.assignationId),
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
