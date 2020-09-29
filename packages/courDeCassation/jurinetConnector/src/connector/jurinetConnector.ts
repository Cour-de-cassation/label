import { buildConnector, connectorConfigType } from '@label/backend';
import { jurinetFetcher } from './fetcher';

export { jurinetConnector };

const jurinetConnectorConfigType: connectorConfigType = {
  name: 'Jurinet',
  ...jurinetFetcher,
};

const jurinetConnector = buildConnector(jurinetConnectorConfigType);
