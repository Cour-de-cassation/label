import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import { maVariable } from '@label/core';

import { graphQLQuery, graphQLMutation } from "./graphQl";
import { mongo } from './lib/mongo'


console.log('maVariable', maVariable);

const app = express();
const port = 8080;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: new GraphQLSchema({
      query: graphQLQuery,
      mutation: graphQLMutation
    }),
    graphiql: true,
  })
);


app.listen(port, async () => {
  console.log(`Loading the Mongo database...`)
  await mongo.initialize();
  console.log(`MongoDB ready!`)
  console.log(`GraphQL available on http://localhost:${port}`);
});
