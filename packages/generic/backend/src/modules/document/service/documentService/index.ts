import { buildCallAttemptsRegulator } from '../../../../lib/callAttemptsRegulator';
import { assertDocumentIsPublishable } from './assertDocumentIsPublishable';
import { assertDocumentStatus } from './assertDocumentStatus';
import { countDocumentsWithoutAnnotations } from './countDocumentsWithoutAnnotations';
import { deleteDocument } from './deleteDocument';
import { fetchAllDocumentsByIds } from './fetchAllDocumentsByIds';
import { fetchAllPublicationCategories } from './fetchAllPublicationCategories';
import { fetchAllSources } from './fetchAllSources';
import { fetchAnonymizedDocumentText } from './fetchAnonymizedDocumentText';
import { fetchDocument } from './fetchDocument';
import { buildFetchDocumentsForUser } from './fetchDocumentsForUser';
import { fetchDocumentsReadyToExport } from './fetchDocumentsReadyToExport';
import { fetchDocumentWithoutAnnotationsNotIn } from './fetchDocumentWithoutAnnotationsNotIn';
import { fetchDoneDocuments } from './fetchDoneDocuments';
import { fetchFreeDocumentsIds } from './fetchFreeDocumentsIds';
import { fetchPublishableDocuments } from './fetchPublishableDocuments';
import { fetchTreatedDocuments } from './fetchTreatedDocuments';
import { fetchUntreatedDocuments } from './fetchUntreatedDocuments';
import { resetDocument } from './resetDocument';
import { resetDocumentReviewStatus } from './resetDocumentReviewStatus';
import { updateDocumentReviewStatus } from './updateDocumentReviewStatus';
import { updateDocumentStatus } from './updateDocumentStatus';

export { buildDocumentService, documentService };

const DELAY_BETWEEN_FETCH_DOCUMENT_ATTEMPTS_IN_SECONDS = 60 * 60 * 1000;

const MAX_FETCH_DOCUMENT_ATTEMPTS = 300;

const documentService = buildDocumentService();

function buildDocumentService() {
  const { checkCallAttempts } = buildCallAttemptsRegulator(
    MAX_FETCH_DOCUMENT_ATTEMPTS,
    DELAY_BETWEEN_FETCH_DOCUMENT_ATTEMPTS_IN_SECONDS,
  );

  return {
    assertDocumentIsPublishable,
    assertDocumentStatus,
    countDocumentsWithoutAnnotations,
    deleteDocument,
    fetchAllDocumentsByIds,
    fetchAllPublicationCategories,
    fetchAllSources,
    fetchAnonymizedDocumentText,
    fetchDocument,
    fetchDocumentsForUser: buildFetchDocumentsForUser(checkCallAttempts),
    fetchDocumentsReadyToExport,
    fetchDocumentWithoutAnnotationsNotIn,
    fetchDoneDocuments,
    fetchFreeDocumentsIds,
    fetchPublishableDocuments,
    fetchTreatedDocuments,
    fetchUntreatedDocuments,
    resetDocument,
    resetDocumentReviewStatus,
    updateDocumentReviewStatus,
    updateDocumentStatus,
  };
}
