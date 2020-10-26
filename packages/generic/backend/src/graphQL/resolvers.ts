import { GraphQLFieldResolver } from 'graphql';
import { graphQLSchema } from '@label/core';
import {
  resolveAnnotations,
  resolveAnnotationsMutation,
} from '../modules/annotation/graphQL/resolvers';
import { resolveUpdateAssignationStatus } from '../modules/assignation/graphQL/resolvers';
import { resolveDocument } from '../modules/document/graphQL/resolvers';
import { resolveSettings } from '../modules/settings/graphQL/resolvers';
import { resolveSignUpUser } from '../modules/user/graphQL/resolvers';

export { resolvers };

const mutationResolvers: {
  [mutationEntry in keyof typeof graphQLSchema.mutation]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = {
  annotations: resolveAnnotationsMutation,
  updateAssignationStatus: resolveUpdateAssignationStatus,
  signUpUser: resolveSignUpUser,
};

const queryResolvers: {
  [queryEntry in keyof typeof graphQLSchema.query]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = {
  annotations: resolveAnnotations,
  document: resolveDocument,
  settings: resolveSettings,
};

const resolvers = {
  mutation: mutationResolvers,
  query: queryResolvers,
};
