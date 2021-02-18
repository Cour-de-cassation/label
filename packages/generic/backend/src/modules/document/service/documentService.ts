import { documentType, idType, idModule } from '@label/core';
import { dateBuilder } from '../../../utils';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { buildDocumentRepository } from '../repository';

export { documentService };

const DAYS_BEFORE_EXPORT = 10;

const documentService = {
  async fetchAllDocumentsByIds(documentIds: documentType['_id'][]) {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByIds(documentIds);
  },

  async fetchDocumentsReadyToExport(): Promise<documentType[]> {
    const documentRepository = buildDocumentRepository();

    const documentsCompletelyTreated = await documentRepository.findAllByStatus(
      'done',
    );

    const documentsReadyToExport = documentsCompletelyTreated.filter(
      (document) =>
        document.updateDate < dateBuilder.daysAgo(DAYS_BEFORE_EXPORT),
    );

    return documentsReadyToExport;
  },

  async fetchDocumentsWithoutAnnotations(): Promise<documentType[]> {
    const documentRepository = buildDocumentRepository();

    const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
    const documents = await documentRepository.findAll();

    return documents.filter(
      (document) =>
        !treatedDocumentIds.some((documentId) =>
          idModule.lib.equalId(documentId, document._id),
        ),
    );
  },

  async fetchDocument(documentId: documentType['_id']) {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findById(documentId);
  },
  async fetchDocumentForUser(
    userId: idType,
    documentIdsToExclude: idType[] = [],
  ): Promise<documentType> {
    const documentRepository = buildDocumentRepository();
    const documentIdsAssignated = await assignationService.fetchDocumentIdsAssignatedToUserId(
      userId,
    );

    const documentsAssignated = await fetchAlreadyAssignatedDocuments();

    if (documentsAssignated.length !== 0) {
      return documentsAssignated[0];
    } else {
      return assignNewDocument();
    }

    async function fetchAlreadyAssignatedDocuments() {
      const documentsById = await documentRepository.findAllByIds(
        documentIdsAssignated.filter(
          (documentId) =>
            !documentIdsToExclude.some((anotherDocumentId) =>
              idModule.lib.equalId(documentId, anotherDocumentId),
            ),
        ),
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

    async function assignNewDocument() {
      const document = await documentRepository.assign();

      await assignationService.createAssignation({
        userId,
        documentId: document._id,
      });

      return document;
    }
  },

  async updateDocumentStatus(
    id: documentType['_id'],
    status: documentType['status'],
  ) {
    const documentRepository = buildDocumentRepository();
    await documentRepository.updateStatusById(id, status);

    if (status === 'free') {
      await assignationService.deleteAssignationsByDocumentId(id);
    }
  },
};
