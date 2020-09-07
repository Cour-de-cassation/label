import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";

import { graphQLQuery } from "./modules/graphQLQuery";

const app = express();
const port = 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: new GraphQLSchema({
      query: graphQLQuery,
    }),
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`GraphQL test on http://localhost:${port}`);
});
