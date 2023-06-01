import { idType } from '@label/core';
import { Filter, WithId } from 'mongodb';

export type { projectedType, repositoryType };

type repositoryType<T> = {
  clear: () => Promise<void>;
  deleteById: (_id: idType) => Promise<void>;
  deleteManyByIds: (
    ids: idType[],
  ) => Promise<{ success: boolean; count: number }>;
  distinct: <fieldNameT extends keyof T>(
    fieldName: fieldNameT,
  ) => Promise<Array<T[fieldNameT]>>;
  distinctNested: <fieldT>(fieldNameNested: string) => Promise<Array<fieldT>>;
  findAll: () => Promise<WithId<T>[]>;
  findAllByIds: (idsToSearchIn?: idType[]) => Promise<Record<string, WithId<T>>>;
  findById: (id: idType) => Promise<WithId<T>>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
  insertMany: (newObjects: T[]) => Promise<void>;
  deletePropertiesForMany: (
    filter: Filter<T>,
    fieldNames: Array<string>,
  ) => Promise<void>;
  setIndexes: () => Promise<void>;
  updateOne: (id: idType, objectFields: Partial<T>) => Promise<WithId<T> | undefined>;
  updateMany: (filter: Partial<T>, objectFields: Partial<T>) => Promise<void>;
  upsert: (newObject: T) => Promise<void>;
};

type projectedType<T, U extends keyof T> = Pick<T, U>;
