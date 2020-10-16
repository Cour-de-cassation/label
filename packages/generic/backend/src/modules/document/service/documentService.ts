import { documentType, idModule, idType } from '@label/core';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildDocumentRepository } from '../repository';
import { assignationService } from '../../assignation/service';

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
    const documentIdsAssignatedByUser = await assignationService.fetchDocumentIdsAssignatedByUserId();
    const documentIdsAssignatedToUser =
      documentIdsAssignatedByUser[idModule.lib.convertToString(userId)];

    if (documentIdsAssignatedToUser && documentIdsAssignatedToUser.length > 0) {
      const documentId = documentIdsAssignatedToUser[0];
      return documentRepository.findById(documentId);
    }

    const assignatedDocumentIds = Object.values(
      documentIdsAssignatedByUser,
    ).flat();

    const document = await documentRepository.findOneExceptIds(
      assignatedDocumentIds,
    );

    await assignationService.createAssignation({
      userId,
      documentId: document._id,
    });

    return document;
  },
};
