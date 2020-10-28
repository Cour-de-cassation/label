import { documentType, idType } from '@label/core';
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
  async fetchDocumentForUser(userId: idType): Promise<documentType> {
    const documentRepository = buildDocumentRepository();
    const documentIdAssignatedToUserId = await assignationService.fetchDocumentIdAssignatedToUserId(
      userId,
    );

    if (documentIdAssignatedToUserId) {
      return documentRepository.findById(documentIdAssignatedToUserId);
    } else {
      return assignateANewDocument();
    }

    async function assignateANewDocument() {
      const assignatedDocumentIds = await assignationService.fetchAllAssignatedDocumentIds();

      const document = await documentRepository.findOneExceptIds(
        assignatedDocumentIds,
      );

      await assignationService.createAssignation({
        userId,
        documentId: document._id,
      });

      return document;
    }
  },
};
