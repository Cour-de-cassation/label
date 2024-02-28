export type { generatorType, generatorDecisionMetadataType };

type generatorType<T> = {
  generate: (defaults?: Partial<T>) => T;
};

type generatorDecisionMetadataType<T> = {
  generate: (defaults?: Partial<T>) => T;
};
