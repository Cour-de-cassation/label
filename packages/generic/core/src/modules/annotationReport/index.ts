import { annotationReportGenerator } from "./generator";
import { annotationReportType } from "./annotationReportType";

export { annotationReportModule };

export type { annotationReportType };

const annotationReportModule = {
  generator: annotationReportGenerator,
  lib: undefined,
};
