import { gql } from '@apollo/client';
import { documentType, graphQLReceivedDataType } from '@label/core';

export { DOCUMENT_GRAPHQL_QUERY };

export type { documentGraphQLType };

type documentGraphQLType = {
  document: graphQLReceivedDataType<documentType>;
};

const DOCUMENT_GRAPHQL_QUERY = gql`
  query document {
    document {
      _id
      text
    }
  }
`;
