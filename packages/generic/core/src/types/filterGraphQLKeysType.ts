export type { filterGraphQLKeysType };

type filterKeysType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

type filterGraphQLKeysType<T> = filterKeysType<T, { graphQL: true }>;
