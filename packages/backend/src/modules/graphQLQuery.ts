import { GraphQLObjectType } from "graphql";
import { courtDecisionsQuery, insertCourtDecisionQuery } from "./courtDecision/courtDecisionGraphlQueries";

const graphQLQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    courtDecisions: courtDecisionsQuery,
    insertCourtDecision: insertCourtDecisionQuery
  },
});

export { graphQLQuery };
