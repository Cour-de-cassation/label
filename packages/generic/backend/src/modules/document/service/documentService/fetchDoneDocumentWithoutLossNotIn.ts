import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchDoneDocumentWithoutLossNotIn };

async function fetchDoneDocumentWithoutLossNotIn(
  documentIdsToExclude: documentType['_id'][],
): Promise<documentType | undefined> {
  const documentRepository = buildDocumentRepository();

  return await documentRepository.findOneByStatusWithoutLossNotIn(
    ['done', 'toBePublished'],
    documentIdsToExclude,
  );
}
