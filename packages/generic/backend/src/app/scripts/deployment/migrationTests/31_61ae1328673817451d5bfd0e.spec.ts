import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/31_61ae1328673817451d5bfd0e';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add NACCode in document model', () => {
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
  };
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        NACCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        NACCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        NACCode: '',
      },
    }),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], ['decisionMetadata.NACCode']),
    omit(documentsWithNewModel[1], ['decisionMetadata.NACCode']),
    omit(documentsWithNewModel[2], ['decisionMetadata.NACCode']),
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
