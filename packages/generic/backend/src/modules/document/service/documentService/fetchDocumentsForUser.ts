import {
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
    const documents: documentType[] = [];
    const documentIdsToExclude: documentType['_id'][] = [];
    const documentIdsWithAnnotations = await treatmentService.fetchTreatedDocumentIds();
    const documentsAssignated = await fetchAlreadyAssignatedDocuments(userId);
    for (
      let i = 0;
      i < documentsAssignated.length && i < documentsMaxCount;
      i++
    ) {
      checkCallAttempts(idModule.lib.convertToString(userId));
      const assignatedDocument = documentsAssignated[i];
      documents.push(assignatedDocument);
      documentIdsToExclude.push(assignatedDocument._id);
    }

    if (documents.some(({ status }) => status === 'saved')) {
      return documents;
    }

    for (let i = documents.length; i < documentsMaxCount; i++) {
      try {
        const document = await fetchDocumentForUser(
          userId,
          documentIdsWithAnnotations,
        );
        documents.push(document);
        documentIdsToExclude.push(document._id);
      } catch (error) {
        logger.log(error);
      }
    }
    return documents;
  }

  async function fetchDocumentForUser(
    userId: idType,
    documentIdsToSearchIn: documentType['_id'][],
  ): Promise<documentType> {
    checkCallAttempts(idModule.lib.convertToString(userId));

    return assignNewDocument(documentIdsToSearchIn);

    async function assignNewDocument(
      documentIdsToSearchIn: documentType['_id'][],
    ) {
      let document: documentType | undefined;

      document = await assignDocumentByPriority('high', documentIdsToSearchIn);
      if (!document) {
        document = await assignDocumentByPriority(
          'medium',
          documentIdsToSearchIn,
        );
      }
      if (!document) {
        document = await assignDocumentByPriority('low', documentIdsToSearchIn);
      }
      if (!document) {
        throw new Error(`No free document available`);
      }

      await assignationService.createAssignation({
        userId,
        documentId: document._id,
      });

      return document;
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

  async function fetchAlreadyAssignatedDocuments(userId: userType['_id']) {
    const documentRepository = buildDocumentRepository();
    const documentIdsAssignated = await assignationService.fetchDocumentIdsAssignatedToUserId(
      userId,
    );

    const documentsById = await documentRepository.findAllByIds(
      documentIdsAssignated,
    );
    return Object.values(documentsById)
      .filter(
        (document) =>
          document.status === 'pending' || document.status === 'saved',
      )
      .sort((document1, document2) =>
        document1.status === 'saved'
          ? -1
          : document2.status === 'saved'
          ? 1
          : 0,
      );
  }
}
