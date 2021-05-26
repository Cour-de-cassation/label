import { idModule, idType, indexer, keysOf } from '@label/core';
import { omit } from 'lodash';
import { projectedType, repositoryType } from './repositoryType';

export { buildFakeRepositoryBuilder, projectFakeObjects, updateFakeCollection };

function buildFakeRepositoryBuilder<T extends { _id: idType }, U>({
  buildCustomFakeRepository,
  collectionName,
}: {
  buildCustomFakeRepository: (collection: T[]) => U;
  collectionName: string;
}): () => repositoryType<T> & U {
  const collection: T[] = [];
  const customRepository = buildCustomFakeRepository(collection);

  return () => ({
    clear,
    deleteById,
    deleteManyByIds,
    distinct,
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
  });

  async function clear() {
    while (collection.length) {
      collection.pop();
    }
  }

  async function deleteById(_id: idType) {
    const itemToDelete = collection.find(
      (item) => !idModule.lib.equalId(item._id, _id),
    );
    if (!itemToDelete) {
      throw new Error(
        `No ${collectionName} with _id ${idModule.lib.convertToString(_id)}`,
      );
    }
    updateFakeCollection(
      collection,
      collection.filter((item) => !idModule.lib.equalId(item._id, _id)),
    );
  }

  async function deleteManyByIds(ids: idType[]) {
    updateFakeCollection(
      collection,
      collection.filter(
        (item) => !ids.some((id) => idModule.lib.equalId(id, item._id)),
      ),
    );
  }

  async function deletePropertiesForMany(
    filter: Partial<T>,
    fieldNames: Array<keyof T>,
  ) {
    updateFakeCollection(
      collection,
      collection.map((item) => {
        const mustBeUpdated = keysOf<keyof T>(
          filter as Record<keyof T, any>,
        ).every((key) => filter[key] === item[key]);
        if (mustBeUpdated) {
          return omit(item, fieldNames);
        } else {
          return item;
        }
      }),
    );
  }

  async function distinct<fieldNameT extends keyof T>(fieldName: fieldNameT) {
    const distinctValues = [] as Array<T[fieldNameT]>;

    collection.forEach((value) => {
      if (
        distinctValues.every(
          (anotherValue) =>
            JSON.stringify(anotherValue) !== JSON.stringify(value[fieldName]),
        )
      ) {
        distinctValues.push(value[fieldName]);
      }
    });

    return distinctValues;
  }

  async function findAll() {
    return collection;
  }

  async function findAllProjection<projectionT extends keyof T>(
    projections: Array<projectionT>,
  ): Promise<Array<projectedType<T, projectionT>>> {
    return collection.map((document) =>
      projectFakeObjects(document, projections),
    );
  }

  async function findAllByIds(idsToSearchIn?: idType[]) {
    let items = [] as T[];
    if (idsToSearchIn) {
      items = collection.filter((item) =>
        idsToSearchIn.some((id) => idModule.lib.equalId(id, item._id)),
      );
    } else {
      items = collection;
    }

    return indexer.indexBy(items, (item) =>
      idModule.lib.convertToString(item._id),
    );
  }

  async function findById(id: idType) {
    const result = collection.find((item) =>
      idModule.lib.equalId(item._id, id),
    );

    if (!result) {
      throw new Error(`No matching object for _id ${id}`);
    }

    return result;
  }

  async function insert(newObject: T) {
    collection.push(newObject);
    return { success: true };
  }

  async function insertMany(newObjects: T[]) {
    collection.push(...newObjects);
  }

  async function setIndexes() {}

  async function updateOne(id: idType, objectFields: Partial<T>) {
    updateFakeCollection(
      collection,
      collection.map((item) =>
        idModule.lib.equalId(id, item._id)
          ? { ...item, ...objectFields }
          : item,
      ),
    );
  }

  async function updateMany(filter: Partial<T>, objectFields: Partial<T>) {
    updateFakeCollection(
      collection,
      collection.map((item) => {
        const mustBeUpdated = keysOf<keyof T>(
          filter as Record<keyof T, any>,
        ).every((key) => filter[key] === item[key]);
        if (mustBeUpdated) {
          return { ...item, ...objectFields };
        } else {
          return item;
        }
      }),
    );
  }

  async function upsert(newObject: T) {
    if (
      collection.some((object) =>
        idModule.lib.equalId(object._id, newObject._id),
      )
    ) {
      await updateOne(newObject._id, newObject);
    } else {
      await insert(newObject);
    }
  }
}

function updateFakeCollection<T>(collection: T[], newCollection: T[]) {
  while (collection.length) {
    collection.pop();
  }

  for (let index = 0; index < newCollection.length; index++) {
    collection.push(newCollection[index]);
  }
}

function projectFakeObjects<T, projectionT extends keyof T>(
  object: T,
  projections: Array<projectionT>,
): projectedType<T, projectionT> {
  const projectedObject = {} as projectedType<T, projectionT>;

  projections.forEach(
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    (projection) => ((projectedObject as any)[projection] = object[projection]),
  );

  return projectedObject;
}
