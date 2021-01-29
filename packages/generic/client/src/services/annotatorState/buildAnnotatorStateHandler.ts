import { annotationsDiffType } from '@label/core';
import { annotatorStateType } from './annotatorStateType';
import { annotationsCommitterType } from './buildAnnotationsCommitter';

export { buildAnnotatorStateHandler };

export type { annotatorStateHandlerType };

type annotatorStateHandlerType = {
  get: () => annotatorStateType;
  set: (nextAnnotatorState: annotatorStateType) => void;
  revert: () => void;
  restore: () => void;
  canRevert: () => boolean;
  canRestore: () => boolean;
  reinitialize: () => void;
  getGlobalAnnotationsDiff: () => annotationsDiffType;
};

function buildAnnotatorStateHandler(
  annotatorState: annotatorStateType,
  setAnnotatorState: (annotatortState: annotatorStateType) => void,
  resetAnnotatorState: () => void,
  committer: annotationsCommitterType,
): { annotatorStateHandler: annotatorStateHandlerType } {
  return {
    annotatorStateHandler: {
      get: () => annotatorState,
      set: setAnnotatorStateAndCommitChange,
      revert: revertAnnotatorState,
      restore: restoreAnnotatorState,
      canRevert: canRevertAnnotatorState,
      canRestore: canRestoreAnnotatorState,
      reinitialize: reinitializeAnnotatorState,
      getGlobalAnnotationsDiff,
    },
  };

  function setAnnotatorStateAndCommitChange(newAnnotatorState: annotatorStateType) {
    committer.commit(annotatorState.annotations, newAnnotatorState.annotations);
    setAnnotatorState(newAnnotatorState);
  }

  function revertAnnotatorState() {
    const newAnnotations = committer.revert(annotatorState.annotations);
    setAnnotatorState({
      ...annotatorState,
      annotations: newAnnotations,
    });
  }

  function restoreAnnotatorState() {
    const newAnnotations = committer.restore(annotatorState.annotations);
    setAnnotatorState({
      ...annotatorState,
      annotations: newAnnotations,
    });
  }

  function reinitializeAnnotatorState() {
    committer.clean();
    resetAnnotatorState();
  }

  function canRevertAnnotatorState() {
    return committer.canRevert();
  }

  function canRestoreAnnotatorState() {
    return committer.canRestore();
  }

  function getGlobalAnnotationsDiff() {
    return committer.squash();
  }
}
