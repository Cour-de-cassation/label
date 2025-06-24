import { buildCallAttemptsRegulator } from '../../../../utils/callAttemptsRegulator/callAttemptsRegulator';
import { assertDocumentIsPublishable } from './assertDocumentIsPublishable';
import { assertDocumentStatus } from './assertDocumentStatus';
import { countDocumentsWithoutAnnotations } from './countDocumentsWithoutAnnotations';
import { countDoneDocumentsWithoutLossNotIn } from './countDoneDocumentsWithoutLossNotIn';
import { countDoneDocuments } from './countDoneDocuments';
import { countFreeDocuments } from './countFreeDocuments';
import { countLoadedDocuments } from './countLoadedDocuments';
import { countLockedDocuments } from './countLockedDocuments';
import { countNlpAnnotatingDocuments } from './countNlpAnnotatingDocuments';
import { countPendingDocuments } from './countPendingDocuments';
import { countSavedDocuments } from './countSavedDocuments';
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
import { fetchLockedDocuments } from './fetchLockedDocuments';
import { fetchPublishableDocuments } from './fetchPublishableDocuments';
import { fetchPublishableDocumentsToExport } from './fetchPublishableDocumentsToExport';
import { fetchToBeConfirmedDocuments } from './fetchToBeConfirmedDocuments';
import { fetchTreatedDocuments } from './fetchTreatedDocuments';
import { fetchUntreatedDocuments } from './fetchUntreatedDocuments';
import { fetchDocumentsWithoutAnnotations } from './fetchDocumentsWithoutAnnotations';
import { resetDocument } from './resetDocument';
import { resetDocumentReviewStatus } from './resetDocumentReviewStatus';
import { updateDocumentLoss } from './updateDocumentLoss';
import { updateDocumentReviewStatus } from './updateDocumentReviewStatus';
import { updateDocumentRoute } from './updateDocumentRoute';
import { updateDocumentCategoriesToOmit } from './updateDocumentCategoriesToOmit';
import { updateDocumentComputedAdditionalTerms } from './updateDocumentComputedAdditionalTerms';
import { updateDocumentStatus } from './updateDocumentStatus';
import { fetchAllImporters } from './fetchAllImporters';
import { updateDocumentAdditionalTermsParsingFailed } from './updateDocumentAdditionalTermsParsingFailed';
import { updateDocumentNlpVersions } from './updateDocumentNlpVersions';
import { updateDocumentChecklist } from './updateDocumentChecklist';

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
    countDoneDocuments,
    countFreeDocuments,
    countLoadedDocuments,
    countLockedDocuments,
    countNlpAnnotatingDocuments,
    countPendingDocuments,
    countSavedDocuments,
    deleteDocument,
    fetchAllDocumentsByIds,
    fetchAllExportableDocuments,
    fetchAllImporters,
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
    fetchLockedDocuments,
    fetchPublishableDocuments,
    fetchPublishableDocumentsToExport,
    fetchToBeConfirmedDocuments,
    fetchTreatedDocuments,
    fetchUntreatedDocuments,
    fetchDocumentsWithoutAnnotations,
    resetDocument,
    resetDocumentReviewStatus,
    updateDocumentLoss,
    updateDocumentReviewStatus,
    updateDocumentRoute,
    updateDocumentStatus,
    updateDocumentCategoriesToOmit,
    updateDocumentComputedAdditionalTerms,
    updateDocumentAdditionalTermsParsingFailed,
    updateDocumentNlpVersions,
    updateDocumentChecklist,
  };
}
