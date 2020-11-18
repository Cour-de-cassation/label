import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import bodyParser from 'body-parser';
import cors from 'cors';

import { buildHandlingErrorController } from '../lib/express';
import { authenticationMiddleware, userController } from '../modules/user';
import { setup } from './setup';
import { serverGraphQLSchema } from '../graphQL/serverGraphQLSchema';

const app = express();
const port = 7505;

app.use(cors({ origin: ['http://localhost:7506', 'http://bkpanonym:7506'] }));

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
