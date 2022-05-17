import { cacheType, idModule } from '@label/core';
import {
  buildFakeRepositoryBuilder,
  updateFakeCollection,
} from '../../../repository';
import { customCacheRepositoryType } from './customCacheRepositoryType';

export { buildFakeCacheRepository };

const buildFakeCacheRepository = buildFakeRepositoryBuilder<
  cacheType,
  customCacheRepositoryType
>({
  collectionName: 'caches',
  buildCustomFakeRepository: (collection) => ({
    async findAllByKey(key: cacheType['key']) {
      return collection.filter((cache) => cache.key === key);
    },
    async updateContentById(
      _id: cacheType['_id'],
      content: cacheType['content'],
    ) {
      updateFakeCollection(
        collection,
        collection.map((document) =>
          idModule.lib.equalId(_id, document._id)
            ? {
                ...document,
                content,
                updateDate: new Date().getTime(),
              }
            : document,
        ),
      );
      const updatedCache = collection.find((cache) =>
        idModule.lib.equalId(_id, cache._id),
      );

      return updatedCache;
    },
  }),
});
