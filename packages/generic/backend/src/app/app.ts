import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { environment } from '@label/core';

import { buildApi } from '../api';
import { buildHandlingErrorController } from '../utils';
import { userController } from '../modules/user';
import { setup } from './setup';

const app = express();

app.use(
  cors({
    origin: [environment.url.client],
  }),
);

app.use(bodyParser.json());

app.post(
  '/reset-password-request',
  buildHandlingErrorController(userController.resetPasswordRequest),
);
app.post(
  '/reset-password',
  buildHandlingErrorController(userController.resetPassword),
);

buildApi(app);

app.listen(environment.port.server, async () => {
  await setup();
});
