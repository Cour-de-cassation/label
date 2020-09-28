import { annotationReportType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customNlpReportRepositoryType } from './customNlpReportRepositoryType';

export { buildNlpReportRepository };

const buildNlpReportRepository = buildRepositoryBuilder<
  annotationReportType,
  customNlpReportRepositoryType
>({
  collectionName: 'nlpReports',
  buildCustomRepository: () => ({}),
});
