import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import bodyParser from 'body-parser';

import { graphQLQuery, graphQLMutation } from './graphQl';
import { mongo } from './lib/mongo';
import { authenticationMiddleware, userController } from './modules/user';

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.post('/login', userController.login);

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
