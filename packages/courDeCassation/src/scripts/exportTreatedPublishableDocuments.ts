import { buildBackend } from '@label/backend';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  const sderExporter = buildSderExporter(environment, settings);

  backend.runScript(
    () => sderExporter.exportTreatedPublishableDocuments(environment),
    {
      shouldLoadDb: true,
    },
  );
})();
