import { dependencyManager } from '../../../utils';
import { buildFakeNlpReportRepository } from './buildFakeNlpReportRepository';
import { buildNlpReportRepository } from './buildNlpReportRepository';

export {
  buildRepository as buildNlpReportRepository,
  buildFakeNlpReportRepository,
};

const buildRepository = dependencyManager.inject({
  forLocal: buildNlpReportRepository,
  forProd: buildNlpReportRepository,
  forTest: buildFakeNlpReportRepository,
});
