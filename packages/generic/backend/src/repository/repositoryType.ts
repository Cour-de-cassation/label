import { idType } from '@label/core';

export type { repositoryType };

type repositoryType<T extends { _id: idType }> = {
  clear: () => Promise<void>;
  findAll: () => Promise<T[]>;
  findAllByIds: (ids: idType[]) => Promise<T[]>;
  findById: (id: idType) => Promise<T>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
};
