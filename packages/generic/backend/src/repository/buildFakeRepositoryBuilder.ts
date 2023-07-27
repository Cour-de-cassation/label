import { idModule, idType, indexer, keysOf } from '@label/core';
import { omit } from 'lodash';
import { repositoryType } from './repositoryType';
import { Document, Filter, WithId } from 'mongodb';

export { buildFakeRepositoryBuilder, updateFakeCollection };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
function buildFakeRepositoryBuilder<T extends Document, U>({
  buildCustomFakeRepository,
  collectionName,
}: {
  buildCustomFakeRepository: (collection: WithId<T>[]) => U;
  collectionName: string;
}): () => repositoryType<T> & U {
  const collection: WithId<T>[] = [];
  const customRepository = buildCustomFakeRepository(collection);

  return () => ({
    clear,
    deleteById,
    deleteManyByIds,
    distinct,
    distinctNested,
    findAll,
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
    return {
      success: true,
      count: ids.length,
    };
  }

  async function deletePropertiesForMany(
    filter: Filter<T>,
    fieldNames: Array<string>,
  ) {
    updateFakeCollection(
      collection,
      collection.map((item) => {
        const mustBeUpdated = keysOf<keyof WithId<T>>(
          filter as Record<keyof WithId<T>, any>,
        ).every((key) => filter[key] === item[key]);
        if (mustBeUpdated) {
          return omit(item, fieldNames);
        } else {
          return item;
        }
      }),
    );
  }

  async function distinct<fieldNameT extends keyof WithId<T>>(
    fieldName: fieldNameT,
  ) {
    const distinctValues = [] as Array<WithId<T>[fieldNameT]>;

    collection.forEach((item) => {
      if (
        distinctValues.every(
          (anotherValue) =>
            JSON.stringify(anotherValue) !== JSON.stringify(item[fieldName]),
        )
      ) {
        distinctValues.push(item[fieldName]);
      }
    });

    return distinctValues;
  }

  async function distinctNested<fieldT>(fieldNameNested: string) {
    const distinctValues = [] as Array<fieldT>;

    collection.forEach((item) => {
      const nestedValue = extractNestedField(item);
      if (
        !!nestedValue &&
        distinctValues.every((anotherValue) => anotherValue !== nestedValue)
      ) {
        distinctValues.push(nestedValue);
      }
    });

    return distinctValues;

    function extractNestedField(item: WithId<T>) {
      const fieldNames = fieldNameNested.split('.');
      return fieldNames.reduce((accumulator, fieldName) => {
        const nestedItem = (accumulator as any)[fieldName];
        if (!nestedItem) {
          return undefined;
        }
        return nestedItem;
      }, item as any) as fieldT | undefined;
    }
  }

  async function findAll() {
    return collection as WithId<T>[];
  }

  async function findAllByIds(idsToSearchIn?: idType[]) {
    let items = [] as WithId<T>[];
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

  async function insert(newObject: WithId<T>) {
    collection.push(newObject);
    return { success: true };
  }

  async function insertMany(newObjects: WithId<T>[]) {
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

    const updatedItem = collection.find((item) =>
      idModule.lib.equalId(id, item._id),
    );

    return updatedItem;
  }

  async function updateMany(filter: Filter<T>, objectFields: Partial<T>) {
    updateFakeCollection(
      collection,
      collection.map((item) => {
        const mustBeUpdated = keysOf<keyof WithId<T>>(
          filter as Record<keyof WithId<T>, any>,
        ).every((key) => filter[key] === item[key]);
        if (mustBeUpdated) {
          return { ...item, ...objectFields };
        } else {
          return item;
        }
      }),
    );
  }

  async function upsert(newObject: WithId<T>) {
    if (
      collection.some((object) =>
        idModule.lib.equalId(object._id, newObject._id),
      )
    ) {
      await updateOne(newObject._id, newObject as Partial<T>);
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
