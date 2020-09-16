export { fakeRepositoryType };

type fakeRepositoryType<T> = T & { reinitialize: () => void };
