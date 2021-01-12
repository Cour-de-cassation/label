import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { environment } from '@label/core';

import { buildApi } from '../api';
import { buildHandlingErrorController } from '../utils';
import { userController } from '../modules/user';
import { setup } from './setup';

const app = express();
const port = environment.port.server;

app.use(
  cors({
    origin: [
      `http://localhost:${environment.port.client}`,
      `http://bkpanonym:${environment.port.client}`,
    ],
  }),
);

app.use(bodyParser.json());

app.post('/login', buildHandlingErrorController(userController.login));
app.post(
  '/reset-password-request',
  buildHandlingErrorController(userController.resetPasswordRequest),
);
app.post(
  '/reset-password',
  buildHandlingErrorController(userController.resetPassword),
);

buildApi(app);

app.listen(port, async () => {
  await setup(port);
});
