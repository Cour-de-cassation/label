import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/34_61c2f20f5f28c12d9b54c762';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add endCaseCode in document model', () => {
  const decisionMetadata = {
    appealNumber: '',
    chamberName: 'Civile',
    civilMatterCode: '',
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
    NACCode: '',
  };
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        endCaseCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        endCaseCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        endCaseCode: '',
      },
    }),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], ['decisionMetadata.endCaseCode']),
    omit(documentsWithNewModel[1], ['decisionMetadata.endCaseCode']),
    omit(documentsWithNewModel[2], ['decisionMetadata.endCaseCode']),
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
    await documentRepository.insertMany(documentsWithNewModel);
    await down();

    const documentsAfterUpdateModel = await documentRepository.findAll();
    expect(documentsAfterUpdateModel.sort()).toEqual(
      documentsWithOldModel.sort(),
    );
  });
});
