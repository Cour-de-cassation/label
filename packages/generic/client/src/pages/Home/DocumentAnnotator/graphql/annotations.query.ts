import { gql } from '@apollo/client';

const ANNOTATIONS_QUERY = gql`
  query annotations($documentId: String!) {
    annotations(documentId: $documentId) {
      _id
      category
      text
    }
  }
`;
export { ANNOTATIONS_QUERY };
