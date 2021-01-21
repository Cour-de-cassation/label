import { buildBackend } from '@label/backend';
import { jurinetConnector } from '../connector';
import { parametersHandler } from '../../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(importAllDocumentsFromJurinet, { shouldLoadDb: true });
})();

async function importAllDocumentsFromJurinet() {
  await jurinetConnector.importAllDocuments();
}
