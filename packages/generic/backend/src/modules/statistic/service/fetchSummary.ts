import { documentService } from '../../../modules/document';

export { fetchSummary };

async function fetchSummary() {
  const freeDocumentsCount = await documentService.countFreeDocuments();
  const pendingDocumentsCount = await documentService.countPendingDocuments();
  const savedDocumentsCount = await documentService.countSavedDocuments();
  const doneDocumentsCount = await documentService.countDoneDocuments();
  const lockedDocumentsCount = await documentService.countLockedDocuments();
  const rejectedDocumentsCount = await documentService.countRejectedDocuments();

  return {
    freeDocuments: freeDocumentsCount,
    pendingDocuments: pendingDocumentsCount,
    savedDocuments: savedDocumentsCount,
    doneDocuments: doneDocumentsCount,
    lockedDocuments: lockedDocumentsCount,
    rejectedDocuments: rejectedDocumentsCount,
  };
}
