import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  await backend.runScript(
    () => backend.scripts.resetUntreatedDocumentsForTest.run(),
    backend.scripts.resetUntreatedDocumentsForTest.option,
  );
})();
