import { buildBackend } from '@label/backend';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  const sderExporter = buildSderExporter(settings);

  backend.runScript(() => sderExporter.exportAllTreatedDocuments(), {
    shouldLoadDb: true,
  });
})();
