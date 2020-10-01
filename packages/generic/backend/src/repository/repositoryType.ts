export type { repositoryType };

type repositoryType<T> = {
  clear: () => Promise<void>;
  findAll: () => Promise<T[]>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
};
