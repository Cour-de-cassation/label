import { connectorType } from '@label/backend';
import { jurinetFetcher } from './fetcher';

export { jurinetConnector };

const jurinetConnector: connectorType = {
  name: 'Jurinet',
  ...jurinetFetcher,
};
