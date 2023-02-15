import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';

(async () => {
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  await backend.runScript(
    () =>
      backend.scripts.clearDb.run({
        annotation: false,
        assignation: false,
        document: false,
        migration: false,
        statistic: false,
        treatment: false,
        user: false,
      }),
    backend.scripts.clearDb.option,
  );
})();
