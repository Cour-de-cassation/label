import { gql } from "@apollo/client";

const COURT_DECISION_QUERY = gql`
  query courtDecision {
    courtDecision {
      id
    }
  }
`
export { COURT_DECISION_QUERY }