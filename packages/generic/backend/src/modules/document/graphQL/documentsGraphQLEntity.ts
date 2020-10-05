import { GraphQLObjectType, GraphQLBoolean } from 'graphql';
import { documentModule } from '@label/core';
import { buildGraphQLType, graphQLEntityType } from '../../../graphQL';
import { resolveDocuments } from './resolvers';

export { documentsGraphQLEntity, successGraphQLType };

const documentsGraphQLEntity: graphQLEntityType = {
  name: 'documents',
  resolve: resolveDocuments,
  type: buildGraphQLType('documentType', documentModule.dataModel),
};

const successGraphQLType = new GraphQLObjectType({
  name: 'success',
  fields: {
    success: {
      type: GraphQLBoolean,
    },
  },
});
