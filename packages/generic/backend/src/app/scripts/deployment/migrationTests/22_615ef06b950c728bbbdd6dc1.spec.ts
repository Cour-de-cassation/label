import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/22_615ef06b950c728bbbdd6dc1';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add parties in decisionMetadata in document model, delete criticity and metadata', () => {
  const decisionMetadata = {
    additionalTermsToAnnotate: '',
    appealNumber: '',
    boundDecisionDocumentNumbers: [],
    categoriesToOmit: [],
    chamberName: '',
    date: undefined,
    jurisdiction: '',
    occultationBlock: undefined,
    parties: [],
    session: '',
    solution: '',
  };
  const documentsWithNewModel = [
    documentModule.generator.generate({
      documentNumber: 0,
      decisionMetadata,
    } as any),
    documentModule.generator.generate({
      documentNumber: 0,
      decisionMetadata,
    } as any),
    documentModule.generator.generate({
      documentNumber: 0,
      decisionMetadata,
    } as any),
  ];
  const documentsWithOldModel = [
    {
      ...omit(documentsWithNewModel[0], ['decisionMetadata.parties']),
      metadata: '',
      criticity: 1,
    },
    {
      ...omit(documentsWithNewModel[1], ['decisionMetadata.parties']),
      metadata: '',
      criticity: 1,
    },
    {
      ...omit(documentsWithNewModel[2], ['decisionMetadata.parties']),
      metadata: '',
      criticity: 1,
    },
  ];

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await Promise.all(
      (documentsWithOldModel as any as documentType[]).map(
        documentRepository.insert,
      ),
    );

    await up();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(
      documentsWithNewModel.sort(),
    );
  });

  it('should test down', async () => {
    const documentRepository = buildDocumentRepository();
    await Promise.all(documentsWithNewModel.map(documentRepository.insert));

    await down();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(
      documentsWithOldModel.sort(),
    );
  });
});
