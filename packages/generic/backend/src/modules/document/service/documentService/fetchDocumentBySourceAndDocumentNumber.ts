import { documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';

export { fetchDocumentBySourceAndDocumentNumber };

async function fetchDocumentBySourceAndDocumentNumber({
  source,
  documentNumber,
}: {
  source: documentType['source'];
  documentNumber: documentType['documentNumber'];
}) {
  const documentRepository = buildDocumentRepository();

  return documentRepository.findOneByDocumentNumberAndSource({
    source,
    documentNumber,
  });
}
