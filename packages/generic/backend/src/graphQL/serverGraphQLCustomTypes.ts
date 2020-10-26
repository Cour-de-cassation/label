import { mapValues } from 'lodash';
import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import {
  buildGraphQLTypeName,
  graphQLCustomTypes,
  graphQLCustomTypeType,
} from '@label/core';
import { buildGraphQLPrimitiveType } from './buildGraphQLPrimitiveType';

export { serverGraphQLCustomTypes };

const serverGraphQLCustomTypes = buildGraphQLCustomTypes();

function buildGraphQLCustomTypes() {
  return {
    input: mapValues(
      graphQLCustomTypes,
      (graphQLCustomType) =>
        new GraphQLInputObjectType(
          buildGraphQLCustomType(graphQLCustomType, 'input'),
        ),
    ),
    output: mapValues(
      graphQLCustomTypes,
      (graphQLCustomType) =>
        new GraphQLObjectType(
          buildGraphQLCustomType(graphQLCustomType, 'output'),
        ),
    ),
  };

  function buildGraphQLCustomType(
    graphQLCustomType: graphQLCustomTypeType,
    kind: 'input' | 'output',
  ) {
    return {
      name: buildGraphQLTypeName(kind, graphQLCustomType.name),
      fields: mapValues(graphQLCustomType.fields, (fieldPrimitiveType) => ({
        type: buildGraphQLPrimitiveType(fieldPrimitiveType),
      })),
    };
  }
}
