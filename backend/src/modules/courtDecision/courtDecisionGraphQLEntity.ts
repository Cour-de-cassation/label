import { GraphQLObjectType, GraphQLInt } from "graphql";
import { GraphQLEntityType } from "../GraphQLEntityType";

const courtDecisionGraphQLEntityType = new GraphQLObjectType({
  name: "courtDecisionType",
  fields: {
    id: {
      type: GraphQLInt,
    },
  },
});

const resolveCourtDecisionGraphQLEntity = () => ({ id: 1 });

const courtDecisionGraphQLEntity: GraphQLEntityType = {
  name: "courtDecision",
  resolve: resolveCourtDecisionGraphQLEntity,
  type: courtDecisionGraphQLEntityType,
};

export { courtDecisionGraphQLEntity };
