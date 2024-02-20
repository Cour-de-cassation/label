export type { generatorType, generatorDecisionMetadatType };

type generatorType<T> = {
  generate: (defaults?: Partial<T>) => T;
};

type generatorDecisionMetadatType<T> = {
  generate: (defaults?: Partial<T>) => T;
};
