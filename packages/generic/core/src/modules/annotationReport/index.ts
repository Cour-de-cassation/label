import { annotationReportGenerator } from "./generator";
import { annotationReportType } from "./annotationReportType";

export { annotationReportModule, annotationReportType };

const annotationReportModule = {
  generator: annotationReportGenerator,
  lib: undefined,
};
