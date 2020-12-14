import { documentType, idType, idModule } from '@label/core';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildDocumentRepository } from '../repository';
import { assignationService } from '../../assignation';

export { documentService };

const documentService = {
  async fetchDocumentsWithoutAnnotations(): Promise<documentType[]> {
    const annotationReportRepository = buildAnnotationReportRepository();
    const documentRepository = buildDocumentRepository();

    const reports = await annotationReportRepository.findAll();
    const documents = await documentRepository.findAll();

    return documents.filter(
      (document) =>
        !reports.some((report) => report.documentId === document._id),
    );
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
      return (
        await documentRepository.findAllByIds(
          documentIdsAssignated.filter(
            (documentId) =>
              !documentIdsToExclude.some((anotherDocumentId) =>
                idModule.lib.equalId(documentId, anotherDocumentId),
              ),
          ),
        )
      )
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
    documentId: idType,
    status: documentType['status'],
  ) {
    const documentRepository = buildDocumentRepository();
    await documentRepository.updateStatus(documentId, status);
  },
};
