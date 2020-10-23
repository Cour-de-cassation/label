import { GraphQLObjectType } from 'graphql';
import { annotationsGraphQLMutation } from '../modules/annotation';
import { updateAssignationStatusGraphQLMutation } from '../modules/assignation';
import { signUpUserGraphQLMutation } from '../modules/user';

export { graphQLMutation };

const graphQLMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    annotations: annotationsGraphQLMutation,
    updateAssignationStatus: updateAssignationStatusGraphQLMutation,
    signUpUser: signUpUserGraphQLMutation,
  },
});
