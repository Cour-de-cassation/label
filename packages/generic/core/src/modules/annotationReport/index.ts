import { annotationReportGenerator } from './generator';
import { annotationReportDataModel, annotationReportType } from './annotationReportType';
import { buildAnnotationReport } from './lib';

export { annotationReportModule };

export type { annotationReportType };

const annotationReportModule = {
  dataModel: annotationReportDataModel,
  generator: annotationReportGenerator,
  lib: { buildAnnotationReport },
};
