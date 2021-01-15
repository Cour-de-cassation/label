import { dependencyManager } from '@label/core';
import { buildFakeProblemReportRepository } from './buildFakeProblemReportRepository';
import { buildProblemReportRepository } from './buildProblemReportRepository';

export { buildRepository as buildProblemReportRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildProblemReportRepository,
  forProd: buildProblemReportRepository,
  forTest: buildFakeProblemReportRepository,
});
