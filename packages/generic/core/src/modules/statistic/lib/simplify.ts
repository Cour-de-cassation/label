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
    surAnnotationsCompleteCount:
      deletedAnnotationsCount.anonymised + modifiedAnnotationsCount.anonymisedToNonAnonymised,
    surAnnotationsPartialCount: resizedSmallerAnnotationsCount.anonymised,
    subAnnotationsCompleteCount: addedAnnotationsCount.sensitive + modifiedAnnotationsCount.nonAnonymisedToSensitive,
    subAnnotationsPartialCount: resizedBiggerAnnotationsCount.sensitive,
  };
}
