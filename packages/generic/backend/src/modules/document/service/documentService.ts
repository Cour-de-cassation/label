import {
  documentType,
  idType,
  idModule,
  indexer,
  errorHandlers,
  buildAnonymizer,
} from '@label/core';
import { settingsLoader } from '../../../lib/settingsLoader';
import { dateBuilder } from '../../../utils';
import { annotationReportService } from '../../annotationReport';
import { assignationService } from '../../assignation';
import { treatmentService } from '../../treatment';
import { monitoringEntryService } from '../../monitoringEntry';
import { userService } from '../../user';
import { buildDocumentRepository } from '../repository';

export { documentService };

const documentService = {
  async deleteDocument(id: documentType['_id']) {
    const documentRepository = buildDocumentRepository();

    await annotationReportService.deleteAnnotationReportsByDocumentId(id);
    await assignationService.deleteAssignationsByDocumentId(id);
    await monitoringEntryService.deleteMonitoringEntriesByDocumentId(id);
    await treatmentService.deleteTreatmentsByDocumentId(id);

    await documentRepository.deleteManyByIds([id]);
  },

  async fetchAllDocumentsByIds(documentIds: documentType['_id'][]) {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByIds(documentIds);
  },

  async fetchAnonymizedDocumentText(documentId: documentType['_id']) {
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
  },

  async fetchSpecialDocuments() {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByPublicationCategoryAndStatus({
      publicationCategory: ['P'],
      status: 'done',
    });
  },

  async fetchTreatedDocuments() {
    const documentRepository = buildDocumentRepository();

    const documents = await documentRepository.findAllByStatus(['done']);
    const documentIds = documents.map(({ _id }) => _id);
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

    return documents.map((document) => {
      const documentIdString = idModule.lib.convertToString(document._id);
      const assignation = assignationsByDocumentId[documentIdString];
      const assignationIdString = idModule.lib.convertToString(assignation._id);
      const userName = usersByAssignationId[assignationIdString].name;
      const treatments = treatmentsByDocumentId[documentIdString];
      return {
        document: {
          _id: document._id,
          documentId: document.documentId,
          publicationCategory: document.publicationCategory,
        },
        treatments,
        userName,
      };
    });
  },

  async fetchUntreatedDocuments() {
    const documentRepository = buildDocumentRepository();
    return documentRepository.findAllByStatus(['free', 'pending', 'saved']);
  },

  async fetchDocumentsReadyToExport(days: number): Promise<documentType[]> {
    const documentRepository = buildDocumentRepository();

    const documentsCompletelyTreated = await documentRepository.findAllByStatus(
      ['done'],
    );

    const documentsReadyToExport = documentsCompletelyTreated.filter(
      (document) => document.updateDate < dateBuilder.daysAgo(days),
    );

    return documentsReadyToExport;
  },

  async fetchDocumentsWithoutAnnotations(): Promise<documentType[]> {
    const documentRepository = buildDocumentRepository();

    const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
    const documents = await documentRepository.findAll();

    return documents.filter(
      (document) =>
        !treatedDocumentIds.some((documentId) =>
          idModule.lib.equalId(documentId, document._id),
        ),
    );
  },

  async fetchDocument(documentId: documentType['_id']) {
    const documentRepository = buildDocumentRepository();

    return documentRepository.findById(documentId);
  },
  async fetchDocumentForUser(
    userId: idType,
    documentIdsToExclude: idType[] = [],
  ): Promise<documentType> {
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
  },

  async updateDocumentStatus(
    id: documentType['_id'],
    status: documentType['status'],
  ) {
    const documentRepository = buildDocumentRepository();
    await documentRepository.updateStatusById(id, status);

    if (status === 'free') {
      await assignationService.deleteAssignationsByDocumentId(id);
    }
  },
};
