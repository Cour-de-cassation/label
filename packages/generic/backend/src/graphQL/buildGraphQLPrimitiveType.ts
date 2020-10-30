import { GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { dataModelFieldType } from '@label/core';

export { buildGraphQLPrimitiveType };

function buildGraphQLPrimitiveType(primitiveType: dataModelFieldType) {
  switch (primitiveType) {
    case 'boolean':
      return GraphQLBoolean;
    case 'date':
      return GraphQLString;
    case 'id':
      return GraphQLString;
    case 'number':
      return GraphQLInt;
    case 'string':
      return GraphQLString;
    default:
      return GraphQLString;
  }
}
