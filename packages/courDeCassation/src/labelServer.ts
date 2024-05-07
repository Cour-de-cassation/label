import { buildBackend } from '@label/backend';
import { parametersHandler } from './lib/parametersHandler';
import * as dotenv from 'dotenv';

(async () => {
  if (process.env.RUN_MODE === 'LOCAL') {
    dotenv.config();
  }
  const { environment, settings } = await parametersHandler.getParameters();
  const backend = buildBackend(environment, settings);

  backend.runServer();
})();
