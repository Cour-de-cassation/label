import { buildBackend } from '@label/backend';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  await backend.runScript(
    () => backend.scripts.cleanDuplicatedDocuments.run(),
    backend.scripts.cleanDuplicatedDocuments.option,
  );

  const sderExporter = buildSderExporter(settings);
  backend.runScript(() => sderExporter.exportAllRejectedDocuments(), {
    shouldLoadDb: true,
  });
})();
