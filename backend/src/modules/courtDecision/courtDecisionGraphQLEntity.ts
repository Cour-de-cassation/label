import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { graphQLEntityType } from '../graphQLEntityType';

const courtDecisionGraphQLEntityType = new GraphQLObjectType({
  name: 'courtDecisionType',
  fields: {
    id: {
      type: GraphQLInt,
    },
  },
});

const resolveCourtDecisionGraphQLEntity = () => ({ id: 1 });

const courtDecisionGraphQLEntity: graphQLEntityType = {
  name: 'courtDecision',
  resolve: resolveCourtDecisionGraphQLEntity,
  type: courtDecisionGraphQLEntityType,
};

export { courtDecisionGraphQLEntity };
