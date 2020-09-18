import { nlpReportType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customNlpReportRepositoryType } from './customNlpReportRepositoryType';

export { buildNlpReportRepository };

const buildNlpReportRepository = buildRepositoryBuilder<
  nlpReportType,
  customNlpReportRepositoryType
>({
  collectionName: 'nlpReports',
  buildCustomRepository: () => ({}),
});
