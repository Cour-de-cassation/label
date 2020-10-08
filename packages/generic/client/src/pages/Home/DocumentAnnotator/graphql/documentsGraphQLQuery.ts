import { gql } from '@apollo/client';
import { documentType } from '@label/core';

export { DOCUMENTS_GRAPHQL_QUERY };

export type { documentGraphQLType };

type documentGraphQLType = {
  documents: documentType[];
};

const DOCUMENTS_GRAPHQL_QUERY = gql`
  query documents {
    documents {
      _id
      text
    }
  }
`;
