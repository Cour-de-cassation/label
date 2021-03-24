import { idType } from '@label/core';

export type { repositoryType };

type repositoryType<T extends { _id: idType }> = {
  clear: () => Promise<void>;
  deleteManyByIds: (ids: idType[]) => Promise<void>;
  findAll: () => Promise<T[]>;
  findAllByIds: (idsToSearchIn?: idType[]) => Promise<Record<string, T>>;
  findById: (id: idType) => Promise<T>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
  setIndexes: () => Promise<void>;
};
