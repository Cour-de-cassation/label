export type { formatSpecifierType, specifierGeneratorType, specifierType };

type specifierType = '%c' | '%d';

type formatSpecifierType = {
  index: number;
  specifier: specifierType;
};

type specifierGeneratorType = Record<
  specifierType,
  {
    generate: (entityId: string) => string;
  }
>;
