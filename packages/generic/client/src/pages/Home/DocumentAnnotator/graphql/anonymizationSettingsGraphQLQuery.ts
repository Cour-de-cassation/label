import { gql } from '@apollo/client';

export { ANONYMIZATION_SETTINGS_GRAPHQL_QUERY };

export type { anonymizationSettingsGraphQLType };

type anonymizationSettingsGraphQLType = {
  anonymizationSettings: { json: string };
};

const ANONYMIZATION_SETTINGS_GRAPHQL_QUERY = gql`
  query anonymizationSettings {
    anonymizationSettings {
      json
    }
  }
`;
