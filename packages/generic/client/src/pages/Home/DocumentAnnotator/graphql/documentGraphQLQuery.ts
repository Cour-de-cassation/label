import { gql } from '@apollo/client';
import { graphQLReceivedDataType } from '@label/core';
import { fetchedDocumentType } from '../../../../types';

export { DOCUMENT_GRAPHQL_QUERY };

export type { documentGraphQLType };

type documentGraphQLType = {
  document: graphQLReceivedDataType<fetchedDocumentType>;
};

const DOCUMENT_GRAPHQL_QUERY = gql`
  query document {
    document {
      _id
      text
    }
  }
`;
