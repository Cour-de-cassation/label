import { GraphQLFieldResolver } from 'graphql';
import { graphQLMutation, idModule } from '@label/core';
import { annotationService } from '../modules/annotation';
import { assignationService } from '../modules/assignation';
import { problemReportService } from '../modules/problemReport';
import { userService } from '../modules/user';
import { buildAuthenticatedResolver } from './buildAuthenticatedResolver';
import { resolversType } from './resolversType';

export { _typeCheck as mutationResolvers };

const mutationResolvers: resolversType<typeof graphQLMutation> = {
  annotations: async (_, { documentId, fetchedGraphQLAnnotations }) => {
    try {
      await annotationService.updateAnnotations(
        idModule.lib.buildId(documentId),
        fetchedGraphQLAnnotations.map((fetchedGraphQLAnnotation) => ({
          ...fetchedGraphQLAnnotation,
          _id: idModule.lib.buildId(fetchedGraphQLAnnotation._id),
        })),
      );

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },

  problemReport: buildAuthenticatedResolver(
    async (userId, { documentId, problemText, problemType }) => {
      try {
        await problemReportService.createProblemReport({
          userId,
          documentId: idModule.lib.buildId(documentId),
          problemText,
          problemType,
        });

        return { success: true };
      } catch (e) {
        return { success: false };
      }
    },
  ),

  updateAssignationStatus: buildAuthenticatedResolver(
    async (userId, { documentId, status }) => {
      try {
        await assignationService.updateStatus(
          userId,
          idModule.lib.buildId(documentId),
          status,
        );

        return { success: true };
      } catch (e) {
        return { success: false };
      }
    },
  ),

  async signUpUser(_root, { email, password }) {
    try {
      await userService.signUpUser({ email, password });

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },
};

const _typeCheck: {
  [queryEntry in keyof typeof graphQLMutation]: GraphQLFieldResolver<
    any,
    any,
    any
  >;
} = mutationResolvers;
