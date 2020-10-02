import { gql } from '@apollo/client';

const DOCUMENTS_QUERY = gql`
  query documents {
    documents {
      _id
      text
    }
  }
`;
export { DOCUMENTS_QUERY };
