import { idModule, omitIdType } from "../../id";
import { annotationReportType } from "../annotationReportType";

export { buildAnnotationReport };

const buildAnnotationReport: (
  annotationReportFields: omitIdType<annotationReportType>
) => annotationReportType = idModule.lib.buildObjectWithId;
