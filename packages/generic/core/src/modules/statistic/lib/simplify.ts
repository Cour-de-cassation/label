import { statisticType } from '../statisticType';

export { simplify };

function simplify({
  addedAnnotationsCount,
  deletedAnnotationsCount,
  resizedBiggerAnnotationsCount,
  resizedSmallerAnnotationsCount,
  modifiedAnnotationsCount,
}: Pick<
  statisticType,
  | 'addedAnnotationsCount'
  | 'deletedAnnotationsCount'
  | 'resizedBiggerAnnotationsCount'
  | 'resizedSmallerAnnotationsCount'
  | 'modifiedAnnotationsCount'
>) {
  return {
    surAnnotationsCount:
      deletedAnnotationsCount.anonymised +
      modifiedAnnotationsCount.anonymisedToNonAnonymised +
      resizedSmallerAnnotationsCount.anonymised,
    subAnnotationsSensitiveCount:
      addedAnnotationsCount.sensitive +
      modifiedAnnotationsCount.nonAnonymisedToSensitive +
      resizedBiggerAnnotationsCount.sensitive,
    subAnnotationsNonSensitiveCount: addedAnnotationsCount.other + resizedBiggerAnnotationsCount.other,
  };
}
