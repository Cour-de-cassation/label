import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/18_61557181e37ee85bda0fa723';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add categories that must not be annotated', () => {
  const decisionMetadata: documentType['decisionMetadata'] = {
    additionalTermsToAnnotate: '',
    appealNumber: '',
    boundDecisionDocumentNumbers: [],
    categoriesToOmit: [],
    chamberName: '',
    date: undefined,
    jurisdiction: '',
    occultationBlock: undefined,
    session: '',
    solution: '',
  } as any;
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        categoriesToOmit: [
          'adresse',
          'personneMorale',
          'numeroSiretSiren',
          'etablissement',
          'professionnelMagistratGreffier',
        ].sort(),
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        categoriesToOmit: [
          'personnePhysique',
          'personneMorale',
          'numeroSiretSiren',
          'etablissement',
          'professionnelMagistratGreffier',
        ].sort(),
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        categoriesToOmit: [
          'dateNaissance',
          'personneMorale',
          'numeroSiretSiren',
          'etablissement',
          'professionnelMagistratGreffier',
        ].sort(),
      },
    }),
  ];
  const documentsWithOldModel = [
    {
      ...documentsWithNewModel[0],
      decisionMetadata: {
        ...documentsWithNewModel[0].decisionMetadata,
        categoriesToOmit: ['adresse'],
      },
    },
    {
      ...documentsWithNewModel[1],
      decisionMetadata: {
        ...documentsWithNewModel[1].decisionMetadata,
        categoriesToOmit: ['personnePhysique'],
      },
    },
    {
      ...documentsWithNewModel[2],
      decisionMetadata: {
        ...documentsWithNewModel[2].decisionMetadata,
        categoriesToOmit: ['dateNaissance'],
      },
    },
  ];

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await Promise.all(
      ((documentsWithOldModel as any) as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await up();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(
      documentsAfterUpdateModel
        .map((document) => ({
          ...document,
          decisionMetadata: {
            ...document.decisionMetadata,
            categoriesToOmit: document.decisionMetadata.categoriesToOmit.sort(),
          },
        }))
        .sort(),
    ).toEqual(
      documentsWithNewModel
        .map((document) => ({
          ...document,
          decisionMetadata: {
            ...document.decisionMetadata,
            categoriesToOmit: document.decisionMetadata.categoriesToOmit.sort(),
          },
        }))
        .sort(),
    );
  });

  it('should test down', async () => {
    const documentRepository = buildDocumentRepository();
    await Promise.all(documentsWithNewModel.map(documentRepository.insert));

    await down();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(
      documentsAfterUpdateModel
        .map((document) => ({
          ...document,
          decisionMetadata: {
            ...document.decisionMetadata,
            categoriesToOmit: document.decisionMetadata.categoriesToOmit.sort(),
          },
        }))
        .sort(),
    ).toEqual(
      documentsWithOldModel
        .map((document) => ({
          ...document,
          decisionMetadata: {
            ...document.decisionMetadata,
            categoriesToOmit: document.decisionMetadata.categoriesToOmit.sort(),
          },
        }))
        .sort(),
    );
  });
});
