import { buildBackend } from '@label/backend';
import { parametersHandler } from '../lib/parametersHandler';
import * as dotenv from 'dotenv';

(async () => {
  if (process.env.RUN_MODE === 'LOCAL') {
    dotenv.config();
  }
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  await backend.runScript(
    () => backend.scripts.clearDb.run({}),
    backend.scripts.clearDb.option,
  );
})();
