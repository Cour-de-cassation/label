import { annotationsDiffModule, annotationsDiffType, fetchedDocumentType } from '@label/core';

export { buildAutoSaver };

export type { autoSaverType };

type autoSaverType = {
  autoSave: () => void;
  saveCommit: (commit: annotationsDiffType) => void;
};

function buildAutoSaver({
  documentId,
  applySave = async () => {},
}: {
  documentId: fetchedDocumentType['_id'];
  applySave?: (documentId: fetchedDocumentType['_id'], annotationsDiff: annotationsDiffType) => Promise<void>;
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
      await applySave(documentId, annotationsDiffToSave);
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
