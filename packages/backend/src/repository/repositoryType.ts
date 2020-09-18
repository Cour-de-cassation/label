export { repositoryType };

type repositoryType<T> = {
  findAll: () => Promise<T[]>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
};
