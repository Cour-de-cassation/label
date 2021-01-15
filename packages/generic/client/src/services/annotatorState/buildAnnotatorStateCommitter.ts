import { annotationType, annotationsDiffModule, annotationsDiffType } from '@label/core';
import { annotatorStateType } from './annotatorStateType';

export { buildAnnotatorStateCommitter };

export type { annotatorStateCommitterType };

type annotatorStateCommitterType = {
  clean: () => void;
  commit: (previousState: annotatorStateType, nextState: annotatorStateType) => void;
  revert: (previousState: annotatorStateType) => annotatorStateType;
  restore: (previousState: annotatorStateType) => annotatorStateType;
  canRevert: () => boolean;
  canRestore: () => boolean;
  squash: () => annotationsDiffType;
};

function buildAnnotatorStateCommitter(): annotatorStateCommitterType {
  let annotationActionsToRevert: annotationsDiffType[] = [];
  let annotationActionsToRestore: annotationsDiffType[] = [];

  return {
    clean,
    commit,
    revert,
    restore,
    canRevert,
    canRestore,
    squash,
  };

  function clean() {
    annotationActionsToRevert = [];
    annotationActionsToRestore = [];
  }

  function commit(previousState: annotatorStateType, nextState: annotatorStateType) {
    const annotationAction = getDiffBetweenAnnotationsStates(previousState.annotations, nextState.annotations);
    annotationActionsToRevert.push(annotationAction);
    annotationActionsToRestore = [];
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
    previousAnnotationsState: annotationType[],
    nextAnnotationsState: annotationType[],
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
    previousAnnotationsState: annotationType[],
    previousAnnotationActions: annotationsDiffType[],
    nextAnnotationActions: annotationsDiffType[],
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

  function inverseAnnotationAction(annotationAction: annotationsDiffType) {
    return {
      before: annotationAction.after,
      after: annotationAction.before,
    };
  }

  function squash() {
    return annotationsDiffModule.lib.squash(annotationActionsToRevert);
  }
}
