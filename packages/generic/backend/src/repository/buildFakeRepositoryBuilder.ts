import { repositoryType } from './repositoryType';

export { buildFakeRepositoryBuilder };

function buildFakeRepositoryBuilder<T, U>({
  buildCustomFakeRepository,
}: {
  buildCustomFakeRepository: (collection: T[]) => U;
}): () => repositoryType<T> & U {
  const collection: T[] = [];
  const customRepository = buildCustomFakeRepository(collection);

  return () => ({
    clear,
    findAll,
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

  async function insert(newObject: T) {
    collection.push(newObject);
    return { success: true };
  }
}
