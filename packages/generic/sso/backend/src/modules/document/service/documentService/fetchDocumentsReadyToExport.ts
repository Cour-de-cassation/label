import { dateBuilder, documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchDocumentsReadyToExport };

async function fetchDocumentsReadyToExport(
  days: number,
): Promise<documentType[]> {
  const documentRepository = buildDocumentRepository();

  const documentsCompletelyTreated = await documentRepository.findAllByStatus([
    'done',
  ]);

  const documentsReadyToExport = documentsCompletelyTreated.filter(
    (document) => document.updateDate < dateBuilder.daysAgo(days),
  );

  return documentsReadyToExport;
}
