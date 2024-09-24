import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchAllExportableDocuments };

async function fetchAllExportableDocuments(): Promise<documentType[]> {
  const documentRepository = buildDocumentRepository();

  const exportableDocuments = await documentRepository.findAllByStatus([
    'toBePublished',
    'done',
  ]);

  return exportableDocuments;
}
