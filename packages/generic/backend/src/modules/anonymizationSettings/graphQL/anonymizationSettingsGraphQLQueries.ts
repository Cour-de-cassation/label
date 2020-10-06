import { buildGraphQLType } from '../../../graphQL';
import { resolveAnonymizationSettings } from './resolvers';

export { anonymizationSettingsGraphQLQuery };

const anonymizationSettingsGraphQLQuery = {
  resolve: resolveAnonymizationSettings,
  type: buildGraphQLType('anonymizationSettingsType', { json: 'string' }),
};
