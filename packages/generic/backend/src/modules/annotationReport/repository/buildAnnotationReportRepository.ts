import { annotationReportType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customAnnotationReportRepositoryType } from './customAnnotationReportRepositoryType';

export { buildAnnotationReportRepository };

const buildAnnotationReportRepository = buildRepositoryBuilder<
  annotationReportType,
  customAnnotationReportRepositoryType
>({
  collectionName: 'annotationReports',
  indexes: [],
  buildCustomRepository: (collection) => ({
    async deleteByDocumentId(documentId) {
      await collection.deleteMany({ documentId });
    },

    async findByDocumentId(documentId) {
      const annotationReport = await collection.findOne({
        documentId,
      });

      if (!annotationReport) {
        throw new Error(
          `No annotation report for the given document id ${documentId}`,
        );
      }

      return annotationReport;
    },
  }),
});
