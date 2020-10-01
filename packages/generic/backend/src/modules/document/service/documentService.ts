import { documentType } from '@label/core';
import { buildAnnotationReportRepository } from '../../annotationReport';
import { buildDocumentRepository } from '..';

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
};
