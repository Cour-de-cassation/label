import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () => backend.scripts.listDocumentsWithProblemReports.run(),
    backend.scripts.listDocumentsWithProblemReports.option,
  );
})();
