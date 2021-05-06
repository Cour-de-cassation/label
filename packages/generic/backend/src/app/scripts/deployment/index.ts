import { logger } from '../../../utils';
import { addTreatmentDateInStatisticModel } from './addTreatmentDateInStatisticModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
  logger.log('Add treatment date in statistic model');
  await addTreatmentDateInStatisticModel();
}
