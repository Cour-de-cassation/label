import { buildCallAttemptsRegulator } from 'sder';
import { assertDocumentIsPublishable } from './assertDocumentIsPublishable';
import { assertDocumentStatus } from './assertDocumentStatus';
import { countDocumentsWithoutAnnotations } from './countDocumentsWithoutAnnotations';
import { deleteDocument } from './deleteDocument';
import { fetchAllDocumentsByIds } from './fetchAllDocumentsByIds';
import { fetchAllExportableDocuments } from './fetchAllExportableDocuments';
import { fetchAllJurisdictions } from './fetchAllJurisdictions';
import { fetchAllPublicationCategories } from './fetchAllPublicationCategories';
import { fetchAllSources } from './fetchAllSources';
import { fetchAnonymizedDocumentText } from './fetchAnonymizedDocumentText';
import { fetchDocument } from './fetchDocument';
import { buildFetchDocumentsForUser } from './fetchDocumentsForUser';
import { fetchDocumentBySourceAndDocumentNumber } from './fetchDocumentBySourceAndDocumentNumber';
import { fetchDocumentsReadyToExport } from './fetchDocumentsReadyToExport';
import { fetchDocumentWithoutAnnotationsNotIn } from './fetchDocumentWithoutAnnotationsNotIn';
import { fetchDoneDocuments } from './fetchDoneDocuments';
import { fetchFreeDocumentsIds } from './fetchFreeDocumentsIds';
import { fetchPublishableDocuments } from './fetchPublishableDocuments';
import { fetchPublishableDocumentsToExport } from './fetchPublishableDocumentsToExport';
import { fetchToBeConfirmedDocuments } from './fetchToBeConfirmedDocuments';
import { fetchTreatedDocuments } from './fetchTreatedDocuments';
import { fetchUntreatedDocuments } from './fetchUntreatedDocuments';
import { fetchDocumentsWithoutAnnotations } from './fetchDocumentsWithoutAnnotations';
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
    fetchAllExportableDocuments,
    fetchAllJurisdictions,
    fetchAllPublicationCategories,
    fetchAllSources,
    fetchAnonymizedDocumentText,
    fetchDocument,
    fetchDocumentBySourceAndDocumentNumber,
    fetchDocumentsForUser: buildFetchDocumentsForUser(checkCallAttempts),
    fetchDocumentsReadyToExport,
    fetchDocumentWithoutAnnotationsNotIn,
    fetchDoneDocuments,
    fetchFreeDocumentsIds,
    fetchPublishableDocuments,
    fetchPublishableDocumentsToExport,
    fetchToBeConfirmedDocuments,
    fetchTreatedDocuments,
    fetchUntreatedDocuments,
    fetchDocumentsWithoutAnnotations,
    resetDocument,
    resetDocumentReviewStatus,
    updateDocumentReviewStatus,
    updateDocumentStatus,
  };
}
