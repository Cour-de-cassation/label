import { groupBy } from 'lodash';
import { settingsType } from '../../settings';
import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { treatmentType } from '../treatmentType';

export { computeTreatmentInfo };

export type { treatmentInfoType };

type treatmentInfoType = {
  additionsCount: { sensitive: number; other: number };
  deletionsCount: { anonymised: number; other: number };
  modificationsCount: number;
  resizedBiggerCount: number;
  resizedSmallerCount: number;
};

function computeTreatmentInfo(treatment: treatmentType, settings: settingsType) {
  const {
    addedAnnotations,
    categoryChangedAnnotations,
    deletedAnnotations,
    resizedBiggerAnnotations,
    resizedSmallerAnnotations,
  } = annotationsDiffModule.lib.computeDetailsFromAnnotationsDiff(treatment.annotationsDiff);

  return {
    additionsCount: {
      sensitive: Object.values(
        groupBy(
          addedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !!settings[annotation.category].isSensitive,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
      other: Object.values(
        groupBy(
          addedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !settings[annotation.category].isSensitive,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
    },
    deletionsCount: {
      anonymised: Object.values(
        groupBy(
          deletedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !!settings[annotation.category].isAnonymized,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
      other: Object.values(
        groupBy(
          deletedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !settings[annotation.category].isAnonymized,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
    },
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
