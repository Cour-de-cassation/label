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

    // We get all documents that can be assigned
    const documentIdsWithAnnotations = await treatmentService.fetchTreatedDocumentIds();

    // Documents already assignated to the user are fetched
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
    }

    // If at least one document has the 'saved' status means that the anotator is currently annotating a document
    if (documents.some(({ document }) => document.status === 'saved')) {
      return documents;
    }

    // We fill the pool of assignated documents with new ones
    for (let i = documents.length; i < documentsMaxCount; i++) {
      try {
        const assignatedDocument = await fetchDocumentForUser(
          userId,
          documentIdsWithAnnotations,
        );
        documents.push(assignatedDocument);
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

      // Get document by priority
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
    documentIdsToSearchIn: documentType['_id'][],
  ): Promise<documentType | undefined> {
    const documentRepository = buildDocumentRepository();

    const document:
      | documentType
      | undefined = await documentRepository.findOneByStatusAndPriorityAmong(
      { priority, status: 'free' },
      documentIdsToSearchIn,
    );

    if (!document) {
      return undefined;
    }
    if (
      (await assignationService.fetchAssignationsOfDocumentId(document?._id))
        .length != 0
    ) {
      // If the document is assignated, remove the document from the list
      documentIdsToSearchIn = documentIdsToSearchIn.filter(
        (documentId) => documentId !== document?._id,
      );
      return assignDocumentByPriority(priority, documentIdsToSearchIn);
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
      return assignDocumentByPriority(priority, documentIdsToSearchIn);
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
