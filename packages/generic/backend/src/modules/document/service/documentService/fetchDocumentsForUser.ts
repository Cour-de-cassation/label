import {
  assignationType,
  documentModule,
  documentType,
  idModule,
  idType,
  userType,
} from '@label/core';
import { logger } from '../../../../utils';
import { assignationService } from '../../../assignation';
import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { buildFetchDocumentsForUser };

function buildFetchDocumentsForUser(
  checkCallAttempts: (identifier: string) => void,
) {
  return fetchDocumentsForUser;

  async function fetchDocumentsForUser(
    userId: idType,
    documentsMaxCount: number,
  ) {
    const documents: Array<{
      document: documentType;
      assignationId: assignationType['_id'];
    }> = [];
    const documentIdsToExclude: documentType['_id'][] = [];
    const documentIdsWithAnnotations = await treatmentService.fetchTreatedDocumentIds();
    const alreadyAssignatedDocuments = await fetchAlreadyAssignatedDocuments(
      userId,
    );
    for (
      let i = 0;
      i < alreadyAssignatedDocuments.length && i < documentsMaxCount;
      i++
    ) {
      checkCallAttempts(idModule.lib.convertToString(userId));
      const alreadyAssignatedDocument = alreadyAssignatedDocuments[i];
      documents.push(alreadyAssignatedDocument);
      documentIdsToExclude.push(alreadyAssignatedDocument.document._id);
    }

    if (documents.some(({ document }) => document.status === 'saved')) {
      return documents;
    }

    for (let i = documents.length; i < documentsMaxCount; i++) {
      try {
        const assignatedDocument = await fetchDocumentForUser(
          userId,
          documentIdsWithAnnotations,
        );
        documents.push(assignatedDocument);
        documentIdsToExclude.push(assignatedDocument.document._id);
      } catch (error) {
        logger.log(error);
      }
    }
    return documents;
  }

  async function fetchDocumentForUser(
    userId: idType,
    documentIdsToSearchIn: documentType['_id'][],
  ): Promise<{
    document: documentType;
    assignationId: assignationType['_id'];
  }> {
    checkCallAttempts(idModule.lib.convertToString(userId));

    return assignNewDocument(documentIdsToSearchIn);

    async function assignNewDocument(
      documentIdsToSearchIn: documentType['_id'][],
    ): Promise<{
      document: documentType;
      assignationId: assignationType['_id'];
    }> {
      let document: documentType | undefined;

      document = await assignDocumentByPriority(4, documentIdsToSearchIn);
      if (!document) {
        document = await assignDocumentByPriority(2, documentIdsToSearchIn);
      }
      if (!document) {
        document = await assignDocumentByPriority(0, documentIdsToSearchIn);
      }
      if (!document) {
        throw new Error(`No free document available`);
      }

      const assignation = await assignationService.createAssignation({
        userId,
        documentId: document._id,
      });

      return { document, assignationId: assignation._id };
    }
  }

  async function assignDocumentByPriority(
    priority: documentType['priority'],
    documentIdsWithAnnotations: documentType['_id'][],
  ): Promise<documentType | undefined> {
    const documentRepository = buildDocumentRepository();

    const document = await documentRepository.findOneByStatusAndPriorityAmong(
      { priority, status: 'free' },
      documentIdsWithAnnotations,
    );

    if (!document) {
      return undefined;
    }

    const nextStatus = documentModule.lib.getNextStatus({
      status: document.status,
      publicationCategory: document.publicationCategory,
      route: document.route,
    });

    const updatedDocument = await documentRepository.updateOneStatusByIdAndStatus(
      { _id: document._id, status: 'free' },
      {
        status: nextStatus,
      },
    );
    if (updatedDocument?.status !== nextStatus) {
      return assignDocumentByPriority(priority, documentIdsWithAnnotations);
    }
    return updatedDocument;
  }

  async function fetchAlreadyAssignatedDocuments(
    userId: userType['_id'],
  ): Promise<
    Array<{
      document: documentType;
      assignationId: assignationType['_id'];
    }>
  > {
    const documentRepository = buildDocumentRepository();
    const documentIdsAssignated = await assignationService.fetchDocumentIdsAssignatedToUserId(
      userId,
    );

    const documentsById = await documentRepository.findAllByIds(
      documentIdsAssignated.map(({ documentId }) => documentId),
    );
    return documentIdsAssignated
      .map(({ documentId, assignationId }) => ({
        document: documentsById[idModule.lib.convertToString(documentId)],
        assignationId,
      }))
      .filter(
        ({ document }) =>
          document.status === 'pending' || document.status === 'saved',
      )
      .sort(({ document: document1 }, { document: document2 }) =>
        document1.status === 'saved'
          ? -1
          : document2.status === 'saved'
          ? 1
          : 0,
      );
  }
}
