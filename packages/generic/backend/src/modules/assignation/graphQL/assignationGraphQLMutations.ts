import { GraphQLString } from 'graphql';
import { successGraphQLType } from '../../../graphQL';
import { resolveUpdateAssignationStatus } from './resolvers';

export { updateAssignationStatusGraphQLMutation };

const updateAssignationStatusGraphQLMutation = {
  resolve: resolveUpdateAssignationStatus,
  type: successGraphQLType,
  args: {
    documentIdString: {
      type: GraphQLString,
    },
    statusString: {
      type: GraphQLString,
    },
  },
};
