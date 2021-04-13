import { logger } from '../../../utils';
import { renameDocumentIdToDocumentNumberInDocumentModel } from './renameDocumentIdToDocumentNumberInDocumentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Rename document Id to document number in document Model');
  await renameDocumentIdToDocumentNumberInDocumentModel();
}
