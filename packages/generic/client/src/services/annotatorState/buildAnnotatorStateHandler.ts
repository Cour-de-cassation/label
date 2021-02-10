import { annotationsDiffType } from '@label/core';
import { clientAnonymizerType } from '../../types';
import { annotatorStateType } from './annotatorStateType';
import { annotationsCommitterType } from './buildAnnotationsCommitter';
import { autoSaverType } from './buildAutoSaver';

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
  getAnonymizer: () => clientAnonymizerType;
};

function buildAnnotatorStateHandler({
  annotatorState,
  autoSaver,
  buildAnonymizer,
  committer,
  resetAnnotatorState,
  setAnnotatorState,
}: {
  annotatorState: annotatorStateType;
  autoSaver: autoSaverType;
  buildAnonymizer: () => clientAnonymizerType;
  committer: annotationsCommitterType;
  resetAnnotatorState: () => void;
  setAnnotatorState: (annotatorState: annotatorStateType) => void;
}): { annotatorStateHandler: annotatorStateHandlerType } {
  let anonymizer = buildAnonymizer();

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
      getAnonymizer,
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

  function getGlobalAnnotationsDiff() {
    return committer.squash();
  }

  function getAnonymizer() {
    return anonymizer;
  }

  function onAnnotatorStateChange(commit: annotationsDiffType) {
    anonymizer = buildAnonymizer();
    autoSaver.saveCommit(commit);
  }
}
