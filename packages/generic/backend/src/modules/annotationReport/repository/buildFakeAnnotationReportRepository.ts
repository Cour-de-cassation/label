import { annotationReportType, idModule } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAnnotationReportRepositoryType } from './customAnnotationReportRepositoryType';

export { buildFakeAnnotationReportRepository };

const buildFakeAnnotationReportRepository = buildFakeRepositoryBuilder<
  annotationReportType,
  customAnnotationReportRepositoryType
>({
  buildCustomFakeRepository: (collection) => ({
    async findByDocumentId(documentId) {
      const annotationReport = await collection.find(
        (anotherAnnotationReport) =>
          idModule.lib.equalId(anotherAnnotationReport.documentId, documentId),
      );

      if (!annotationReport) {
        throw new Error(
          `No annotation report for the given document id ${documentId}`,
        );
      }

      return annotationReport;
    },
  }),
});
