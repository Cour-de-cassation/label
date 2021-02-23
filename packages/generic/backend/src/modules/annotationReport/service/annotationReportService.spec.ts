import { annotationReportModule } from '@label/core';
import { buildAnnotationReportRepository } from '../repository';
import { annotationReportService } from './annotationReportService';

describe('annotationReportService', () => {
  const annotationReportRepository = buildAnnotationReportRepository();

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
