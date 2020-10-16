import { buildMongoId } from "../../../lib";
import { omitMongoIdType } from "../../../types";
import { annotationReportType } from "../annotationReportType";

export { buildAnnotationReport };

function buildAnnotationReport(
  annotationReportFields: omitMongoIdType<annotationReportType>
): annotationReportType {
  return {
    ...annotationReportFields,
    _id: buildMongoId(),
  };
}
