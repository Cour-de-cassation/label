import { annotationModule, annotationType } from '../../annotation';
import { annotationsDiffType } from '../annotationsDiffType';

export { assertAnnotationsDiffCompatibleWithAvailableCategories };

function assertAnnotationsDiffCompatibleWithAvailableCategories(
  annotationsDiff: annotationsDiffType,
  availableCategories: string[],
  actionToPerform?: string,
) {
  const uncompatibleAnnotation = annotationsDiff.after.find(isUncompatibleWithAvailableCategories);
  if (uncompatibleAnnotation) {
    const errorMessage = computeErrorMessage(uncompatibleAnnotation);
    throw new Error(errorMessage);
  }
  return true;

  function isUncompatibleWithAvailableCategories(annotation: annotationType) {
    return !availableCategories.includes(annotation.category);
  }

  function computeErrorMessage(annotation: annotationType) {
    return `${actionToPerform ? `Could not ${actionToPerform}: ` : ''}${annotationModule.lib.stringify(annotation, {
      displayEntityId: true,
    })} category is not in availableCategories: [${availableCategories.join(', ')}]`;
  }
}
