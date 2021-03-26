import { logger } from '../../../utils';
import { addHasBeenReadInProblemReportModel } from './addHasBeenReadInProblemReportModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Add hasBeenRead in ProblemReport model');
  await addHasBeenReadInProblemReportModel();
}
