import { gql } from '@apollo/client';
import { graphQLReceivedDataType } from '@label/core';
import { fetchedAnnotationType } from '../../../../types';

export { ANNOTATIONS_GRAPHQL_QUERY };

export type { annotationsGraphQLType };

type annotationsGraphQLType = {
  annotations: Array<graphQLReceivedDataType<fetchedAnnotationType>>;
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
