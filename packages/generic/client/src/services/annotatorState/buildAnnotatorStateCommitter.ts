import { fetchedAnnotationType } from '@label/core';
import { annotatorStateType, annotationActionType } from './annotatorStateType';

export { buildAnnotatorStateCommitter };

export type { annotatorStateCommitterType };

type annotatorStateCommitterType = {
  commit: (previousState: annotatorStateType, nextState: annotatorStateType) => void;
  commitAndSquash: (previousState: annotatorStateType, nextState: annotatorStateType) => void;
  dropLastCommit: (previousState: annotatorStateType) => annotatorStateType;
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
    commitAndSquash,
    dropLastCommit,
    revert,
    restore,
    canRevert,
    canRestore,
  };

  function commit(previousState: annotatorStateType, nextState: annotatorStateType) {
    const annotationAction = getDiffBetweenAnnotationsStates(previousState.annotations, nextState.annotations);
    annotationActionsToRevert.push(annotationAction);
  }

  function commitAndSquash(previousState: annotatorStateType, nextState: annotatorStateType) {
    const annotationAction = getDiffBetweenAnnotationsStates(previousState.annotations, nextState.annotations);
    const lastActionCommitted = annotationActionsToRevert.pop();
    if (!lastActionCommitted) {
      annotationActionsToRevert.push(annotationAction);
      return;
    }
    const squashedAction = squashActions(lastActionCommitted, annotationAction);
    annotationActionsToRevert.push(squashedAction);
  }

  function dropLastCommit(previousState: annotatorStateType) {
    const newState = revert(previousState);
    annotationActionsToRestore.pop();
    return newState;
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

  function squashActions(firstAction: annotationActionType, secondAction: annotationActionType) {
    const before = [
      ...firstAction.before,
      ...secondAction.before.filter((annotation) => !firstAction.after.includes(annotation)),
    ];
    const after = [
      ...secondAction.after,
      ...firstAction.after.filter((annotation) => !secondAction.before.includes(annotation)),
    ];
    return { before, after };
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
