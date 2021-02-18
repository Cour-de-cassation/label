import { idModule, idType } from '@label/core';
import { repositoryType } from './repositoryType';

export { buildFakeRepositoryBuilder, updateFakeCollection };

function buildFakeRepositoryBuilder<T extends { _id: idType }, U>({
  buildCustomFakeRepository,
}: {
  buildCustomFakeRepository: (collection: T[]) => U;
}): () => repositoryType<T> & U {
  const collection: T[] = [];
  const customRepository = buildCustomFakeRepository(collection);

  return () => ({
    clear,
    findAll,
    findAllByIds,
    findById,
    insert,
    ...customRepository,
  });

  async function clear() {
    while (collection.length) {
      collection.pop();
    }
  }

  async function findAll() {
    return collection;
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
    return items.reduce((accumulator, currentItem) => {
      const idString = idModule.lib.convertToString(currentItem._id);
      if (!!accumulator[idString]) {
        return accumulator;
      }
      const item = collection.find(({ _id }) =>
        idModule.lib.equalId(_id, currentItem._id),
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
    const result = collection.find((document) =>
      idModule.lib.equalId(document._id, id),
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
}

function updateFakeCollection<T>(collection: T[], newCollection: T[]) {
  while (collection.length) {
    collection.pop();
  }

  for (let index = 0; index < newCollection.length; index++) {
    collection.push(newCollection[index]);
  }
}
