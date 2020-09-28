import { annotationReportType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customNlpReportRepositoryType } from './customNlpReportRepositoryType';

export { buildFakeNlpReportRepository };

const buildFakeNlpReportRepository = buildFakeRepositoryBuilder<
  annotationReportType,
  customNlpReportRepositoryType
>({ buildCustomFakeRepository: () => ({}) });
