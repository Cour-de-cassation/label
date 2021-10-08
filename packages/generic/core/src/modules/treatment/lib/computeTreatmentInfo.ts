import { uniq } from 'lodash';
import { annotationModule } from '../../../modules/annotation';
import { settingsType } from '../../settings';
import { treatmentType } from '../treatmentType';

export { computeTreatmentInfo };

export type { treatmentInfoType };

type treatmentInfoType = {
  surAnnotationsCount: number;
  subAnnotationsSensitiveCount: number;
  subAnnotationsNonSensitiveCount: number;
};

function computeTreatmentInfo(treatment: treatmentType, settings: settingsType): treatmentInfoType {
  const treatmentInfoEntities = {
    surAnnotationsEntities: [] as string[],
    subAnnotationsNonSensitiveEntities: [] as string[],
    subAnnotationsSensitiveEntities: [] as string[],
  };

  treatment.annotationsDiff.before.forEach((beforeAnnotation) => {
    if (settings[beforeAnnotation.category]?.isAnonymized) {
      const afterAnnotationContainingBeforeAnnotation = treatment.annotationsDiff.after.find((afterAnnotation) => {
        const inclusion = annotationModule.lib.areAnnotationsIncluded(beforeAnnotation, afterAnnotation);
        return inclusion !== undefined && inclusion <= 0;
      });
      if (
        (!afterAnnotationContainingBeforeAnnotation &&
          !annotationModule.lib.isAnnotationTextInAnnotations(beforeAnnotation, treatment.annotationsDiff.after)) ||
        (afterAnnotationContainingBeforeAnnotation &&
          !settings[afterAnnotationContainingBeforeAnnotation.category]?.isAnonymized)
      ) {
        treatmentInfoEntities.surAnnotationsEntities.push(beforeAnnotation.entityId);
      }
    }
  });

  treatment.annotationsDiff.after.forEach((afterAnnotation) => {
    const beforeAnnotationContainingAfterAnnotation = treatment.annotationsDiff.before.find((beforeAnnotation) => {
      const inclusion = annotationModule.lib.areAnnotationsIncluded(beforeAnnotation, afterAnnotation);
      return inclusion !== undefined && inclusion >= 0;
    });
    if (settings[afterAnnotation.category].isSensitive) {
      if (
        (!beforeAnnotationContainingAfterAnnotation &&
          !annotationModule.lib.isAnnotationTextInAnnotations(afterAnnotation, treatment.annotationsDiff.before)) ||
        (beforeAnnotationContainingAfterAnnotation &&
          !settings[beforeAnnotationContainingAfterAnnotation.category]?.isAnonymized)
      ) {
        treatmentInfoEntities.subAnnotationsSensitiveEntities.push(afterAnnotation.entityId);
      }
    } else if (settings[afterAnnotation.category]?.isAnonymized) {
      if (
        !beforeAnnotationContainingAfterAnnotation ||
        !settings[beforeAnnotationContainingAfterAnnotation.category]?.isAnonymized
      ) {
        treatmentInfoEntities.subAnnotationsNonSensitiveEntities.push(afterAnnotation.entityId);
      }
    }
  });

  return {
    surAnnotationsCount: uniq(treatmentInfoEntities.surAnnotationsEntities).length,
    subAnnotationsSensitiveCount: uniq(treatmentInfoEntities.subAnnotationsSensitiveEntities).length,
    subAnnotationsNonSensitiveCount: uniq(treatmentInfoEntities.subAnnotationsNonSensitiveEntities).length,
  };
}
