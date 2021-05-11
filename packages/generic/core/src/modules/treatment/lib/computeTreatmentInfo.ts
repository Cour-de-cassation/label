import { groupBy } from 'lodash';
import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { treatmentType } from '../treatmentType';

export { computeTreatmentInfo };

export type { treatmentInfoType };

type treatmentInfoType = {
  additionsCount: number;
  deletionsCount: number;
  modificationsCount: number;
  resizedBiggerCount: number;
  resizedSmallerCount: number;
};

function computeTreatmentInfo(treatment: treatmentType) {
  const {
    addedAnnotations,
    categoryChangedAnnotations,
    deletedAnnotations,
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
  } = annotationsDiffModule.lib.computeDetailsFromAnnotationsDiff(treatment.annotationsDiff);

  return {
    additionsCount: Object.values(
      groupBy(addedAnnotations, (annotation) =>
        annotationModule.lib.entityIdHandler.compute(annotation.category, annotation.text),
      ),
    ).length,
    deletionsCount: Object.values(
      groupBy(deletedAnnotations, (annotation) =>
        annotationModule.lib.entityIdHandler.compute(annotation.category, annotation.text),
      ),
    ).length,
    modificationsCount: Object.values(
      groupBy(
        categoryChangedAnnotations,
        ([previousAnnotation, nextAnnotation]) =>
          `${annotationModule.lib.entityIdHandler.compute(
            previousAnnotation.category,
            previousAnnotation.text,
          )}_${annotationModule.lib.entityIdHandler.compute(nextAnnotation.category, nextAnnotation.text)}`,
      ),
    ).length,
    resizedBiggerCount: Object.values(
      groupBy(
        resizedBiggerAnnotations,
        ([previousAnnotation, nextAnnotation]) =>
          `${annotationModule.lib.entityIdHandler.compute(
            previousAnnotation.category,
            previousAnnotation.text,
          )}_${annotationModule.lib.entityIdHandler.compute(nextAnnotation.category, nextAnnotation.text)}`,
      ),
    ).length,
    resizedSmallerCount: Object.values(
      groupBy(
        resizedSmallerAnnotations,
        ([previousAnnotation, nextAnnotation]) =>
          `${annotationModule.lib.entityIdHandler.compute(
            previousAnnotation.category,
            previousAnnotation.text,
          )}_${annotationModule.lib.entityIdHandler.compute(nextAnnotation.category, nextAnnotation.text)}`,
      ),
    ).length,
  };
}
