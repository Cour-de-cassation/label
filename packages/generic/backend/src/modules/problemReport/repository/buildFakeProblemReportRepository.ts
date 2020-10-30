import { problemReportType } from '@label/core';
import { buildFakeRepositoryBuilder } from '../../../repository';
import { customProblemReportRepositoryType } from './customProblemReportRepositoryType';

export { buildFakeProblemReportRepository };

const buildFakeProblemReportRepository = buildFakeRepositoryBuilder<
  problemReportType,
  customProblemReportRepositoryType
>({
  buildCustomFakeRepository: () => ({}),
});
