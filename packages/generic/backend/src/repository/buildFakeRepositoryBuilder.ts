import { idModule, idType, indexer } from '@label/core';
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
    deleteManyByIds,
    findAll,
    findAllByIds,
    findById,
    insert,
    setIndexes,
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

  async function setIndexes() {}

  async function deleteManyByIds(ids: idType[]) {
    updateFakeCollection(
      collection,
      collection.filter(
        (item) => !ids.some((id) => idModule.lib.equalId(id, item._id)),
      ),
    );
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
