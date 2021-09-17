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
  document = await documentRepository.findOneByStatusAndPriorityNotIn(
    { status: 'loaded', priority: 'high' },
    idsNotToSearchIn,
  );
  if (document) {
    return document;
  }
  document = await documentRepository.findOneByStatusAndPriorityNotIn(
    { status: 'loaded', priority: 'medium' },
    idsNotToSearchIn,
  );
  if (document) {
    return document;
  }
  document = await documentRepository.findOneByStatusAndPriorityNotIn(
    { status: 'loaded', priority: 'low' },
    idsNotToSearchIn,
  );

  return document;
}
