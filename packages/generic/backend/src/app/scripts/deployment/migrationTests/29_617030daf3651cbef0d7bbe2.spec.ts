import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/29_617030daf3651cbef0d7bbe2';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add civil code matter in document model', () => {
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
    endCaseCode: '',
  };
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        civilMatterCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        civilMatterCode: '',
      },
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        ...decisionMetadata,
        civilMatterCode: '',
      },
    }),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], ['decisionMetadata.civilMatterCode']),
    omit(documentsWithNewModel[1], ['decisionMetadata.civilMatterCode']),
    omit(documentsWithNewModel[2], ['decisionMetadata.civilMatterCode']),
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
