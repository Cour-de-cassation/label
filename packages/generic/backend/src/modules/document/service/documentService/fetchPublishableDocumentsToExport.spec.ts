import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { fetchPublishableDocumentsToExport } from './fetchPublishableDocumentsToExport';

describe('fetchPublishableDocumentsToExport', () => {
  const documentRepository = buildDocumentRepository();

  it('should fetch all the published documents', async () => {
    const documents = [
      {
        status: 'done' as const,
        publicationCategory: ['P'],
      },
      { status: 'pending' as const, publicationCategory: ['B'] },
      { status: 'done' as const, publicationCategory: ['I'] },
      { status: 'done' as const, publicationCategory: ['B'] },
      { status: 'toBePublished' as const, publicationCategory: ['B'] },
    ].map(documentModule.generator.generate);
    await Promise.all(documents.map(documentRepository.insert));

    const publishableDocumentsToExport = await fetchPublishableDocumentsToExport();

    expect(publishableDocumentsToExport.sort()).toEqual([
      documents[0],
      documents[3],
      documents[4],
    ]);
  });
});
