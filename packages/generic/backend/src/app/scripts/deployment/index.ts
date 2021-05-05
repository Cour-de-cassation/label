import { logger } from '../../../utils';
import { changeTypeCreationDateInDocumentModel } from './changeTypeCreationDateInDocumentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
  // logger.log('add boundDecisionExternalId in document model');
  // await addBoundDecisionDocumentNumbersInDocumentModel();
  logger.log('change type creation date in document model');
  await changeTypeCreationDateInDocumentModel();
}
