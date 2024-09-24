import { cacheType } from '@label/core';

export type { customCacheRepositoryType };

type customCacheRepositoryType = {
  findAllByKey: (key: cacheType['key']) => Promise<cacheType[]>;
  updateContentById: (
    _id: cacheType['_id'],
    content: cacheType['content'],
  ) => Promise<cacheType | undefined>;
};
