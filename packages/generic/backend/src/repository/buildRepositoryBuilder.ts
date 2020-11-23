import { idType } from '@label/core';
import { mongo, mongoCollectionType } from '../utils';
import { repositoryType } from './repositoryType';

export { buildRepositoryBuilder };

function buildRepositoryBuilder<T extends { _id: idType }, U>({
  collectionName,
  buildCustomRepository,
}: {
  collectionName: string;
  buildCustomRepository: (collection: mongoCollectionType<T>) => U;
}): () => repositoryType<T> & U {
  return () => {
    const db = mongo.getDb();
    const collection = db.collection<T>(collectionName);
    const customRepository = buildCustomRepository(collection);

    return {
      clear,
      findAll,
      findById,
      insert,
      ...customRepository,
    };

    async function clear() {
      await collection.deleteMany({});
    }

    async function findAll() {
      return collection.find().toArray();
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
  };
}
