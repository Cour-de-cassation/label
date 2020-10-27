import { mapValues } from 'lodash';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputType,
  GraphQLOutputType,
} from 'graphql';
import { graphQLTypeType, graphQLMutation, graphQLQuery } from '@label/core';
import { buildGraphQLPrimitiveType } from './buildGraphQLPrimitiveType';
import { mutationResolvers } from './mutationResolvers';
import { queryResolvers } from './queryResolvers';
import { serverGraphQLCustomTypes } from './serverGraphQLCustomTypes';

export { serverGraphQLSchema };

const serverGraphQLSchema = buildGraphQLSchema();

function buildGraphQLSchema() {
  return new GraphQLSchema({
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: mapValues(
        graphQLMutation,
        ({ type, args }, graphQLEntryName) => ({
          resolve:
            mutationResolvers[graphQLEntryName as keyof typeof graphQLMutation],
          type: buildGraphQLOutputType(type),
          args: mapValues(args, (argType) => ({
            type: buildGraphQLInputType(argType),
          })),
        }),
      ),
    }),
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: mapValues(
        graphQLQuery,
        ({ type, args }: any, graphQLEntryName) => ({
          resolve:
            queryResolvers[graphQLEntryName as keyof typeof graphQLQuery],
          type: buildGraphQLOutputType(type),
          args: mapValues(args, (argType) => ({
            type: buildGraphQLInputType(argType),
          })),
        }),
      ),
    }),
  });
}

function buildGraphQLOutputType(
  graphQLType: graphQLTypeType,
): GraphQLOutputType {
  return buildGraphQLType(graphQLType, 'output') as GraphQLOutputType;
}

function buildGraphQLInputType(graphQLType: graphQLTypeType): GraphQLInputType {
  return buildGraphQLType(graphQLType, 'input') as GraphQLInputType;
}

function buildGraphQLType(
  graphQLType: graphQLTypeType,
  kind: 'input' | 'output',
): any {
  switch (graphQLType.kind) {
    case 'primitive':
      return buildGraphQLPrimitiveType(graphQLType.type);
    case 'list':
      return new GraphQLList(buildGraphQLType(graphQLType.type, kind));
    case 'custom':
      return serverGraphQLCustomTypes[kind][graphQLType.type];
  }
}
