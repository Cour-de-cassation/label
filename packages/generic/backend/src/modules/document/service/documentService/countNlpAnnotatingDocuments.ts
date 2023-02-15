import { buildDocumentRepository } from '../../repository';

export { countNlpAnnotatingDocuments };

async function countNlpAnnotatingDocuments() {
  const documentRepository = buildDocumentRepository();
  return documentRepository.countByStatus(['nlpAnnotating']);
}
