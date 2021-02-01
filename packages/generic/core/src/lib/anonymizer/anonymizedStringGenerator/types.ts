export type { anonymizedGeneratorType, formatSpecifierType, specifierType };

type anonymizedGeneratorType = {
  generate: () => string;
};

type formatSpecifierType = {
  index: number;
  specifier: specifierType;
  value: anonymizedGeneratorType;
};

type specifierType = '%c' | '%d';
