import { annotationType, annotationsDiffModule, annotationsDiffType } from '@label/core';

export { buildAnnotationsCommitter };

export type { annotationsCommitterType };

type annotationsCommitterType = {
  clean: () => void;
  commit: (previousAnnotations: annotationType[], nextAnnotations: annotationType[]) => annotationsDiffType;
  revert: (previousAnnotations: annotationType[]) => { annotations: annotationType[]; commit: annotationsDiffType };
  restore: (previousAnnotations: annotationType[]) => { annotations: annotationType[]; commit: annotationsDiffType };
  canRevert: () => boolean;
  canRestore: () => boolean;
  squash: () => annotationsDiffType;
};

function buildAnnotationsCommitter(): annotationsCommitterType {
  let annotationCommitsToRevert: annotationsDiffType[] = [];
  let annotationCommitsToRestore: annotationsDiffType[] = [];

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
    annotationCommitsToRevert = [];
    annotationCommitsToRestore = [];
  }

  function commit(previousAnnotations: annotationType[], nextAnnotations: annotationType[]) {
    const annotationsDiff = annotationsDiffModule.lib.computeAnnotationsDiff(previousAnnotations, nextAnnotations);
    annotationCommitsToRevert.push(annotationsDiff);
    annotationCommitsToRestore = [];

    return annotationsDiff;
  }

  function revert(previousAnnotations: annotationType[]) {
    return revertCommit(previousAnnotations, annotationCommitsToRevert, annotationCommitsToRestore);
  }

  function restore(previousAnnotations: annotationType[]) {
    return revertCommit(previousAnnotations, annotationCommitsToRestore, annotationCommitsToRevert);
  }

  function canRevert() {
    return annotationCommitsToRevert.length > 0;
  }

  function canRestore() {
    return annotationCommitsToRestore.length > 0;
  }

  function revertCommit(
    annotations: annotationType[],
    previousCommits: annotationsDiffType[],
    nextCommits: annotationsDiffType[],
  ): { annotations: annotationType[]; commit: annotationsDiffType } {
    const previousCommit = previousCommits.pop();
    if (!previousCommit) {
      throw new Error('No commit to revert');
    }

    const revertedPreviousCommit = annotationsDiffModule.lib.inverse(previousCommit);

    nextCommits.push(revertedPreviousCommit);

    return {
      annotations: annotationsDiffModule.lib.applyToAnnotations(annotations, revertedPreviousCommit),
      commit: revertedPreviousCommit,
    };
  }

  function squash() {
    return annotationsDiffModule.lib.squash(annotationCommitsToRevert);
  }
}
