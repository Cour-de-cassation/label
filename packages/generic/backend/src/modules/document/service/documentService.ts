import { flatten } from 'lodash';
import {
  documentType,
  idType,
  idModule,
  errorHandlers,
  buildAnonymizer,
  userType,
  documentModule,
} from '@label/core';
import { settingsLoader } from '../../../lib/settingsLoader';
import { buildCallAttemptsRegulator } from '../../../lib/callAttemptsRegulator';
import { dateBuilder, logger } from '../../../utils';
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
    countDocumentsWithoutAnnotations,
    deleteDocument,
    fetchAllDocumentsByIds,
    fetchAllPublicationCategories,
    fetchAllSources,
    fetchAnonymizedDocumentText,
    fetchDoneDocuments,
    fetchSpecialDocuments,
    fetchTreatedDocuments,
    fetchUntreatedDocuments,
    fetchDocumentsReadyToExport,
    fetchDocumentWithoutAnnotations,
    fetchDocumentsForUser,
    fetchDocumentForUser,
    fetchDocument,
    updateDocumentMarkedAsPublished,
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

  async function fetchAllPublicationCategories() {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findAllPublicationCategories();
  }

  async function fetchAllSources() {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findAllSources();
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

  async function fetchDoneDocuments() {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findAllByStatus(['done']);
  }

  async function fetchSpecialDocuments() {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByPublicationCategoryLettersProjection(
      documentModule.lib.publicationHandler.getPublishedPublicationCategory(),
      ['_id', 'creationDate', 'documentNumber', 'markedAsPublished', 'status'],
    );
  }

  async function fetchTreatedDocuments() {
    const documentRepository = buildDocumentRepository();

    const treatedDocuments = await documentRepository.findAllByStatusProjection(
      ['done'],
      ['_id', 'documentNumber', 'publicationCategory'],
    );

    const documentIds = treatedDocuments.map(({ _id }) => _id);
    const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
      documentIds,
    );
    const assignations = flatten(Object.values(assignationsByDocumentId));
    const usersByAssignationId = await userService.fetchUsersByAssignations(
      assignations,
    );
    const treatmentsByDocumentId = await treatmentService.fetchTreatmentsByDocumentIds(
      documentIds,
    );

    return treatedDocuments.map((treatedDocument) => {
      const documentIdString = idModule.lib.convertToString(
        treatedDocument._id,
      );
      const assignations = assignationsByDocumentId[documentIdString];
      const userNames = assignations.map(
        (assignation) =>
          usersByAssignationId[idModule.lib.convertToString(assignation._id)]
            .name,
      );
      const treatments = treatmentsByDocumentId[documentIdString];

      return {
        document: {
          _id: treatedDocument._id,
          documentNumber: treatedDocument.documentNumber,
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
        userNames,
      };
    });
  }

  async function fetchUntreatedDocuments() {
    const documentRepository = buildDocumentRepository();
    const untreatedDocuments = await documentRepository.findAllByStatusProjection(
      ['free', 'pending', 'saved'],
      [
        '_id',
        'creationDate',
        'documentNumber',
        'publicationCategory',
        'status',
      ],
    );
    const assignedDocumentIds = untreatedDocuments
      .filter(
        (document) =>
          document.status === 'pending' || document.status === 'saved',
      )
      .map((document) => document._id);
    const assignationsByDocumentId = await assignationService.fetchAssignationsByDocumentIds(
      assignedDocumentIds,
    );
    const allAssignations = flatten(Object.values(assignationsByDocumentId));
    const usersByAssignationId = await userService.fetchUsersByAssignations(
      allAssignations,
    );
    return untreatedDocuments.map((untreatedDocument) => {
      const assignationsForDocument =
        assignationsByDocumentId[
          idModule.lib.convertToString(untreatedDocument._id)
        ];
      const userNames = assignationsForDocument
        ? assignationsForDocument.map(
            (assignation) =>
              usersByAssignationId[
                idModule.lib.convertToString(assignation._id)
              ].name,
          )
        : [];

      return {
        document: {
          _id: untreatedDocument._id,
          creationDate: untreatedDocument.creationDate,
          publicationCategory: untreatedDocument.publicationCategory,
          documentNumber: untreatedDocument.documentNumber,
          status: untreatedDocument.status,
        },
        userNames,
      };
    });
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

  async function fetchDocumentWithoutAnnotations(): Promise<
    documentType | undefined
  > {
    const documentRepository = buildDocumentRepository();

    const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
    let document: documentType | undefined;
    document = await documentRepository.findOneByStatusAndPriorityNotIn(
      { status: 'loaded', priority: 'high' },
      treatedDocumentIds,
    );
    if (document) {
      return document;
    }
    document = await documentRepository.findOneByStatusAndPriorityNotIn(
      { status: 'loaded', priority: 'medium' },
      treatedDocumentIds,
    );
    if (document) {
      return document;
    }
    document = await documentRepository.findOneByStatusAndPriorityNotIn(
      { status: 'loaded', priority: 'low' },
      treatedDocumentIds,
    );

    return document;
  }

  async function countDocumentsWithoutAnnotations(): Promise<number> {
    const documentRepository = buildDocumentRepository();

    const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
    return documentRepository.countNotIn(treatedDocumentIds);
  }

  async function fetchDocument(documentId: documentType['_id']) {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findById(documentId);
  }

  async function fetchDocumentsForUser(
    userId: idType,
    documentsMaxCount: number,
  ) {
    const documents: documentType[] = [];
    const documentIdsToExclude: documentType['_id'][] = [];
    const documentIdsWithAnnotations = await treatmentService.fetchTreatedDocumentIds();
    const documentsAssignated = await fetchAlreadyAssignatedDocuments(userId);
    for (
      let i = 0;
      i < documentsAssignated.length && i < documentsMaxCount;
      i++
    ) {
      checkCallAttempts(idModule.lib.convertToString(userId));
      const assignatedDocument = documentsAssignated[i];
      documents.push(assignatedDocument);
      documentIdsToExclude.push(assignatedDocument._id);
    }

    if (documents.some(({ status }) => status === 'saved')) {
      return documents;
    }

    for (let i = documents.length; i < documentsMaxCount; i++) {
      try {
        const document = await fetchDocumentForUser(
          userId,
          documentIdsWithAnnotations,
        );
        documents.push(document);
        documentIdsToExclude.push(document._id);
      } catch (error) {
        logger.log(error);
      }
    }
    return documents;
  }

  async function fetchDocumentForUser(
    userId: idType,
    documentIdsToSearchIn: documentType['_id'][],
  ): Promise<documentType> {
    checkCallAttempts(idModule.lib.convertToString(userId));

    return assignNewDocument(documentIdsToSearchIn);

    async function assignNewDocument(
      documentIdsToSearchIn: documentType['_id'][],
    ) {
      let document: documentType | undefined;

      document = await assignDocumentByPriority('high', documentIdsToSearchIn);
      if (!document) {
        document = await assignDocumentByPriority(
          'medium',
          documentIdsToSearchIn,
        );
      }
      if (!document) {
        document = await assignDocumentByPriority('low', documentIdsToSearchIn);
      }
      if (!document) {
        throw new Error(`No free document available`);
      }

      await assignationService.createAssignation({
        userId,
        documentId: document._id,
      });

      return document;
    }
  }

  async function fetchAlreadyAssignatedDocuments(userId: userType['_id']) {
    const documentRepository = buildDocumentRepository();
    const documentIdsAssignated = await assignationService.fetchDocumentIdsAssignatedToUserId(
      userId,
    );

    const documentsById = await documentRepository.findAllByIds(
      documentIdsAssignated,
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

  async function updateDocumentMarkedAsPublished(
    documentId: documentType['_id'],
    markedAsPublished: documentType['markedAsPublished'],
  ) {
    const documentRepository = buildDocumentRepository();

    const hasDocumentBeenUpdated = await documentRepository.updateOneMarkedAsPublishedByIdAndStatus(
      { _id: documentId, status: 'done' },
      { markedAsPublished },
    );

    if (!hasDocumentBeenUpdated) {
      throw new Error(`The document ${documentId} has not been updated`);
    }
  }

  async function assignDocumentByPriority(
    priority: documentType['priority'],
    documentIdsWithAnnotations: documentType['_id'][],
  ): Promise<documentType | undefined> {
    const documentRepository = buildDocumentRepository();

    const document = await documentRepository.findOneByStatusAndPriorityAmong(
      { priority, status: 'free' },
      documentIdsWithAnnotations,
    );

    if (!document) {
      return undefined;
    }

    const hasBeenChangedToPending = await documentRepository.updateOneStatusByIdAndStatus(
      { _id: document._id, status: 'free' },
      { status: 'pending' },
    );
    if (!hasBeenChangedToPending) {
      return assignDocumentByPriority(priority, documentIdsWithAnnotations);
    }
    return document;
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
