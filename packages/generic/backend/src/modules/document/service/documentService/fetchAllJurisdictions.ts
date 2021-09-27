import { documentType } from '../../../../../../core/dist';
import { buildDocumentRepository } from '../../repository';

export { fetchAllJurisdictions };

async function fetchAllJurisdictions() {
  const documentRepository = buildDocumentRepository();

  return documentRepository.distinctNested<
    documentType['decisionMetadata']['jurisdiction']
  >('decisionMetadata.jurisdiction');
}
