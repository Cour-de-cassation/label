import { documentModule } from '@label/core';
import { buildGraphQLType } from '../../../graphQL';
import { resolveDocument } from './resolvers';

export { documentGraphQLQuery };

const documentGraphQLQuery = {
  type: buildGraphQLType('documentType', documentModule.dataModel),
  resolve: resolveDocument,
};
