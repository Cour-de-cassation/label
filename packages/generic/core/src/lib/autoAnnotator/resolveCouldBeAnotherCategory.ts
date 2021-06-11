import { annotationModule, annotationType } from '../../modules/annotation';
import { settingsType } from '../../modules/settings';
import { stringComparator } from '../stringComparator';

export { resolveCouldBeAnotherCategory };

function resolveCouldBeAnotherCategory(
  annotation: annotationType,
  annotations: annotationType[],
  settings: settingsType,
): annotationType {
  const couldBe = settings[annotation.category]?.couldBe;

  if (!couldBe) {
    return annotation;
  }

  if (
    annotations.some(
      (anotherAnnotation) =>
        anotherAnnotation.category === couldBe &&
        stringComparator.insensitiveEqual(anotherAnnotation.text, annotation.text),
    )
  ) {
    return {
      ...annotation,
      category: couldBe,
      entityId: annotationModule.lib.entityIdHandler.compute(couldBe, annotation.text),
    };
  } else {
    return annotation;
  }
}
