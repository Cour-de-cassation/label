import { fetchedAnnotationType } from '../../types';
import { annotatorStateType, annotationActionType } from './annotatorStateType';

export { buildAnnotatorStateCommitter };

export type { annotatorStateCommitterType };

type annotatorStateCommitterType = {
  commit: (previousState: annotatorStateType, nextState: annotatorStateType) => void;
  revert: (previousState: annotatorStateType) => annotatorStateType;
  restore: (previousState: annotatorStateType) => annotatorStateType;
};

function buildAnnotatorStateCommitter(): annotatorStateCommitterType {
  const annotationActionsToRevert: annotationActionType[] = [];
  const annotationActionsToRestore: annotationActionType[] = [];

  return {
    commit,
    revert,
    restore,
  };

  function commit(previousState: annotatorStateType, nextState: annotatorStateType) {
    const annotationAction = getDiffBetweenAnnotationsStates(previousState.annotations, nextState.annotations);
    annotationActionsToRevert.push(annotationAction);
  }

  function revert(previousState: annotatorStateType): annotatorStateType {
    return {
      ...previousState,
      annotations: applyAnnotationAction(
        previousState.annotations,
        annotationActionsToRevert,
        annotationActionsToRestore,
      ),
    };
  }

  function restore(previousState: annotatorStateType): annotatorStateType {
    return {
      ...previousState,
      annotations: applyAnnotationAction(
        previousState.annotations,
        annotationActionsToRestore,
        annotationActionsToRevert,
      ),
    };
  }

  function getDiffBetweenAnnotationsStates(
    previousAnnotationsState: fetchedAnnotationType[],
    nextAnnotationsState: fetchedAnnotationType[],
  ) {
    return {
      before: previousAnnotationsState.filter(
        (previousStateAnnotation) => !nextAnnotationsState.includes(previousStateAnnotation),
      ),
      after: nextAnnotationsState.filter(
        (nextStateAnnotation) => !previousAnnotationsState.includes(nextStateAnnotation),
      ),
    };
  }

  function applyAnnotationAction(
    previousAnnotationsState: fetchedAnnotationType[],
    previousAnnotationActions: annotationActionType[],
    nextAnnotationActions: annotationActionType[],
  ) {
    const previousAnnotationAction = previousAnnotationActions.pop();

    if (!previousAnnotationAction) {
      return previousAnnotationsState;
    }

    const nextAnnotationsState = previousAnnotationsState.filter(
      (annotation) => !previousAnnotationAction.after.includes(annotation),
    );
    nextAnnotationsState.push(...previousAnnotationAction.before);
    nextAnnotationActions.push(inverseAnnotationAction(previousAnnotationAction));

    return nextAnnotationsState;
  }

  function inverseAnnotationAction(annotationAction: annotationActionType) {
    return {
      before: annotationAction.after,
      after: annotationAction.before,
    };
  }
}
