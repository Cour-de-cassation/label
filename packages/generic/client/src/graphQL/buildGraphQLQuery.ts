import { gql } from '@apollo/client';
import { dataModelType } from '@label/core';

export { buildGraphQLQuery, buildGraphQLStringQuery };

function buildGraphQLQuery<T>(queryNameAndParameters: string, nameAndParameters: string, dataModel: dataModelType<T>) {
  const stringQuery = buildGraphQLStringQuery(queryNameAndParameters, nameAndParameters, dataModel);

  return gql`
    ${stringQuery}
  `;
}

function buildGraphQLStringQuery<T>(
  queryNameAndParameters: string,
  nameAndParameters: string,
  dataModel: dataModelType<T>,
): string {
  let query = `query ${queryNameAndParameters} {\n`;
  query = `${query}${nameAndParameters} {\n`;

  for (const field in dataModel) {
    if (dataModel[field].graphQL) {
      query = `${query}${field}\n`;
    }
  }

  return `${query}}\n}\n`;
}
