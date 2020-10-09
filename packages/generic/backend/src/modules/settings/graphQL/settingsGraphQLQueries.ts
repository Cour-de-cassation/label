import { buildGraphQLType } from '../../../graphQL';
import { resolveSettings } from './resolvers';

export { settingsGraphQLQuery };

const settingsGraphQLQuery = {
  resolve: resolveSettings,
  type: buildGraphQLType('settingsType', { json: 'string' }),
};
