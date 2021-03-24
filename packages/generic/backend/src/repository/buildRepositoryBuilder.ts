import { idModule, idType } from '@label/core';
import { mongo, mongoCollectionType } from '../utils';
import { repositoryType } from './repositoryType';

export { buildRepositoryBuilder };

type indexesType<T extends { [key: string]: any }> = Array<
  Partial<
    {
      [key in keyof T]: 1 | -1;
    }
  >
>;

function buildRepositoryBuilder<T extends { _id: idType }, U>({
  collectionName,
  indexes,
  buildCustomRepository,
}: {
  collectionName: string;
  indexes: indexesType<T>;
  buildCustomRepository: (collection: mongoCollectionType<T>) => U;
}): () => repositoryType<T> & U {
  return () => {
    const db = mongo.getDb();
    const collection = db.collection<T>(collectionName);
    const customRepository = buildCustomRepository(collection);

    return {
      clear,
      deleteManyByIds,
      findAll,
      findAllByIds,
      findById,
      insert,
      setIndexes,
      ...customRepository,
    };

    async function clear() {
      await collection.deleteMany({});
    }

    async function deleteManyByIds(ids: idType[]) {
      await collection.deleteMany({ _id: { $in: ids } } as any);
    }

    async function findAll() {
      return collection.find().toArray();
    }

    async function findAllByIds(idsToSearchIn?: idType[]) {
      let items = [] as T[];
      if (idsToSearchIn) {
        items = await collection
          .find({ _id: { $in: idsToSearchIn } } as any)
          .toArray();
      } else {
        items = await collection.find().toArray();
      }

      return items.reduce((accumulator, currentItem) => {
        const idString = idModule.lib.convertToString(currentItem._id);
        if (!!accumulator[idString]) {
          return accumulator;
        }
        const item = items.find(({ _id }) =>
          idModule.lib.equalId(currentItem._id, _id),
        );
        if (!item) {
          return accumulator;
        }
        return {
          ...accumulator,
          [idString]: item,
        };
      }, {} as Record<string, T>);
    }

    async function findById(id: idType) {
      const result = await collection.findOne({ _id: id } as any);

      if (!result) {
        throw new Error(`No matching ${collectionName} for _id ${id}`);
      }

      return result;
    }

    async function insert(newObject: T) {
      const insertResult = await collection.insertOne(newObject as any);
      return { success: !!insertResult.result.ok };
    }

    async function setIndexes() {
      for (const index of indexes) {
        await collection.createIndex(index);
      }
    }
  };
}
