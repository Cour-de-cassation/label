import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { fetchDocumentsWithoutAnnotations };

async function fetchDocumentsWithoutAnnotations() {
  const documentRepository = buildDocumentRepository();

  const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();

  return documentRepository.findNotIn(treatedDocumentIds);
}
