import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { dataModelFieldType, dataModelType } from '@label/core';

export { buildGraphQLInputType, buildGraphQLType };

function buildGraphQLInputType<T>(name: string, dataModel: dataModelType<T>) {
  const graphQLDataSchema = buildGraphQLDataSchema(name, dataModel);
  return new GraphQLInputObjectType(graphQLDataSchema);
}

function buildGraphQLType<T>(name: string, dataModel: dataModelType<T>) {
  const graphQLDataSchema = buildGraphQLDataSchema(name, dataModel);
  return new GraphQLObjectType(graphQLDataSchema);
}

function buildGraphQLDataSchema<T>(name: string, dataModel: dataModelType<T>) {
  const graphQLDataSchema = {
    name,
    fields: {},
  };

  for (const key in dataModel) {
    if (dataModel[key].graphQL) {
      Object.assign(graphQLDataSchema.fields, {
        [key]: { type: buildGraphQLFieldType(dataModel[key].type) },
      });
    }
  }

  return graphQLDataSchema;
}

function buildGraphQLFieldType(
  dataModelfield: dataModelFieldType,
): GraphQLScalarType {
  switch (dataModelfield) {
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
  }
}
