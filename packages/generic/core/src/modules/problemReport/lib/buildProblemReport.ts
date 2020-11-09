import { idModule, omitIdType } from '../../id';
import { problemReportType } from '../problemReportType';

export { buildProblemReport };

function buildProblemReport(assignationFields: omitIdType<problemReportType>): problemReportType {
  return {
    ...assignationFields,
    _id: idModule.lib.buildId(),
  };
}
