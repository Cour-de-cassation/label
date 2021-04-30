import { logger } from '../../../utils';
import { addMarkedAsPublishedInDocumentModel } from './addMarkedAsPublishedInDocumentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Deployment scripts');
  logger.log('add markedAsPublished in document model');
  await addMarkedAsPublishedInDocumentModel();
}
