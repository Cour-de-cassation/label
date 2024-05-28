import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  backend.runScript(
    () => backend.scripts.displayMultipleAssignatedDocuments.run(),
    backend.scripts.displayMultipleAssignatedDocuments.option,
  );
})();
