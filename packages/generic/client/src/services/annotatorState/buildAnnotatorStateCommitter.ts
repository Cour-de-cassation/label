import { fetchedAnnotationType } from '@label/core';
import { annotatorStateType, annotationActionType } from './annotatorStateType';

export { buildAnnotatorStateCommitter };

export type { annotatorStateCommitterType };

type annotatorStateCommitterType = {
  commit: (previousState: annotatorStateType, nextState: annotatorStateType) => void;
  revert: (previousState: annotatorStateType) => annotatorStateType;
  restore: (previousState: annotatorStateType) => annotatorStateType;
  canRevert: () => boolean;
  canRestore: () => boolean;
};

function buildAnnotatorStateCommitter(): annotatorStateCommitterType {
  const annotationActionsToRevert: annotationActionType[] = [];
  const annotationActionsToRestore: annotationActionType[] = [];

  return {
    commit,
    revert,
    restore,
    canRevert,
    canRestore,
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

  function canRevert() {
    return annotationActionsToRevert.length > 0;
  }

  function canRestore() {
    return annotationActionsToRestore.length > 0;
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
