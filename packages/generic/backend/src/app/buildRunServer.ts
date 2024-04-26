import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { environmentHandler, environmentType, settingsType } from '@label/core';

import { buildApi } from '../api';
import { setup } from './setup';

export { buildRunServer };

function buildRunServer(environment: environmentType, settings: settingsType) {
  console.log(process.env.NODE_ENV);

  console.log(`label client url : ${process.env.LABEL_CLIENT_URL}`);
  return () => {
    const app = express();

    app.use(
      cors({
        origin: [`${process.env.LABEL_CLIENT_URL}`],
      }),
    );

    app.use(bodyParser.json({ limit: '1mb' }));

    buildApi(app);

    app.listen(environment.port.server, async () => {
      await setup(environment, settings);
    });
  };
}
