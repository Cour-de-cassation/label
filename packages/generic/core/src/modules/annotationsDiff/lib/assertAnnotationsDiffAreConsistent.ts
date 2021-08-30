import { annotationType } from '../../../modules/annotation';
import { settingsType } from '../../../modules/settings';
import { annotationsDiffType } from '../annotationsDiffType';
import { areAnnotationsDiffCompatibleWithPreviousAnnotations } from './areAnnotationsDiffCompatibleWithPreviousAnnotations';
import { areAnnotationsDiffCompatibleWithSettings } from './areAnnotationsDiffCompatibleWithSettings';
import { areAnnotationsDiffAutoConsistent } from './areAnnotationsDiffAutoConsistent';

export { assertAnnotationsDiffAreConsistent };

function assertAnnotationsDiffAreConsistent(
  annotationsDiff: annotationsDiffType,
  { previousAnnotations, settings }: { previousAnnotations: annotationType[]; settings: settingsType },
  actionToPerform: string,
) {
  if (!areAnnotationsDiffCompatibleWithPreviousAnnotations(previousAnnotations, annotationsDiff)) {
    throw new Error(`Could not ${actionToPerform}: new annotations are inconsistent with the previous ones`);
  }

  if (!areAnnotationsDiffAutoConsistent(annotationsDiff)) {
    throw new Error(`Could not ${actionToPerform}: new annotations overlap with themselves`);
  }

  if (!areAnnotationsDiffCompatibleWithSettings(annotationsDiff, settings)) {
    throw new Error(`Could not ${actionToPerform}: using a category that is not in the settings`);
  }
}
