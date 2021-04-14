import { logger } from '../../../utils';
import { addInfoInTreatment } from './addInfoInTreatment';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Repair treatments');
  await addInfoInTreatment();
}
