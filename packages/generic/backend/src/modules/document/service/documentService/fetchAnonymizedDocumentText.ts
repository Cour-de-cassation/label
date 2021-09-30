import {
  buildAnonymizer,
  documentModule,
  documentType,
  settingsModule,
} from '@label/core';
import { settingsLoader } from '../../../../lib/settingsLoader';
import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { fetchAnonymizedDocumentText };

async function fetchAnonymizedDocumentText(documentId: documentType['_id']) {
  const documentRepository = buildDocumentRepository();
  const document = await documentRepository.findById(documentId);

  const annotations = await treatmentService.fetchAnnotationsOfDocument(
    documentId,
  );
  const settings = settingsLoader.getSettings();
  const settingsForDocument = settingsModule.lib.computeFilteredSettings(
    settings,
    document.decisionMetadata.categoriesToOmit,
    document.decisionMetadata.additionalTermsToAnnotate,
  );
  const seed = documentModule.lib.computeCaseNumber(document);
  const anonymizer = buildAnonymizer(settingsForDocument, annotations, seed);

  const anonymizedDocument = anonymizer.anonymizeDocument(document);
  return anonymizedDocument.text;
}
