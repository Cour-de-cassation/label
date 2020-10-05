import { GraphQLList } from 'graphql';
import { documentModule } from '@label/core';
import { buildGraphQLType } from '../../../graphQL';
import { resolveDocuments } from './resolvers';

export { documentsGraphQLQuery };

const documentsGraphQLQuery = {
  type: new GraphQLList(
    buildGraphQLType('documentType', documentModule.dataModel),
  ),
  resolve: resolveDocuments,
};
