export type { omitMongoIdType };

type omitMongoIdType<T> = Omit<T, "_id">;
