import { buildConnector, connectorConfigType } from '@label/backend';
import { sderFetcher } from './fetcher';
import { sderUpdater } from './updater';
import { sderMapper } from './mapper';

export { sderConnector };

const sderConnectorConfig: connectorConfigType = {
  name: 'SDER',
  ...sderFetcher,
  ...sderUpdater,
  ...sderMapper
};

const sderConnector = buildConnector(sderConnectorConfig);
