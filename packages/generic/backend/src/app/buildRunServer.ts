import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { settingsType } from '@label/core';

import { buildApi } from '../api';
import { setup } from './setup';
import { envSchema } from './envSchema';

import session from 'express-session';

export { buildRunServer };

function buildRunServer(settings: settingsType) {
  return () => {
    const app = express();

    const { error } = envSchema.validate(process.env, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    app.use(
      cors({
        origin: [`${process.env.LABEL_CLIENT_URL}`],
        credentials: true,
      }),
    );

    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    // Configuration de la session
    const sessionMiddleware = session({
      secret: `${process.env.COOKIE_PRIVATE_KEY}`,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(process.env.SESSION_DURATION),
        secure: false,
      },
    });
    // exclusion de certain paths
    app.use((req, res, next) => {
      sessionMiddleware(req, res, next);
    });

    buildApi(app);

    app.listen(process.env.LABEL_API_PORT, async () => {
      await setup(settings);
    });
  };
}
