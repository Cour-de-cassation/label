import { dependencyManager } from '../../../utils';
import { buildFakeAnnotationReportRepository } from './buildFakeAnnotationReportRepository';
import { buildAnnotationReportRepository } from './buildAnnotationReportRepository';

export { buildRepository as buildAnnotationReportRepository };

const buildRepository = dependencyManager.inject({
  forLocal: buildAnnotationReportRepository,
  forProd: buildAnnotationReportRepository,
  forTest: buildFakeAnnotationReportRepository,
});
