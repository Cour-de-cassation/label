import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { fetchPublishableDocuments } from './fetchPublishableDocuments';

describe('fetchPublishableDocuments', () => {
  const documentRepository = buildDocumentRepository();

  it('should fetch documents with route and/or publication categories', async () => {
    // Document 1: Positive scenarios (route: confirmation, various publicationCategories)
    const document1 = [
      {
        status: 'done' as const,
        publicationCategory: ['P'],
        decisionMetadata: {
          additionalTermsToAnnotate: '',
          computedAdditionalTerms: undefined,
          appealNumber: '08-16.486',
          boundDecisionDocumentNumbers: [],
          categoriesToOmit: [],
          chamberName: 'CIV. I',
          criminalCaseCode: '',
          civilCaseCode: '',
          civilMatterCode: '',
          date: new Date().getTime(),
          jurisdiction: 'Cour de cassation',
          parties: [],
          occultationBlock: undefined,
          session: '',
          solution: '',
          NACCode: '',
          endCaseCode: '',
        },
        route: 'confirmation' as documentType['route'],
      },
      {
        status: 'done' as const,
        publicationCategory: ['B'],
        route: 'confirmation' as documentType['route'],
      },
      {
        status: 'done' as const,
        publicationCategory: ['B', 'P'],
        route: 'confirmation' as documentType['route'],
      },
      {
        status: 'done' as const,
        publicationCategory: [],
        route: 'confirmation' as documentType['route'],
      },
      {
        status: 'done' as const,
        publicationCategory: ['P', 'B'],
        route: 'default' as const,
      },
    ].map(documentModule.generator.generate);

    //Negative scenario
    const document2 = documentModule.generator.generate({
      status: 'pending' as const,
      publicationCategory: [],
      route: 'exhaustive' as documentType['route'],
    });

    const document3 = documentModule.generator.generate({
      status: 'done' as const,
      publicationCategory: ['I'],
      route: 'default' as documentType['route'],
    });

    const document4 = documentModule.generator.generate({
      status: 'done' as const,
      publicationCategory: [],
      route: 'exhaustive' as documentType['route'],
    });

    await documentRepository.insertMany([
      ...document1,
      document2,
      document3,
      document4,
    ]);
    const publishableDocuments = await fetchPublishableDocuments();

    // Check if the expected documents are included in the result
    const expectedDocuments = document1.map((doc) => ({
      _id: doc._id,
      appealNumber: doc.decisionMetadata.appealNumber,
      status: doc.status,
      creationDate: doc.creationDate,
      documentNumber: doc.documentNumber,
      jurisdiction: doc.decisionMetadata.jurisdiction,
      chamberName: doc.decisionMetadata.chamberName,
      route: doc.route,
      publicationCategory: doc.publicationCategory,
    }));

    expect(publishableDocuments).toEqual(expectedDocuments);
  });
});
