import {
  documentType,
  idType,
  idModule,
  indexer,
  errorHandlers,
  buildAnonymizer,
} from '@label/core';
import { settingsLoader } from '../../../lib/settingsLoader';
import { buildCallAttemptsRegulator } from '../../../lib/callAttemptsRegulator';
import { dateBuilder } from '../../../utils';
import { annotationReportService } from '../../annotationReport';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { monitoringEntryService } from '../../monitoringEntry';
import { userService } from '../../user';
import { buildDocumentRepository } from '../repository';

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
    deleteDocument,
    fetchAllDocumentsByIds,
    fetchAnonymizedDocumentText,
    fetchSpecialDocuments,
    fetchTreatedDocuments,
    fetchUntreatedDocuments,
    fetchDocumentsReadyToExport,
    fetchDocumentsWithoutAnnotations,
    fetchDocumentForUser,
    fetchDocument,
    updateDocumentStatus,
  };

  async function deleteDocument(id: documentType['_id']) {
    const documentRepository = buildDocumentRepository();

    await annotationReportService.deleteAnnotationReportsByDocumentId(id);
    await assignationService.deleteAssignationsByDocumentId(id);
    await monitoringEntryService.deleteMonitoringEntriesByDocumentId(id);
    await treatmentService.deleteTreatmentsByDocumentId(id);

    await documentRepository.deleteManyByIds([id]);
  }

  async function fetchAllDocumentsByIds(documentIds: documentType['_id'][]) {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByIds(documentIds);
  }

  async function fetchAnonymizedDocumentText(documentId: documentType['_id']) {
    const documentRepository = buildDocumentRepository();
    const document = await documentRepository.findById(documentId);

    if (!document) {
      throw errorHandlers.notFoundErrorHandler.build(
        `No document found for id ${documentId}`,
      );
    }

    const annotations = await treatmentService.fetchAnnotationsOfDocument(
      documentId,
    );
    const settings = settingsLoader.getSettings();
    const anonymizer = buildAnonymizer(settings);

    const anonymizedDocument = anonymizer.anonymizeDocument(
      document,
      annotations,
    );
    return anonymizedDocument.text;
  }

  async function fetchSpecialDocuments() {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByPublicationCategoryAndStatus({
      publicationCategory: ['P'],
      status: 'done',
    });
  }

  async function fetchTreatedDocuments() {
    const documentRepository = buildDocumentRepository();

    const treatedDocuments = await documentRepository.findAllByStatusProjection(
      ['done'],
      ['_id', 'documentId', 'publicationCategory'],
    );

    const documentIds = treatedDocuments.map(({ _id }) => _id);
    const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
      documentIds,
    );
    const assignationsById = indexer.indexBy(
      Object.values(assignationsByDocumentId),
      (assignation) => idModule.lib.convertToString(assignation._id),
    );
    const usersByAssignationId = await userService.fetchUsersByAssignationId(
      assignationsById,
    );
    const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
      documentIds,
    );

    return treatedDocuments.map((treatedDocument) => {
      const documentIdString = idModule.lib.convertToString(
        treatedDocument._id,
      );
      const assignation = assignationsByDocumentId[documentIdString];
      const assignationIdString = idModule.lib.convertToString(assignation._id);
      const userName = usersByAssignationId[assignationIdString].name;
      const treatments = treatmentsByDocumentId[documentIdString];
      return {
        document: {
          _id: treatedDocument._id,
          documentId: treatedDocument.documentId,
          publicationCategory: treatedDocument.publicationCategory,
        },
        treatments: treatments.map((treatment) => ({
          _id: treatment._id,
          addedAnnotationsCount: treatment.addedAnnotationsCount,
          deletedAnnotationsCount: treatment.deletedAnnotationsCount,
          documentId: treatment.documentId,
          duration: treatment.duration,
          lastUpdateDate: treatment.lastUpdateDate,
          modifiedAnnotationsCount: treatment.modifiedAnnotationsCount,
          resizedBiggerAnnotationsCount:
            treatment.resizedBiggerAnnotationsCount,
          resizedSmallerAnnotationsCount:
            treatment.resizedSmallerAnnotationsCount,
          source: treatment.source,
        })),
        userName,
      };
    });
  }

  async function fetchUntreatedDocuments() {
    const documentRepository = buildDocumentRepository();
    const untreatedDocuments = await documentRepository.findAllByStatusProjection(
      ['free', 'pending', 'saved'],
      ['_id', 'documentId', 'publicationCategory'],
    );

    return untreatedDocuments;
  }

  async function fetchDocumentsReadyToExport(
    days: number,
  ): Promise<documentType[]> {
    const documentRepository = buildDocumentRepository();

    const documentsCompletelyTreated = await documentRepository.findAllByStatus(
      ['done'],
    );

    const documentsReadyToExport = documentsCompletelyTreated.filter(
      (document) => document.updateDate < dateBuilder.daysAgo(days),
    );

    return documentsReadyToExport;
  }

  async function fetchDocumentsWithoutAnnotations(): Promise<documentType[]> {
    const documentRepository = buildDocumentRepository();

    const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
    const documents = await documentRepository.findAll();

    return documents.filter(
      (document) =>
        !treatedDocumentIds.some((documentId) =>
          idModule.lib.equalId(documentId, document._id),
        ),
    );
  }

  async function fetchDocument(documentId: documentType['_id']) {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findById(documentId);
  }

  async function fetchDocumentForUser(
    userId: idType,
    documentIdsToExclude: idType[] = [],
  ): Promise<documentType> {
    checkCallAttempts(idModule.lib.convertToString(userId));
    const documentRepository = buildDocumentRepository();
    const documentIdsAssignated = await assignationService.fetchDocumentIdsAssignatedToUserId(
      userId,
    );

    const documentsAssignated = await fetchAlreadyAssignatedDocuments();

    if (documentsAssignated.length !== 0) {
      return documentsAssignated[0];
    } else {
      return assignNewDocument();
    }

    async function fetchAlreadyAssignatedDocuments() {
      const documentsById = await documentRepository.findAllByIds(
        documentIdsAssignated.filter(
          (documentId) =>
            !documentIdsToExclude.some((anotherDocumentId) =>
              idModule.lib.equalId(documentId, anotherDocumentId),
            ),
        ),
      );
      return Object.values(documentsById)
        .filter(
          (document) =>
            document.status === 'pending' || document.status === 'saved',
        )
        .sort((document1, document2) =>
          document1.status === 'saved'
            ? -1
            : document2.status === 'saved'
            ? 1
            : 0,
        );
    }

    async function assignNewDocument() {
      let document: documentType;

      try {
        document = await documentRepository.assign('high');
      } catch {
        try {
          document = await documentRepository.assign('medium');
        } catch {
          document = await documentRepository.assign('low');
        }
      }

      await assignationService.createAssignation({
        userId,
        documentId: document._id,
      });

      return document;
    }
  }

  async function updateDocumentStatus(
    id: documentType['_id'],
    status: documentType['status'],
  ) {
    const documentRepository = buildDocumentRepository();
    await documentRepository.updateStatusById(id, status);

    if (status === 'free') {
      await assignationService.deleteAssignationsByDocumentId(id);
    }
  }
}
