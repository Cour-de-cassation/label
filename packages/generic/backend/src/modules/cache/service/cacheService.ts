import { createCache } from './createCache';
import { deleteCache } from './deleteCache';
import {
  fetchCache,
  fetchAllById,
  fetchAllByKey,
  fetchAllOlderThan,
} from './fetch';

export { cacheService };

const cacheService = {
  createCache,
  deleteCache,
  fetchCache,
  fetchAllById,
  fetchAllByKey,
  fetchAllOlderThan,
};
