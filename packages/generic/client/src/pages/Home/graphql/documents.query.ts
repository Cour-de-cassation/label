import { gql } from '@apollo/client';

const DOCUMENTS_QUERY = gql`
  query documents {
    documents {
      _id
    }
  }
`;
export { DOCUMENTS_QUERY };
