import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.resetUntreatedDocumentsForTest.run(),
    backend.scripts.resetUntreatedDocumentsForTest.option,
  );
})();
