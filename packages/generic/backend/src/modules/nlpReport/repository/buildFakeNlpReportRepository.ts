import { nlpReportType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customNlpReportRepositoryType } from './customNlpReportRepositoryType';

export { buildFakeNlpReportRepository };

const buildFakeNlpReportRepository = buildFakeRepositoryBuilder<
  nlpReportType,
  customNlpReportRepositoryType
>({ buildCustomFakeRepository: () => ({}) });
