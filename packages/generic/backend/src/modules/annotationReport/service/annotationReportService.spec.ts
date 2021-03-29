import { annotationReportModule, idModule } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';
import { annotationReportService } from './annotationReportService';

describe('annotationReportService', () => {
  const annotationReportRepository = buildAnnotationReportRepository();

  describe('deleteAnnotationReportsByDocumentId', () => {
    it('should remove all the annotation reports from the database with the given document id', async () => {
      const documentId = idModule.lib.buildId();
      const annotationReports = ([
        { documentId },
        { documentId },
        { documentId: idModule.lib.buildId() },
      ] as const).map(annotationReportModule.generator.generate);
      await Promise.all(
        annotationReports.map(annotationReportRepository.insert),
      );

      await annotationReportService.deleteAnnotationReportsByDocumentId(
        documentId,
      );

      const annotationReportsAfterRemove = await annotationReportRepository.findAll();
      expect(annotationReportsAfterRemove).toEqual([annotationReports[2]]);
    });
  });

  describe('fetchAnnotationReportOfDocument', () => {
    it('should fetch the annotation report for the given document id', async () => {
      const annotationReports = ([{}, {}] as const).map(
        annotationReportModule.generator.generate,
      );
      await Promise.all(
        annotationReports.map(annotationReportRepository.insert),
      );

      const fetchedAnnotationReport = await annotationReportService.fetchAnnotationReportOfDocument(
        annotationReports[1].documentId,
      );

      expect(fetchedAnnotationReport).toEqual(annotationReports[1]);
    });
  });
});
