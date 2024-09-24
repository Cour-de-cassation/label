import { problemReportType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customProblemReportRepositoryType } from './customProblemReportRepositoryType';

export { buildProblemReportRepository };

const buildProblemReportRepository = buildRepositoryBuilder<
  problemReportType,
  customProblemReportRepositoryType
>({
  collectionName: 'problemReports',
  indexes: [],
  buildCustomRepository: (collection) => ({
    async deleteByDocumentId(documentId) {
      await collection.deleteMany({ documentId });
    },
  }),
});
