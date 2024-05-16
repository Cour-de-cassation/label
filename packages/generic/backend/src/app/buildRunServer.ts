import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { settingsType } from '@label/core';

import { buildApi } from '../api';
import { setup } from './setup';
import * as dotenv from 'dotenv';
import { envSchema } from './envSchema';

export { buildRunServer };

function buildRunServer(settings: settingsType) {
  return () => {
    const app = express();

    if (process.env.RUN_MODE === 'LOCAL') {
      dotenv.config();
    }
    const { error, value: envVars } = envSchema.validate(process.env, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    app.use(
      cors({
        origin: [`${process.env.LABEL_CLIENT_URL}`],
      }),
    );

    app.use(bodyParser.json({ limit: '1mb' }));

    buildApi(app);

    app.listen(process.env.LABEL_SERVER_PORT, async () => {
      await setup(settings);
    });
  };
}
