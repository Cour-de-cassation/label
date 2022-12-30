import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runScript(
    () => backend.scripts.displayMultipleAssignatedDocuments.run(),
    backend.scripts.displayMultipleAssignatedDocuments.option,
  );
})();
