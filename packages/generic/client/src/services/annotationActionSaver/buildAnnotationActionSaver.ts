import { annotationType } from '@label/core';
import { annotationActionType } from './annotationActionType';

export { buildAnnotationActionSaver };

function buildAnnotationActionSaver() {
  const annotationActionsToRevert: annotationActionType[] = [];
  const annotationActionsToRestore: annotationActionType[] = [];

  return {
    appendAction,
    revertAction,
    restoreAction,
  };

  function appendAction(previousState: annotationType[], nextState: annotationType[]) {
    const annotationAction = getDiffBetweenStates(previousState, nextState);
    annotationActionsToRevert.push(annotationAction);
  }

  function revertAction(previousState: annotationType[]) {
    return applyAction(previousState, annotationActionsToRevert, annotationActionsToRestore);
  }

  function restoreAction(previousState: annotationType[]) {
    return applyAction(previousState, annotationActionsToRestore, annotationActionsToRevert);
  }

  function getDiffBetweenStates(previousState: annotationType[], nextState: annotationType[]) {
    const before = previousState.filter((previousStateAnnotation) => !nextState.includes(previousStateAnnotation));
    const after = nextState.filter((nextStateAnnotation) => !previousState.includes(nextStateAnnotation));
    return {
      before,
      after,
    };
  }

  function applyAction(
    previousState: annotationType[],
    previousAnnotationActions: annotationActionType[],
    nextAnnotationActions: annotationActionType[],
  ) {
    const previousAnnotationAction = previousAnnotationActions.pop();

    if (!previousAnnotationAction) {
      return previousState;
    }

    const nextState = previousState.filter((annotation) => !previousAnnotationAction.after.includes(annotation));
    nextState.push(...previousAnnotationAction.before);
    nextAnnotationActions.push(inverseAction(previousAnnotationAction));

    return nextState;
  }

  function inverseAction(annotationAction: annotationActionType) {
    return {
      before: annotationAction.after,
      after: annotationAction.before,
    };
  }
}
