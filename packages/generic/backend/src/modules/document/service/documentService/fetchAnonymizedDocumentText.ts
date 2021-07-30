import { buildAnonymizer, documentType } from '@label/core';
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
  const anonymizer = buildAnonymizer(settings);

  const anonymizedDocument = anonymizer.anonymizeDocument(
    document,
    annotations,
  );
  return anonymizedDocument.text;
}
