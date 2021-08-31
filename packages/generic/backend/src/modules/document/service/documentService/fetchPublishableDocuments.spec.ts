import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { fetchPublishableDocuments } from './fetchPublishableDocuments';

describe('fetchPublishableDocuments', () => {
  const documentRepository = buildDocumentRepository();

  it('should fetch all the published documents', async () => {
    const documents = [
      {
        status: 'done' as const,
        publicationCategory: ['P'],
        decisionMetadata: {
          juridiction: 'Cour de cassation',
          chamberName: 'CIV. I',
          additionalTermsToAnnotate: '',
          boundDecisionDocumentNumbers: [],
          categoriesToOmit: [],
          session: '',
          solution: '',
          occultationBlock: undefined,
        },
      },
      { status: 'pending' as const, publicationCategory: [] },
      { status: 'done' as const, publicationCategory: ['I'] },
      { status: 'done' as const, publicationCategory: [] },
    ].map(documentModule.generator.generate);
    await Promise.all(documents.map(documentRepository.insert));

    const publishableDocuments = await fetchPublishableDocuments();

    const {
      _id,
      status,
      creationDate,
      documentNumber,
      publicationCategory,
    } = documents[0];
    expect(publishableDocuments).toEqual([
      {
        _id,
        status,
        creationDate,
        documentNumber,
        juridiction: 'Cour de cassation',
        chamberName: 'CIV. I',
        publicationCategory,
      },
    ]);
  });
});
