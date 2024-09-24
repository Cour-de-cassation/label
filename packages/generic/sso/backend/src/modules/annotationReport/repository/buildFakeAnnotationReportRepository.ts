import { annotationReportType, idModule } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { customAnnotationReportRepositoryType } from './customAnnotationReportRepositoryType';

export { buildFakeAnnotationReportRepository };

const buildFakeAnnotationReportRepository = buildFakeRepositoryBuilder<
  annotationReportType,
  customAnnotationReportRepositoryType
>({
  collectionName: 'annotationReports',
  buildCustomFakeRepository: (collection) => ({
    async findByDocumentId(documentId) {
      return collection.filter(
        (annotationReport) =>
          !idModule.lib.equalId(annotationReport.documentId, documentId),
      )[0];
    },
    async deleteByDocumentId(documentId) {
      updateFakeCollection(
        collection,
        collection.filter(
          (annotationReport) =>
            !idModule.lib.equalId(annotationReport.documentId, documentId),
        ),
      );
    },
  }),
});
