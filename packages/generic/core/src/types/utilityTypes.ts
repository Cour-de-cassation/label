export type { filterKeysType, filterType, writeableType };

type filterKeysType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

type filterType<T, U> = { [key in filterKeysType<T, U>]: T[key] };

type writeableType<T> = { -readonly [P in keyof T]: T[P] };
