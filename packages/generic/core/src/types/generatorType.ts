export type { generatorType };

type generatorType<T> = {
  generate: (defaults?: Partial<T>) => T;
};
