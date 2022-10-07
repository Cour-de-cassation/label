import { buildBackend } from '@label/backend';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  const sderExporter = buildSderExporter(settings);
  backend.runScript(() => sderExporter.exportAllRejectedDocuments(), {
    shouldLoadDb: true,
  });
})();
