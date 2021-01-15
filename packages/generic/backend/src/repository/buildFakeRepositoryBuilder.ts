import { idModule, idType } from '@label/core';
import { repositoryType } from './repositoryType';

export { buildFakeRepositoryBuilder };

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

  async function findAllByIds(ids: idType[]) {
    return collection.filter((document) =>
      ids.some((id) => idModule.lib.equalId(id, document._id)),
    );
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
