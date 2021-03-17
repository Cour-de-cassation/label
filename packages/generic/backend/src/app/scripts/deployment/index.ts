import { logger } from '../../../utils';
import { addPublicationCategoryInDocumentModel } from './addPublicationCategoryInDocumentModel';

export { runDeploymentScripts };

async function runDeploymentScripts() {
  logger.log('Add publication category in Document model');
  await addPublicationCategoryInDocumentModel();
}
