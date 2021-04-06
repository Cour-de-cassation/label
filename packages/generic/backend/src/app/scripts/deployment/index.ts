import { logger } from '../../../utils';
import { addHasBeenReadInProblemReportModel } from './addHasBeenReadInProblemReportModel';
import { addInfoInTreatment } from './addInfoInTreatment';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Add hasBeenRead in ProblemReport model');
  await addHasBeenReadInProblemReportModel();
  logger.log('Add info to treatments');
  await addInfoInTreatment();
}
