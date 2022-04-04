import { idModule, idType, indexer } from '@label/core';
import { mongo, mongoCollectionType } from '../utils';
import { projectedType, repositoryType } from './repositoryType';
import { buildProjection } from './repositoryUtils';

export { buildRepositoryBuilder };

type indexesType<T extends { [key: string]: any }> = Array<{
  index: indexType<T>;
  mustBeUnique?: boolean;
}>;

type indexType<T extends { [key: string]: any }> = Partial<
  {
    [key in keyof T]: 1 | -1;
  }
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
      distinct,
      distinctNested,
      findAll,
      findAllProjection,
      findAllByIds,
      findById,
      deletePropertiesForMany,
      insert,
      insertMany,
      setIndexes,
      updateOne,
      updateMany,
      upsert,
      ...customRepository,
    };

    async function clear() {
      await collection.deleteMany({});
    }

    async function deleteById(_id: idType) {
      const result = await collection.deleteOne({ _id } as any);
      if (result.deletedCount !== 1) {
        throw new Error(
          `No ${collectionName} with _id ${idModule.lib.convertToString(_id)}`,
        );
      }
    }

    async function deleteManyByIds(ids: idType[]) {
      const deleteResult = await collection.deleteMany({
        _id: { $in: ids },
      } as any);
      return {
        success: !!deleteResult.result.ok,
        count: deleteResult.result.n ?? 0,
      };
    }

    async function distinct<fieldNameT extends keyof T>(fieldName: fieldNameT) {
      return collection.distinct(fieldName as string, {});
    }

    async function distinctNested<fieldT>(fieldName: string) {
      const distinctFields = (await collection.distinct(
        fieldName,
        {},
      )) as fieldT[];
      return distinctFields.filter(Boolean);
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

    async function deletePropertiesForMany(
      filter: Partial<T>,
      fieldNames: Array<string>,
    ) {
      await collection.updateMany(filter, buildUnsetQuery(fieldNames));
    }

    async function setIndexes() {
      for (const { index, mustBeUnique } of indexes) {
        if (mustBeUnique) {
          await collection.createIndex(index, { unique: true });
        } else {
          await collection.createIndex(index);
        }
      }
    }

    async function updateOne(_id: idType, objectFields: Partial<T>) {
      await collection.updateOne({ _id } as any, {
        $set: objectFields,
      });
      const updatedItem = await collection.findOne({ _id } as any);
      return updatedItem || undefined;
    }

    async function updateMany(filter: Partial<T>, objectFields: Partial<T>) {
      await collection.updateMany({ filter } as any, {
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

    function buildUnsetQuery(fieldNames: Array<string>) {
      return {
        $unset: fieldNames.reduce(
          (accumulator, fieldName) => ({ ...accumulator, [fieldName]: 1 }),
          {},
        ),
      };
    }
  };
}
