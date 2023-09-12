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
  }),
});
