import { documentType } from '@label/core';
import { treatmentService } from '../../../treatment';
import { buildDocumentRepository } from '../../repository';

export { fetchDocumentWithoutAnnotations };

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
