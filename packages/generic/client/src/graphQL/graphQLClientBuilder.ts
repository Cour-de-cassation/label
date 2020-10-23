import { gql } from '@apollo/client';
import { dataModelType } from '@label/core';

export { graphQLClientBuilder, buildSchema };

const graphQLClientBuilder = {
  buildQuery,
  buildMutation,
};

function buildQuery<T>(queryNameAndParameters: string, nameAndParameters: string, dataModel: dataModelType<T>) {
  const query = buildSchema('query', queryNameAndParameters, nameAndParameters, dataModel);

  return gql`
    ${query}
  `;
}

function buildMutation<T>(mutationNameAndParameters: string, nameAndParameters: string, dataModel: dataModelType<T>) {
  const mutation = buildSchema('mutation', mutationNameAndParameters, nameAndParameters, dataModel);

  return gql`
    ${mutation}
  `;
}

function buildSchema<T>(
  graphQLSchemaType: 'query' | 'mutation',
  schemaNameAndParameters: string,
  nameAndParameters: string,
  dataModel: dataModelType<T>,
): string {
  let query = `${graphQLSchemaType} ${schemaNameAndParameters} {\n`;
  query = `${query}${nameAndParameters} {\n`;

  for (const field in dataModel) {
    if (dataModel[field].graphQL) {
      query = `${query}${field}\n`;
    }
  }

  return `${query}}\n}\n`;
}
