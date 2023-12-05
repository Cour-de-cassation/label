import { annotationType } from '../../../modules/annotation';
import { settingsType } from '../../../modules/settings';
import { buildSpecifierGenerator } from './buildSpecifierGenerator';
import { buildAnonymizationTextGenerator } from './buildAnonymizationTextGenerator';
import { ANONYMIZATION_DEFAULT_TEXT } from './constants';
import { uniqBy } from 'lodash';

export { buildEntityIdMapper };

function buildEntityIdMapper(
  settings: settingsType,
  annotations: annotationType[],
  seed: number,
): Record<string, string> {
  const sortedAnnotations = uniqBy(annotations, 'entityId').sort((annotationA, annotationB) => {
    return annotationA.text.localeCompare(annotationB.text);
  });
  const specifierGenerator = buildSpecifierGenerator(sortedAnnotations, seed);

  return sortedAnnotations.reduce((accumulator, annotation) => {
    const anonymization = settings[annotation.category]?.anonymization || ANONYMIZATION_DEFAULT_TEXT;
    const anonymizationTextGenerator = buildAnonymizationTextGenerator(anonymization, specifierGenerator);
    const anonymizationText = anonymizationTextGenerator.generate(annotation);

    return {
      ...accumulator,
      [annotation.entityId]: anonymizationText,
    };
  }, {});
}
