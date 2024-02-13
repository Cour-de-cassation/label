import { documentType } from '@label/core';
import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { fetchDocumentWithoutAnnotationsNotIn };

async function fetchDocumentWithoutAnnotationsNotIn(
  documentIdsToExclude: documentType['_id'][],
): Promise<documentType | undefined> {
  const documentRepository = buildDocumentRepository();

  const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();
  const idsNotToSearchIn = [...treatedDocumentIds, ...documentIdsToExclude];
  let document: documentType | undefined;

  const priorities = [4, 3, 2, 1, 0];

  for (const priority of priorities) {
    document = await documentRepository.findOneByStatusAndPriorityNotIn(
      { status: 'loaded', priority },
      idsNotToSearchIn
    );
    if (document) {
      return document;
    }
  }
  return undefined;
}
