import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { graphQLEntityType } from '../graphQLEntityType';
import { resolveCourtDecisions } from './resolvers/resolveCourtDecisions';

export { courtDecisionsGraphQLEntity, buildCourtDecisionGraphQLType, successGraphQLType };

const courtDecisionsGraphQLEntity: graphQLEntityType = {
  name: 'courtDecisions',
  resolve: resolveCourtDecisions,
  type: buildCourtDecisionGraphQLType(),
};


function buildCourtDecisionGraphQLType() {
  return new GraphQLObjectType({
    name: 'courtDecisionType',
    fields: {
      date: {
        type: GraphQLString,
      },
      footer: {
        type: GraphQLString,
      },
      header: {
        type: GraphQLString,
      },
      _id: {
        type: GraphQLString,
      },
      metadata: {
        type: GraphQLString,
      },
      oracleId: {
        type: GraphQLString,
      },
      source: {
        type: GraphQLString,
      },
      text: {
        type: GraphQLString,
      },
    },
  });
}

const successGraphQLType = new GraphQLObjectType({
  name: 'success',
  fields: {
    success: {
      type: GraphQLBoolean
    }
  },
});




