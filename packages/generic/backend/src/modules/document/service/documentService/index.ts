import { buildCallAttemptsRegulator } from 'sder-core';
import { assertDocumentIsPublishable } from './assertDocumentIsPublishable';
import { assertDocumentStatus } from './assertDocumentStatus';
import { countDocumentsWithoutAnnotations } from './countDocumentsWithoutAnnotations';
import { countDoneDocumentsWithoutLossNotIn } from './countDoneDocumentsWithoutLossNotIn';
import { deleteDocument } from './deleteDocument';
import { fetchAllDocumentsByIds } from './fetchAllDocumentsByIds';
import { fetchAllExportableDocuments } from './fetchAllExportableDocuments';
import { fetchAllJurisdictions } from './fetchAllJurisdictions';
import { fetchAllPublicationCategories } from './fetchAllPublicationCategories';
import { fetchAllRoutes } from './fetchAllRoutes';
import { fetchAllSources } from './fetchAllSources';
import { fetchAnonymizedDocumentText } from './fetchAnonymizedDocumentText';
import { fetchDocument } from './fetchDocument';
import { buildFetchDocumentsForUser } from './fetchDocumentsForUser';
import { fetchDocumentBySourceAndDocumentNumber } from './fetchDocumentBySourceAndDocumentNumber';
import { fetchDocumentsReadyToExport } from './fetchDocumentsReadyToExport';
import { fetchDocumentWithoutAnnotationsNotIn } from './fetchDocumentWithoutAnnotationsNotIn';
import { fetchDoneDocuments } from './fetchDoneDocuments';
import { fetchDoneDocumentWithoutLossNotIn } from './fetchDoneDocumentWithoutLossNotIn';
import { fetchFreeDocumentsIds } from './fetchFreeDocumentsIds';
import { fetchPublishableDocuments } from './fetchPublishableDocuments';
import { fetchPublishableDocumentsToExport } from './fetchPublishableDocumentsToExport';
import { fetchToBeConfirmedDocuments } from './fetchToBeConfirmedDocuments';
import { fetchTreatedDocuments } from './fetchTreatedDocuments';
import { fetchUntreatedDocuments } from './fetchUntreatedDocuments';
import { fetchRejectedDocuments } from './fetchRejectedDocuments';
import { fetchDocumentsWithoutAnnotations } from './fetchDocumentsWithoutAnnotations';
import { rejectDocument } from './rejectDocument';
import { resetDocument } from './resetDocument';
import { resetDocumentReviewStatus } from './resetDocumentReviewStatus';
import { updateDocumentLoss } from './updateDocumentLoss';
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
    countDoneDocumentsWithoutLossNotIn,
    deleteDocument,
    fetchAllDocumentsByIds,
    fetchAllExportableDocuments,
    fetchAllJurisdictions,
    fetchAllPublicationCategories,
    fetchAllRoutes,
    fetchAllSources,
    fetchAnonymizedDocumentText,
    fetchDocument,
    fetchDocumentBySourceAndDocumentNumber,
    fetchDocumentsForUser: buildFetchDocumentsForUser(checkCallAttempts),
    fetchDocumentsReadyToExport,
    fetchDocumentWithoutAnnotationsNotIn,
    fetchDoneDocuments,
    fetchDoneDocumentWithoutLossNotIn,
    fetchFreeDocumentsIds,
    fetchPublishableDocuments,
    fetchPublishableDocumentsToExport,
    fetchToBeConfirmedDocuments,
    fetchTreatedDocuments,
    fetchUntreatedDocuments,
    fetchRejectedDocuments,
    fetchDocumentsWithoutAnnotations,
    rejectDocument,
    resetDocument,
    resetDocumentReviewStatus,
    updateDocumentLoss,
    updateDocumentReviewStatus,
    updateDocumentStatus,
  };
}
