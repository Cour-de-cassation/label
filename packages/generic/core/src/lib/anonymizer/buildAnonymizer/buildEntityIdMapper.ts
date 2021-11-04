import { uniq } from 'lodash';
import { annotationModule } from '../../../modules/annotation';
import { settingsType } from '../../../modules/settings';
import { buildSpecifierGenerator } from './buildSpecifierGenerator';
import { buildAnonymizationTextGenerator } from './buildAnonymizationTextGenerator';
import { ANONYMIZATION_DEFAULT_TEXT } from './constants';

export { buildEntityIdMapper };

function buildEntityIdMapper(settings: settingsType, entityIds: string[], seed: number): Record<string, string> {
  const sortedEntityIds = uniq(entityIds).sort((entityIdA, entityIdB) => {
    const textA = annotationModule.lib.entityIdHandler.getText(entityIdA);
    const textB = annotationModule.lib.entityIdHandler.getText(entityIdB);
    return textA.localeCompare(textB);
  });
  const specifierGenerator = buildSpecifierGenerator(sortedEntityIds, seed);

  return sortedEntityIds.reduce((accumulator, entityId) => {
    const category = annotationModule.lib.entityIdHandler.getCategory(entityId);
    const anonymization = settings[category]?.anonymization || ANONYMIZATION_DEFAULT_TEXT;
    const anonymizationTextGenerator = buildAnonymizationTextGenerator(anonymization, specifierGenerator);
    const anonymizationText = anonymizationTextGenerator.generate(entityId);

    return {
      ...accumulator,
      [entityId]: anonymizationText,
    };
  }, {});
}
