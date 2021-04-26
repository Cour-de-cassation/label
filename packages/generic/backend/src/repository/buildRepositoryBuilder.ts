import { idModule, idType, indexer } from '@label/core';
import { mongo, mongoCollectionType } from '../utils';
import { projectedType, repositoryType } from './repositoryType';
import { buildProjection } from './repositoryUtils';

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
      deleteById,
      deleteManyByIds,
      findAll,
      findAllProjection,
      findAllByIds,
      findById,
      insert,
      insertMany,
      setIndexes,
      updateOne,
      upsert,
      ...customRepository,
    };

    async function clear() {
      await collection.deleteMany({});
    }

    async function deleteById(_id: idType) {
      await collection.deleteOne({ _id } as any);
    }

    async function deleteManyByIds(ids: idType[]) {
      await collection.deleteMany({ _id: { $in: ids } } as any);
    }

    async function findAll() {
      return collection.find().toArray();
    }

    async function findAllProjection<projectionT extends keyof T>(
      projection: Array<projectionT>,
    ): Promise<Array<projectedType<T, projectionT>>> {
      return (collection
        .find()
        .project(buildProjection(projection as string[]))
        .toArray() as any) as Array<projectedType<T, projectionT>>;
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

      return indexer.indexBy(items, (item) =>
        idModule.lib.convertToString(item._id),
      );
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

    async function insertMany(newObjects: T[]) {
      if (newObjects.length === 0) {
        return;
      }
      await collection.insertMany(newObjects as any[]);
    }

    async function setIndexes() {
      for (const index of indexes) {
        await collection.createIndex(index);
      }
    }

    async function updateOne(id: idType, objectFields: Partial<T>) {
      await collection.updateOne({ _id: id } as any, {
        $set: objectFields,
      });
    }

    async function upsert(newObject: T) {
      await collection.updateOne(
        { _id: newObject._id } as any,
        {
          $set: newObject,
        },
        {
          upsert: true,
        },
      );
    }
  };
}
