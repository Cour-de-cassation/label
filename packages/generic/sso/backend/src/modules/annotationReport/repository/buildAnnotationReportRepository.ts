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
    async findByDocumentId(documentId) {
      const result = await collection.find({ documentId }).toArray();

      if (result.length === 0) {
        return undefined;
      }

      return result[0];
    },
    async deleteByDocumentId(documentId) {
      await collection.deleteMany({ documentId });
    },
  }),
});
