import { filterKeysType } from './utilityTypes';

export type { filterNetworkKeysType };

type filterNetworkKeysType<T> = filterKeysType<T, { network: true }>;
