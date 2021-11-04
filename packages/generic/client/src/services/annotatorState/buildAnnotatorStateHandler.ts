import { annotationsDiffType } from '@label/core';
import { annotatorStateType } from './annotatorStateType';
import { annotationsCommitterType } from './buildAnnotationsCommitter';
import { autoSaverType } from './buildAutoSaver';
import { computeAnnotatorStateChecksum } from './computeAnnotatorStateChecksum';

export { buildAnnotatorStateHandler };

export type { annotatorStateHandlerType };

type annotatorStateHandlerType = {
  get: () => annotatorStateType;
  getChecksum: () => string;
  set: (nextAnnotatorState: annotatorStateType) => void;
  revert: () => void;
  restore: () => void;
  canRevert: () => boolean;
  canRestore: () => boolean;
  reinitialize: () => void;
};

function buildAnnotatorStateHandler({
  annotatorState,
  autoSaver,
  committer,
  resetAnnotatorState,
  setAnnotatorState,
}: {
  annotatorState: annotatorStateType;
  autoSaver: autoSaverType;
  committer: annotationsCommitterType;
  resetAnnotatorState: () => void;
  setAnnotatorState: (annotatorState: annotatorStateType) => void;
}): { annotatorStateHandler: annotatorStateHandlerType } {
  return {
    annotatorStateHandler: {
      get: () => annotatorState,
      getChecksum: () => computeAnnotatorStateChecksum(annotatorState),
      set: setAnnotatorStateAndCommitChange,
      revert: revertAnnotatorState,
      restore: restoreAnnotatorState,
      canRevert: canRevertAnnotatorState,
      canRestore: canRestoreAnnotatorState,
      reinitialize: reinitializeAnnotatorState,
    },
  };

  function setAnnotatorStateAndCommitChange(newAnnotatorState: annotatorStateType) {
    const commit = committer.commit(annotatorState.annotations, newAnnotatorState.annotations);
    setAnnotatorState(newAnnotatorState);

    onAnnotatorStateChange(commit);
  }

  function revertAnnotatorState() {
    const { annotations: newAnnotations, commit } = committer.revert(annotatorState.annotations);
    setAnnotatorState({
      ...annotatorState,
      annotations: newAnnotations,
    });

    onAnnotatorStateChange(commit);
  }

  function restoreAnnotatorState() {
    const { annotations: newAnnotations, commit } = committer.restore(annotatorState.annotations);
    setAnnotatorState({
      ...annotatorState,
      annotations: newAnnotations,
    });

    onAnnotatorStateChange(commit);
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

  function onAnnotatorStateChange(commit: annotationsDiffType) {
    autoSaver.saveCommit(commit);
  }
}
