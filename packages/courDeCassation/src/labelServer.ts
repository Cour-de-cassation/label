import { buildBackend } from '@label/backend';
import { parametersHandler } from './lib/parametersHandler';
import * as dotenv from 'dotenv';

const { RUN_MODE = 'LOCAL' } = process.env;

(async () => {
  if (RUN_MODE === 'LOCAL') {
    dotenv.config();
  }
  const { settings } = await parametersHandler.getParameters();
  const backend = buildBackend(settings);

  backend.runServer();
})();
