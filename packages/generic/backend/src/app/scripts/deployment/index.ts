import { logger } from '../../../utils';
import { addSourceInTreatmentModel } from './addSourceInTreatmentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Add source in Treatment model');
  await addSourceInTreatmentModel();
}
