import { idType } from '@label/core';

export type { projectedType, repositoryType };

type repositoryType<T extends { _id: idType }> = {
  clear: () => Promise<void>;
  deleteById: (_id: idType) => Promise<void>;
  deleteManyByIds: (
    ids: idType[],
  ) => Promise<{ success: boolean; count: number }>;
  distinct: <fieldNameT extends keyof T>(
    fieldName: fieldNameT,
  ) => Promise<Array<T[fieldNameT]>>;
  distinctNested: <fieldT>(fieldNameNested: string) => Promise<Array<fieldT>>;
  findAll: () => Promise<T[]>;
  findAllProjection: <projectionT extends keyof T>(
    projection: Array<projectionT>,
  ) => Promise<Array<projectedType<T, projectionT>>>;
  findAllByIds: (idsToSearchIn?: idType[]) => Promise<Record<string, T>>;
  findById: (id: idType) => Promise<T>;
  insert: (newObject: T) => Promise<{ success: boolean }>;
  insertMany: (newObjects: T[]) => Promise<void>;
  deletePropertiesForMany: (
    filter: Partial<T>,
    fieldNames: Array<string>,
  ) => Promise<void>;
  setIndexes: () => Promise<void>;
  updateOne: (id: idType, objectFields: Partial<T>) => Promise<T | undefined>;
  updateMany: (filter: Partial<T>, objectFields: Partial<T>) => Promise<void>;
  upsert: (newObject: T) => Promise<void>;
};

type projectedType<T, U extends keyof T> = Pick<T, U>;
