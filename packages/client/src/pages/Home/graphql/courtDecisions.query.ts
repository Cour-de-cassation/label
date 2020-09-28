import { gql } from '@apollo/client';

const COURT_DECISIONS_QUERY = gql`
  query courtDecisions {
    courtDecisions {
      _id
    }
  }
`;
export { COURT_DECISIONS_QUERY };
