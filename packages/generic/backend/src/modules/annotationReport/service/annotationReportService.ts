import { annotationReportType } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';

export { annotationReportService };

const annotationReportService = {
  async fetchChecklistByDocumentId(
    documentId: annotationReportType['documentId'],
  ) {
    const annotationReportRepository = buildAnnotationReportRepository();
    const annotationReport = await annotationReportRepository.findByDocumentId(
      documentId,
    );

    return (
      annotationReport?.checklist ?? ([] as annotationReportType['checklist'])
    );
  },

  async deleteAnnotationReportsByDocumentId(
    documentId: annotationReportType['documentId'],
  ) {
    const annotationReportRepository = buildAnnotationReportRepository();
    await annotationReportRepository.deleteByDocumentId(documentId);
  },
};
