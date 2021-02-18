import { buildBackend } from '@label/backend';
import { settingsModule } from '@label/core';
import { buildSderExporter } from '../exporter';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);
  const sderExporter = buildSderExporter(
    settingsModule.lib.parseFromJson(settings),
  );

  backend.runScript(sderExporter.exportTreatedDocuments, {
    shouldLoadDb: true,
  });
})();
