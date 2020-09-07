import { GraphQLObjectType } from "graphql";
import { courtDecisionGraphQLEntity } from "./courtDecision/courtDecisionGraphQLEntity";

const graphQLQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    courtDecision: {
      type: courtDecisionGraphQLEntity.type,
      resolve: courtDecisionGraphQLEntity.resolve,
    },
  },
});

export { graphQLQuery };
