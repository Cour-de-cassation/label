import { logger } from '../../../utils';
import { addBoundDecisionDocumentNumbersInDocumentModel } from './addBoundDecisionDocumentNumbersInDocumentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
  logger.log('add boundDecisionExternalId in document model');
  await addBoundDecisionDocumentNumbersInDocumentModel();
}
