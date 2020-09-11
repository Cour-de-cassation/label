import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { graphQLEntityType } from '../graphQLEntityType';
import { buildCourtDecisionRepository } from './courtDecisionRepository';
import { mongo } from '../../mongo'

const courtDecisionGraphQLEntityType = new GraphQLObjectType({
  name: 'courtDecisionType',
  fields: {
    id: {
      type: GraphQLInt,
    },
  },
});

const resolveCourtDecisionGraphQLEntity = async () => {
  const db = mongo.getDb();
  const courtDecisionRepository = buildCourtDecisionRepository(db)
  await courtDecisionRepository.findAll();
  return { id: 4 }
};

const courtDecisionGraphQLEntity: graphQLEntityType = {
  name: 'courtDecision',
  resolve: resolveCourtDecisionGraphQLEntity,
  type: courtDecisionGraphQLEntityType,
};

export { courtDecisionGraphQLEntity };
