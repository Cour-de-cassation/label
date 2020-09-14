import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import { graphQLQuery } from "./modules/graphQLQuery";
import { mongo } from './lib/mongo'

import { maVariable } from '@label/core';

console.log('maVariable', maVariable);

const app = express();
const port = 8080;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: new GraphQLSchema({
      query: graphQLQuery,
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
