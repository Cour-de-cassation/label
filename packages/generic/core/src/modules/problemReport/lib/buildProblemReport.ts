import { idModule, omitIdType } from '../../id';
import { problemReportType } from '../problemReportType';

export { buildProblemReport };

const buildProblemReport: (
  assignationFields: omitIdType<problemReportType>,
) => problemReportType = idModule.lib.buildObjectWithId;
