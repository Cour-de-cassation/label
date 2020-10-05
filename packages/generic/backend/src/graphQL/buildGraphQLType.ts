import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';
import { dataModelFieldType, dataModelType } from '@label/core';

export { buildGraphQLType };

function buildGraphQLType<T>(name: string, dataModel: dataModelType<T>) {
  const graphQLType = {
    name,
    fields: {},
  };

  for (const key in dataModel) {
    Object.assign(graphQLType.fields, {
      [key]: { type: buildGraphQLFieldType(dataModel[key]) },
    });
  }

  return new GraphQLObjectType(graphQLType);
}

function buildGraphQLFieldType(
  dataModelfield: dataModelFieldType,
): GraphQLScalarType {
  switch (dataModelfield) {
    case 'date':
      return GraphQLString;
    case 'mongoIdType':
      return GraphQLString;
    case 'number':
      return GraphQLInt;
    case 'string':
      return GraphQLString;
  }
}
