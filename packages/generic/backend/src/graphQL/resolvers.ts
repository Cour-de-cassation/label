import { GraphQLFieldResolver } from 'graphql';
import { graphQLSchema } from '@label/core';
import { annotationResolvers } from '../modules/annotation';
import { assignationResolvers } from '../modules/assignation';
import { documentResolvers } from '../modules/document';
import { settingsResolvers } from '../modules/settings';
import { userResolvers } from '../modules/user';

export { resolvers };

const mutationResolvers: {
  [mutationEntry in keyof typeof graphQLSchema.mutation]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = {
  annotations: annotationResolvers.resolveAnnotationsMutation,
  updateAssignationStatus: assignationResolvers.resolveUpdateAssignationStatus,
  signUpUser: userResolvers.resolveSignUpUser,
};

const queryResolvers: {
  [queryEntry in keyof typeof graphQLSchema.query]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = {
  annotations: annotationResolvers.resolveAnnotations,
  document: documentResolvers.resolveDocument,
  settings: settingsResolvers.resolveSettings,
};

const resolvers = {
  mutation: mutationResolvers,
  query: queryResolvers,
};
