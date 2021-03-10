import { logger } from '../../../utils';
import { updateUserModel } from './updateUserModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Update User Model');
  await updateUserModel();
}
