import { logger } from '../../../utils';
import { addBoundDecisionDocumentNumbersInDocumentModel } from './addBoundDecisionDocumentNumbersInDocumentModel';
import { changeTypeCreationDateInDocumentModel } from './changeTypeCreationDateInDocumentModel';
import { renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel } from './renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel';
export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
  logger.log('add boundDecisionExternalId in document model');
  await addBoundDecisionDocumentNumbersInDocumentModel();
  logger.log('change type creation date in document model');
  await changeTypeCreationDateInDocumentModel();
  logger.log(
    'rename bound decision external id to bound decisions document numbers in document model',
  );
  await renameBoundDecisionExternalIdToBoundDecisionDocumentNumbersInDocumentModel();
}
