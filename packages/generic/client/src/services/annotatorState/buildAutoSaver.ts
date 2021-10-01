import { annotationsDiffModule, annotationsDiffType } from '@label/core';

export { buildAutoSaver };

export type { autoSaverType };

type autoSaverType = {
  autoSave: () => void;
  saveCommit: (commit: annotationsDiffType) => void;
};

function buildAutoSaver({
  applySave = async () => {},
}: {
  applySave?: (annotationsDiff: annotationsDiffType) => Promise<void>;
}): autoSaverType {
  let commitsToSave = [] as annotationsDiffType[];

  return {
    autoSave,
    saveCommit,
  };

  async function autoSave() {
    const cachedCommitsToSave = [...commitsToSave];
    const annotationsDiffToSave = annotationsDiffModule.lib.squash(commitsToSave);
    commitsToSave = [];
    try {
      await applySave(annotationsDiffToSave);
    } catch (error) {
      commitsToSave = [...cachedCommitsToSave, ...commitsToSave];
      console.warn(error);
    }
  }

  function saveCommit(commit: annotationsDiffType) {
    commitsToSave.push(commit);

    autoSave();
  }
}
