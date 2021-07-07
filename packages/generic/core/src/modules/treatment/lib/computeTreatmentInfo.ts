import { groupBy } from 'lodash';
import { settingsType } from '../../settings';
import { annotationsDiffModule } from '../../annotationsDiff';
import { treatmentType } from '../treatmentType';

export { computeTreatmentInfo };

export type { treatmentInfoType };

type treatmentInfoType = {
  surAnnotationsCompleteCount: number;
  surAnnotationsPartialCount: number;
  subAnnotationsCompleteCount: number;
  subAnnotationsPartialCount: number;
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
      sensitive: Object.keys(
        groupBy(
          addedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !!settings[annotation.category].isSensitive,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
      other: Object.keys(
        groupBy(
          addedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !settings[annotation.category].isSensitive,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
    },
    deletionsCount: {
      anonymised: Object.keys(
        groupBy(
          deletedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !!settings[annotation.category].isAnonymized,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
      other: Object.keys(
        groupBy(
          deletedAnnotations.filter(
            (annotation) => !!settings[annotation.category] && !settings[annotation.category].isAnonymized,
          ),
          (annotation) => annotation.entityId,
        ),
      ).length,
    },
    modificationsCount: {
      nonAnonymisedToSensitive: Object.keys(
        groupBy(
          categoryChangedAnnotations.filter(
            ([previousAnnotation, nextAnnotation]) =>
              !!settings[previousAnnotation.category] &&
              !!settings[nextAnnotation.category] &&
              !settings[previousAnnotation.category].isAnonymized &&
              settings[nextAnnotation.category].isSensitive,
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
      anonymisedToNonAnonymised: Object.keys(
        groupBy(
          categoryChangedAnnotations.filter(
            ([previousAnnotation, nextAnnotation]) =>
              !!settings[previousAnnotation.category] &&
              !!settings[nextAnnotation.category] &&
              settings[previousAnnotation.category].isAnonymized &&
              !settings[nextAnnotation.category].isAnonymized,
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
      other: Object.keys(
        groupBy(
          categoryChangedAnnotations.filter(
            ([previousAnnotation, nextAnnotation]) =>
              !!settings[previousAnnotation.category] &&
              !!settings[nextAnnotation.category] &&
              !(!settings[previousAnnotation.category].isAnonymized && settings[nextAnnotation.category].isSensitive) &&
              !(
                !settings[previousAnnotation.category].isAnonymized && !!settings[nextAnnotation.category].isAnonymized
              ),
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
    },
    resizedBiggerCount: {
      sensitive: Object.keys(
        groupBy(
          resizedBiggerAnnotations.filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, targetAnnotation]) =>
              !!settings[targetAnnotation.category] && !!settings[targetAnnotation.category].isSensitive,
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
      other: Object.keys(
        groupBy(
          resizedBiggerAnnotations.filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, targetAnnotation]) =>
              !!settings[targetAnnotation.category] && !settings[targetAnnotation.category].isSensitive,
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
    },
    resizedSmallerCount: {
      anonymised: Object.keys(
        groupBy(
          resizedSmallerAnnotations.filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, targetAnnotation]) =>
              !!settings[targetAnnotation.category] && !!settings[targetAnnotation.category].isAnonymized,
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
      other: Object.keys(
        groupBy(
          resizedSmallerAnnotations.filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, targetAnnotation]) =>
              !!settings[targetAnnotation.category] && !settings[targetAnnotation.category].isAnonymized,
          ),
          ([previousAnnotation, nextAnnotation]) => `${previousAnnotation.entityId}_${nextAnnotation.entityId}`,
        ),
      ).length,
    },
  };
}
