import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { fetchDocumentBySourceAndDocumentNumber } from './fetchDocumentBySourceAndDocumentNumber';

describe('fetchDocumentBySourceAndDocumentNumber', () => {
  const documents = [
    { source: 'jurinet', documentNumber: 123 },
    { source: 'jurica', documentNumber: 456 },
  ].map(documentModule.generator.generate);

  it('should fetch the specified document', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany(documents);

    const fetchedDocument = await fetchDocumentBySourceAndDocumentNumber({
      source: 'jurinet',
      documentNumber: 123,
    });

    expect(fetchedDocument).toEqual(documents[0]);
  });

  it('should return undefined', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany(documents);

    const fetchedDocument = await fetchDocumentBySourceAndDocumentNumber({
      source: 'jurinet',
      documentNumber: 456,
    });

    expect(fetchedDocument).toBe(undefined);
  });
});
