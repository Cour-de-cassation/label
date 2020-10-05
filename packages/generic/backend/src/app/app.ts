import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';

import { mongo } from '../lib/mongo';
import { authenticationMiddleware, userController } from '../modules/user';
import { logger } from '../utils';
import { graphQLMutation } from './graphQLMutation';
import { graphQLQuery } from './graphQLQuery';
import { buildHandlingErrorController } from '../lib/express';

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
  logger.log(`Loading the Mongo database...`);
  await mongo.initialize();
  logger.log(`MongoDB ready!`);
  logger.log(`GraphQL available on http://localhost:${port}`);
});
