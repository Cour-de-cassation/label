import { gql } from '@apollo/client';
import { annotationType } from '@label/core';

export { ANNOTATIONS_GRAPHQL_QUERY };

export type { annotationsGraphQLType };

type annotationsGraphQLType = {
  annotations: annotationType[];
};

const ANNOTATIONS_GRAPHQL_QUERY = gql`
  query annotations($documentId: String!) {
    annotations(documentId: $documentId) {
      _id
      category
      entityId
      text
      start
    }
  }
`;
