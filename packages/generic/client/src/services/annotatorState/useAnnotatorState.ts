import { useState } from 'react';
import { annotatorStateType } from './annotatorStateType';
import { annotatorStateCommitterType } from './buildAnnotatorStateCommitter';

export { useAnnotatorState };

export type { annotatorStateHandlerType };

type annotatorStateHandlerType = {
  get: () => annotatorStateType;
  set: (nextAnnotatorState: annotatorStateType) => void;
  revert: () => void;
  restore: () => void;
  canRevert: () => boolean;
  canRestore: () => boolean;
  reinitialize: () => void;
};

function useAnnotatorState(
  initialAnnotatorState: annotatorStateType,
  committer: annotatorStateCommitterType,
): { annotatorStateHandler: annotatorStateHandlerType } {
  const [annotatorState, setAnnotatorState] = useState(initialAnnotatorState);

  return {
    annotatorStateHandler: {
      get: () => annotatorState,
      set: setAnnotatorStateAndCommitChange,
      revert: revertAnnotatorState,
      restore: restoreAnnotatorState,
      canRevert: canRevertAnnotatorState,
      canRestore: canRestoreAnnotatorState,
      reinitialize: reinitializeAnnotatorState,
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
    setAnnotatorState(initialAnnotatorState);
  }

  function canRevertAnnotatorState() {
    return committer.canRevert();
  }

  function canRestoreAnnotatorState() {
    return committer.canRestore();
  }
}
