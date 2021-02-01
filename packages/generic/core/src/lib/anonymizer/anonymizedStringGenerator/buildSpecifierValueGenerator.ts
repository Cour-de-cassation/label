import { buildCharacterGenerator } from './buildCharacterGenerator';
import { buildNumberGenerator } from './buildNumberGenerator';

import { anonymizedGeneratorType, specifierType } from './types';

export { buildSpecifierValueGenerator };

function buildSpecifierValueGenerator(specifier: specifierType): anonymizedGeneratorType {
  switch (specifier) {
    case '%c':
      return buildCharacterGenerator();
    case '%d':
      return buildNumberGenerator();
  }
}
