import { documentService } from '../../../modules/document';

export { fetchSummary };

async function fetchSummary() {
  const loadedDocumentsCount = await documentService.countLoadedDocuments();
  const nlpAnnotatingDocumentsCount = await documentService.countNlpAnnotatingDocuments();
  const freeDocumentsCount = await documentService.countFreeDocuments();
  const pendingDocumentsCount = await documentService.countPendingDocuments();
  const savedDocumentsCount = await documentService.countSavedDocuments();
  const doneDocumentsCount = await documentService.countDoneDocuments();
  const lockedDocumentsCount = await documentService.countLockedDocuments();
  const rejectedDocumentsCount = await documentService.countRejectedDocuments();

  return {
    loadedDocuments: loadedDocumentsCount,
    nlpAnnotatingDocuments: nlpAnnotatingDocumentsCount,
    freeDocuments: freeDocumentsCount,
    pendingDocuments: pendingDocumentsCount,
    savedDocuments: savedDocumentsCount,
    doneDocuments: doneDocumentsCount,
    lockedDocuments: lockedDocumentsCount,
    rejectedDocuments: rejectedDocumentsCount,
  };
}
