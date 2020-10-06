import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';

import { buildHandlingErrorController } from '../lib/express';
import { authenticationMiddleware, userController } from '../modules/user';
import { graphQLMutation } from './graphQLMutation';
import { graphQLQuery } from './graphQLQuery';
import { setup } from './setup';

const app = express();
const port = 8080;

app.use(cors({ origin: 'http://localhost:3000' }));

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
    schema: new GraphQLSchema({
      query: graphQLQuery,
      mutation: graphQLMutation,
    }),
    graphiql: true,
  }),
);

app.listen(port, async () => {
  await setup(port);
});
