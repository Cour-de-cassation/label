import { annotationsDiffModule, annotationsDiffType, fetchedDocumentType } from '@label/core';

export { buildAutoSaver };

export type { autoSaverType };

type autoSaverType = {
  autoSave: () => void;
  saveCommit: (commit: annotationsDiffType) => void;
};

function buildAutoSaver({
  documentId,
  applySave = () => {},
}: {
  documentId: fetchedDocumentType['_id'];
  applySave?: (documentId: fetchedDocumentType['_id'], annotationsDiff: annotationsDiffType) => void;
}): autoSaverType {
  let commitToSave = [] as annotationsDiffType[];

  return {
    autoSave,
    saveCommit,
  };

  function autoSave() {
    const annotationsDiffToSave = annotationsDiffModule.lib.squash(commitToSave);
    applySave(documentId, annotationsDiffToSave);
    commitToSave = [];
  }

  function saveCommit(commit: annotationsDiffType) {
    commitToSave.push(commit);

    autoSave();
  }
}
