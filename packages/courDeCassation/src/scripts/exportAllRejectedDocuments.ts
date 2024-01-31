import { buildBackend } from '@label/backend';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.cleanDocuments.run(),
    backend.scripts.cleanDocuments.option,
  );

  const sderExporter = buildSderExporter(environment, settings);
  backend.runScript(
    () => sderExporter.exportAllRejectedDocuments(environment),
    {
      shouldLoadDb: true,
    },
  );
})();
