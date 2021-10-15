import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/28_616952c63ce6293e43044f73';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add  in document model', () => {
  const decisionMetadata = {
    appealNumber: '',
    chamberName: 'Civile',
    civilCaseCode: '',
    criminalCaseCode: '',
    date: new Date().getTime(),
    jurisdiction: 'Cour de cassation',
    boundDecisionDocumentNumbers: [],
    categoriesToOmit: [],
    additionalTermsToAnnotate: '',
    occultationBlock: undefined,
    parties: [],
    session: '',
    solution: '',
  };
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        civilCaseCode: '',
        criminalCaseCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        civilCaseCode: '',
        criminalCaseCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        civilCaseCode: '',
        criminalCaseCode: '',
      },
    }),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], [
      'decisionMetadata.civilCaseCode',
      'decisionMetadata.criminalCaseCode',
    ]),
    omit(documentsWithNewModel[1], [
      'decisionMetadata.civilCaseCode',
      'decisionMetadata.criminalCaseCode',
    ]),
    omit(documentsWithNewModel[2], [
      'decisionMetadata.civilCaseCode',
      'decisionMetadata.criminalCaseCode',
    ]),
  ];

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insertMany(
      (documentsWithOldModel as any) as documentType[],
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
