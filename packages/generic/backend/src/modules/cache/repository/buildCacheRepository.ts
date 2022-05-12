import { cacheType } from '@label/core';
import { buildRepositoryBuilder } from '../../../repository';
import { customCacheRepositoryType } from './customCacheRepositoryType';

export { buildCacheRepository };

const buildCacheRepository = buildRepositoryBuilder<
  cacheType,
  customCacheRepositoryType
>({
  collectionName: 'caches',
  indexes: [
    {
      index: { key: 1 },
    } as const,
  ],
  buildCustomRepository: (collection) => ({
    async findAllByKey(key: cacheType['key']) {
      return collection.find({ key }).sort({ updateDate: -1 }).toArray();
    },
    async updateContentById(
      _id: cacheType['_id'],
      content: cacheType['content'],
    ) {
      await collection.updateOne(
        { _id },
        { $set: buildUpdateContentQuery(content) },
      );
      const updatedCache = await collection.findOne({ _id });
      return updatedCache || undefined;
    },
  }),
});

function buildUpdateContentQuery(content: cacheType['content']) {
  return { content, updateDate: new Date().getTime() };
}
