import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import bodyParser from 'body-parser';
import cors from 'cors';

import { mongo } from '../lib/mongo';
import { authenticationMiddleware, userController } from '../modules/user';
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
  console.log(`Loading the Mongo database...`);
  await mongo.initialize();
  console.log(`MongoDB ready!`);
  console.log(`GraphQL available on http://localhost:${port}`);
});
