export { buildFakeRepositoryBuilder };

function buildFakeRepositoryBuilder<T, U>(
  buildFakeRepository: (collection: T[]) => U,
) {
  let collection: T[] = [];
  const repository = buildFakeRepository(collection);

  return () => ({
    ...repository,
    reinitialize: () => (collection = []),
  });
}
