import { annotationReportType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customAnnotationReportRepositoryType } from './customAnnotationReportRepositoryType';

export { buildFakeAnnotationReportRepository };

const buildFakeAnnotationReportRepository = buildFakeRepositoryBuilder<
  annotationReportType,
  customAnnotationReportRepositoryType
>({ buildCustomFakeRepository: () => ({}) });
