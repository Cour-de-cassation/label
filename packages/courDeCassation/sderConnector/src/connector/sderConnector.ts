import { buildConnector, connectorConfigType } from '@label/backend';
import { sderFetcher } from './fetcher';

export { sderConnector };

const sderConnectorConfig: connectorConfigType = {
  name: 'SDER',
  ...sderFetcher,
};

const sderConnector = buildConnector(sderConnectorConfig);
