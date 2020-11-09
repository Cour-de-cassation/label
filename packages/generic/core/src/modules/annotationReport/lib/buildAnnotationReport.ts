import { idModule, omitIdType } from '../../id';
import { annotationReportType } from '../annotationReportType';

export { buildAnnotationReport };

function buildAnnotationReport(annotationReportFields: omitIdType<annotationReportType>): annotationReportType {
  return {
    ...annotationReportFields,
    _id: idModule.lib.buildId(),
  };
}
