import { annotationReportGenerator } from './generator';
import { annotationReportModel, annotationReportType } from './annotationReportType';
import { buildAnnotationReport } from './lib';

export { annotationReportModule };

export type { annotationReportType };

const annotationReportModule = {
  model: annotationReportModel,
  generator: annotationReportGenerator,
  lib: { buildAnnotationReport },
};
