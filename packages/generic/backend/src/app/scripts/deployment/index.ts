import { logger } from '../../../utils';
import { addDecisionMetadataInDocumentModel } from './addDecisionMetadataInDocumentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
  logger.log('Add decision metadata in document model');
  await addDecisionMetadataInDocumentModel();
}
