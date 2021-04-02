import { idType } from '../id';
import { buildModel, buildType } from '../modelType';

export { fetchedMonitoringEntryModel, monitoringEntryModel };

export type { fetchedMonitoringEntryType, monitoringEntryType };

const monitoringEntryModelCommonFields = {
  _id: { kind: 'custom', content: 'id' },
  action: { kind: 'primitive', content: 'string' },
  creationDate: { kind: 'primitive', content: 'number' },
  documentId: { kind: 'custom', content: 'id' },
  origin: { kind: 'constant', content: ['document', 'panel', 'footer', 'shortcut'] },
} as const;

const fetchedMonitoringEntryModel = buildModel({
  kind: 'object',
  content: monitoringEntryModelCommonFields,
} as const);

const monitoringEntryModel = buildModel({
  kind: 'object',
  content: {
    ...monitoringEntryModelCommonFields,
    userId: { kind: 'custom', content: 'id' },
  },
} as const);

type fetchedMonitoringEntryType = buildType<typeof fetchedMonitoringEntryModel, { id: idType }>;

type monitoringEntryType = buildType<typeof monitoringEntryModel, { id: idType }>;
