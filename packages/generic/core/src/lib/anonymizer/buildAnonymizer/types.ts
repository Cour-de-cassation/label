export type { formatSpecifierType, specifierGeneratorType, specifierType };

type specifierType = '%c' | '%d';

type formatSpecifierType = {
  index: number;
  specifier: specifierType;
};

type specifierGeneratorType = {
  '%c': { generate: (entityId: string) => string };
  '%d': { generate: () => string };
};
