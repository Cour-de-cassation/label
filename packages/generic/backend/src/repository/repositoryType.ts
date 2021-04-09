import { idType } from '@label/core';

export type { projectedType, repositoryType };

type repositoryType<T extends { _id: idType }> = {
  clear: () => Promise<void>;
  deleteById: (_id: idType) => Promise<void>;
  deleteManyByIds: (ids: idType[]) => Promise<void>;
  findAll: () => Promise<T[]>;
  findAllByIds: (idsToSearchIn?: idType[]) => Promise<Record<string, T>>;
  findById: (id: idType) => Promise<T>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
  insertMany: (newObjects: T[]) => Promise<void>;
  setIndexes: () => Promise<void>;
  updateOne: (id: idType, objectFields: Partial<T>) => Promise<void>;
};

type projectedType<T, U extends keyof T> = Pick<T, U>;
