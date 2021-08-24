import { buildAnonymizer, documentModule, documentType } from '@label/core';
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
  const seed = documentModule.lib.computeCaseNumber(document);
  const anonymizer = buildAnonymizer(settings, annotations, seed);

  const anonymizedDocument = anonymizer.anonymizeDocument(document);
  return anonymizedDocument.text;
}
