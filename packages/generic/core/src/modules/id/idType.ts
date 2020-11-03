import { mongoIdType } from './utils';

export type { idType, omitIdType };

type idType = mongoIdType;

type omitIdType<T> = Omit<T, '_id'>;
