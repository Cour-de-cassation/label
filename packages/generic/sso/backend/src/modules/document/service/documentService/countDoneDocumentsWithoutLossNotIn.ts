import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { countDoneDocumentsWithoutLossNotIn };

async function countDoneDocumentsWithoutLossNotIn(
  documentIdsToExclude: documentType['_id'][],
): Promise<number> {
  const documentRepository = buildDocumentRepository();

  return (
    await documentRepository.findAllByStatus(['done', 'toBePublished'])
  ).filter(
    (document: documentType) =>
      !documentIdsToExclude.includes(document._id) &&
      document.loss !== undefined,
  ).length;
}
