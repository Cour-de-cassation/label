import { gql } from '@apollo/client';

export { SETTINGS_GRAPHQL_QUERY };

export type { settingsGraphQLType };

type settingsGraphQLType = {
  settings: { json: string };
};

const SETTINGS_GRAPHQL_QUERY = gql`
  query settings {
    settings {
      json
    }
  }
`;
