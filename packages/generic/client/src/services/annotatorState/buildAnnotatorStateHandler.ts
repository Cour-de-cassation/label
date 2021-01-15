import { annotationsDiffType } from '@label/core';
import { annotatorStateType } from './annotatorStateType';
import { annotatorStateCommitterType } from './buildAnnotatorStateCommitter';

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
  committer: annotatorStateCommitterType,
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
    committer.commit(annotatorState, newAnnotatorState);
    setAnnotatorState(newAnnotatorState);
  }

  function revertAnnotatorState() {
    const newAnnotatorState = committer.revert(annotatorState);
    setAnnotatorState(newAnnotatorState);
  }

  function restoreAnnotatorState() {
    const newAnnotatorState = committer.restore(annotatorState);
    setAnnotatorState(newAnnotatorState);
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
