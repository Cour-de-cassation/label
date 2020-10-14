import { useState } from 'react';
import { annotatorStateType } from './annotatorStateType';
import { buildAnnotatorStateCommitter } from './buildAnnotatorStateCommitter';

export { useAnnotatorState };

export type { annotatorStateHandlerType };

type annotatorStateHandlerType = {
  get: () => annotatorStateType;
  set: (nextAnnotatorState: annotatorStateType) => void;
  revert: () => void;
  restore: () => void;
  reinitialize: () => void;
};

let annotatorStateCommitter = buildAnnotatorStateCommitter();

function useAnnotatorState(
  initialAnnotatorState: annotatorStateType,
): { annotatorStateHandler: annotatorStateHandlerType } {
  const [annotatorState, setAnnotatorState] = useState(initialAnnotatorState);

  return {
    annotatorStateHandler: {
      get: () => annotatorState,
      set: setAnnotatorStateAndCommitChange,
      revert: revertAnnotatorState,
      restore: restoreAnnotatorState,
      reinitialize: reinitializeAnnotatorState,
    },
  };

  function setAnnotatorStateAndCommitChange(newAnnotatorState: annotatorStateType) {
    annotatorStateCommitter.commit(annotatorState, newAnnotatorState);
    setAnnotatorState(newAnnotatorState);
  }

  function revertAnnotatorState() {
    const newAnnotatorState = annotatorStateCommitter.revert(annotatorState);
    setAnnotatorState(newAnnotatorState);
  }

  function restoreAnnotatorState() {
    const newAnnotatorState = annotatorStateCommitter.restore(annotatorState);
    setAnnotatorState(newAnnotatorState);
  }

  function reinitializeAnnotatorState() {
    annotatorStateCommitter = buildAnnotatorStateCommitter();
    setAnnotatorState(initialAnnotatorState);
  }
}
