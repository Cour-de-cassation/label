import { countBy } from 'lodash';
import { annotationModule } from '../../../modules/annotation';
import { buildAvailableCharacters } from './buildAvailableCharacters';
import { FORBIDDEN_CHARACTERS } from './buildCharacterList';
import { convertTextIntoCharCode } from './convertTextIntoCharCode';
import { shuffleCharacterLists } from './shuffleCharacterLists';

export { buildAvailableCharactersMapper };

const DEFAULT_MAX_DISTINCT_REPLACEMENT_CHARACTERS = 26 - FORBIDDEN_CHARACTERS.length;

function buildAvailableCharactersMapper(entityIds: string[], seed: number) {
  const entityIdsByCategoryCount = countBy(entityIds, annotationModule.lib.entityIdHandler.getCategory);
  return Object.keys(entityIdsByCategoryCount).reduce((accumulator, category) => {
    const entityIdsCount = entityIdsByCategoryCount[category];
    const availableCharacters = buildAvailableCharacters(
      Math.max(entityIdsCount, DEFAULT_MAX_DISTINCT_REPLACEMENT_CHARACTERS),
    );
    const compoundSeed = seed * convertTextIntoCharCode(category);
    return {
      ...accumulator,
      [category]: shuffleCharacterLists(availableCharacters, compoundSeed),
    };
  }, {} as Record<string, string[]>);
}
