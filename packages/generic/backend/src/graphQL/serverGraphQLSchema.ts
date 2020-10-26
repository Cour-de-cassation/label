import { mapValues } from 'lodash';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputType,
  GraphQLOutputType,
} from 'graphql';
import { graphQLTypeType, graphQLSchema } from '@label/core';
import { buildGraphQLPrimitiveType } from './buildGraphQLPrimitiveType';
import { resolvers } from './resolvers';
import { serverGraphQLCustomTypes } from './serverGraphQLCustomTypes';

export { serverGraphQLSchema };

const serverGraphQLSchema = buildGraphQLSchema();

function buildGraphQLSchema() {
  return new GraphQLSchema({
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: mapValues(
        graphQLSchema.mutation,
        ({ type, args }, graphQLEntryName) => ({
          resolve:
            resolvers.mutation[
              graphQLEntryName as keyof typeof graphQLSchema.mutation
            ],
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
        graphQLSchema.query,
        ({ type, args }: any, graphQLEntryName) => ({
          resolve:
            resolvers.query[
              graphQLEntryName as keyof typeof graphQLSchema.query
            ],
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
