import { buildBackend } from '@label/backend';
import { sderConnector } from '../connector';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  backend.runScript(() => autoImportDocumentsFromSder(), {
    shouldLoadDb: true,
  });
})();

async function autoImportDocumentsFromSder() {
  await sderConnector.importNewDocuments();
}
