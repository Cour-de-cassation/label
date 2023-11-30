import { annotationType } from '../../../modules/annotation';
import { buildAvailableCharactersMapper } from './buildAvailableCharactersMapper';
import { buildEntityIdOrderMapper } from './buildEntityIdOrderMapper';
import { specifierGeneratorType } from './types';

export { buildSpecifierGenerator };

function buildSpecifierGenerator(annotations: annotationType[], seed: number) {
  let currentNumber = 1;
  const availableCharactersMapper = buildAvailableCharactersMapper(annotations, seed);
  const entityIdOrderMapper = buildEntityIdOrderMapper(annotations);

  return {
    '%c': {
      generate: (annotation: annotationType) => {
        const orderInCategory = entityIdOrderMapper[annotation.entityId];
        const specifierValue = availableCharactersMapper[annotation.category][orderInCategory];
        return specifierValue;
      },
    },
    '%d': {
      generate: () => {
        const specifierValue = currentNumber;
        currentNumber++;
        return `${specifierValue}`;
      },
    },
  } as specifierGeneratorType;
}
