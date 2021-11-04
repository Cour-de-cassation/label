import { annotationModule } from '../../../modules/annotation';
import { buildAvailableCharactersMapper } from './buildAvailableCharactersMapper';
import { buildEntityIdOrderMapper } from './buildEntityIdOrderMapper';
import { specifierGeneratorType } from './types';

export { buildSpecifierGenerator };

function buildSpecifierGenerator(entityIds: string[], seed: number) {
  let currentNumber = 1;
  const availableCharactersMapper = buildAvailableCharactersMapper(entityIds, seed);
  const entityIdOrderMapper = buildEntityIdOrderMapper(entityIds);

  return {
    '%c': {
      generate: (entityId: string) => {
        const category = annotationModule.lib.entityIdHandler.getCategory(entityId);
        const orderInCategory = entityIdOrderMapper[entityId];
        const specifierValue = availableCharactersMapper[category][orderInCategory];
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
