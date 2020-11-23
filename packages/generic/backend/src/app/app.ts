import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import bodyParser from 'body-parser';
import cors from 'cors';
import { environment } from '@label/core';

import { buildHandlingErrorController, dependencyManager } from '../utils';
import { authenticationMiddleware, userController } from '../modules/user';
import { setup } from './setup';
import { serverGraphQLSchema } from '../graphQL/serverGraphQLSchema';

const app = express();
const port = environment.port.server;

dependencyManager.exec({
  execProd: () => {
    app.use(express.static('./build'));

    app.get('/', function (req, res) {
      res.sendFile('./build/index.html');
    });
  },
});

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

app.use(authenticationMiddleware);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: serverGraphQLSchema,
    graphiql: true,
  }),
);

app.listen(port, async () => {
  await setup(port);
});
