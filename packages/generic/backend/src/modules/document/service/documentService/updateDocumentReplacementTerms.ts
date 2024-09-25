import { errorHandlers } from 'sder-core';
import {
  buildAnonymizer,
  documentModule,
  documentType,
  idModule,
  settingsModule,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { treatmentService } from '../../../../modules/treatment';
import { settingsLoader } from '../../../../lib/settingsLoader';

export { updateDocumentReplacementTerms };

async function updateDocumentReplacementTerms(_id: documentType['_id']) {
  const documentRepository = buildDocumentRepository();

  const document = await documentRepository.findById(_id);
  const settings = settingsLoader.getSettings();

  const treatments = await treatmentService.fetchTreatmentsByDocumentId(
    document._id,
  );
  const annotations = treatmentModule.lib.computeAnnotations(treatments);
  const seed = documentModule.lib.computeCaseNumber(document);
  const settingsForDocument = settingsModule.lib.computeFilteredSettings(
    settings,
    document.decisionMetadata.categoriesToOmit,
    document.decisionMetadata.additionalTermsToAnnotate,
    document.decisionMetadata.computedAdditionalTerms,
    document.decisionMetadata.additionalTermsParsingFailed,
    document.decisionMetadata.motivationOccultation,
  );
  const anonymizer = buildAnonymizer(settingsForDocument, annotations, seed);

  const updatedDocument = await documentRepository.updateReplacementTermsById(
    _id,
    anonymizer.extractReplacementTerms(),
  );
  if (!updatedDocument) {
    throw errorHandlers.notFoundErrorHandler.build(
      `The document ${idModule.lib.convertToString(
        _id,
      )} was not found in the document collection`,
    );
  }
  return updatedDocument;
}
