import { annotationType } from '../../../modules/annotation';
import { settingsModule, settingsType } from '../../../modules/settings';
import { treatmentType } from '../../../modules/treatment';
import { annotationsDiffType } from '../annotationsDiffType';
import { assertAnnotationsDiffCompatibleWithPreviousAnnotations } from './assertAnnotationsDiffCompatibleWithPreviousAnnotations';
import { assertAnnotationsDiffCompatibleWithAvailableCategories } from './assertAnnotationsDiffCompatibleWithAvailableCategories';
import { assertAnnotationsDiffAutoConsistent } from './assertAnnotationsDiffAutoConsistent';

export { assertAnnotationsDiffAreConsistent };

function assertAnnotationsDiffAreConsistent(
  annotationsDiff: annotationsDiffType,
  {
    previousAnnotations,
    settings,
    treatmentSource,
  }: { previousAnnotations: annotationType[]; settings: settingsType; treatmentSource: treatmentType['source'] },
  actionToPerform: string,
) {
  assertAnnotationsDiffCompatibleWithPreviousAnnotations(previousAnnotations, annotationsDiff, actionToPerform);

  assertAnnotationsDiffAutoConsistent(annotationsDiff, actionToPerform);

  const availableCategoriesFilter = computeAvailableCategoriesFilter(treatmentSource);
  const availableCategories = settingsModule.lib.getCategories(settings, availableCategoriesFilter);

  assertAnnotationsDiffCompatibleWithAvailableCategories(annotationsDiff, availableCategories, actionToPerform);
}

function computeAvailableCategoriesFilter(treatmentSource: treatmentType['source']) {
  const status = ['visible', 'alwaysVisible', 'annotable'] as settingsType[string]['status'][];
  let canBeAnnotatedBy: 'human' | 'NLP';
  switch (treatmentSource) {
    case 'NLP':
      canBeAnnotatedBy = 'NLP';
      break;
    case 'postProcess':
      canBeAnnotatedBy = 'human';
      break;
    case 'admin':
      canBeAnnotatedBy = 'human';
      break;
    case 'annotator':
      canBeAnnotatedBy = 'human';
      break;
    case 'supplementaryAnnotations':
      canBeAnnotatedBy = 'human';
      break;
  }
  return { status, canBeAnnotatedBy };
}
