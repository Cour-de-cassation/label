import { repositoryType } from './repositoryType';

export { buildFakeRepositoryBuilder };

function buildFakeRepositoryBuilder<T, U>({
  buildCustomFakeRepository,
}: {
  buildCustomFakeRepository: (collection: T[]) => U;
}): () => repositoryType<T> & { reinitialize: () => void } & U {
  let collection: T[] = [];
  const customRepository = buildCustomFakeRepository(collection);

  return () => ({
    findAll,
    insert,
    ...customRepository,
    reinitialize: () => {
      collection = [];
    },
  });

  async function findAll() {
    return collection;
  }

  async function insert(newObject: T) {
    collection.push(newObject);
    return { success: true };
  }
}
