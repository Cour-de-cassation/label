import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { countDocumentsWithoutAnnotations };

async function countDocumentsWithoutAnnotations(): Promise<number> {
  const documentRepository = buildDocumentRepository();

  const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
  return documentRepository.countNotIn(treatedDocumentIds);
}
