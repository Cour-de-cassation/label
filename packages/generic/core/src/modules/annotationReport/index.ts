import { annotationReportGenerator } from "./generator";
import { annotationReportType } from "./annotationReportType";
import { buildAnnotationReport } from "./lib";

export { annotationReportModule };

export type { annotationReportType };

const annotationReportModule = {
  generator: annotationReportGenerator,
  lib: { buildAnnotationReport },
};
