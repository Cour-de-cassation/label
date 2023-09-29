import { annotationType } from '../../../modules';

export type { formatSpecifierType, specifierGeneratorType, specifierType };

type specifierType = '%c' | '%d';

type formatSpecifierType = {
  index: number;
  specifier: specifierType;
};

type specifierGeneratorType = {
  '%c': { generate: (annotation: annotationType) => string };
  '%d': { generate: () => string };
};
