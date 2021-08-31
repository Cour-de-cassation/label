import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/11_611bc0b421f329ab25d1d814';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add session, occultationBlock, solution in document model', () => {
  const documentsWithNewModel = [
    documentModule.generator.generate({
      decisionMetadata: {
        additionalTermsToAnnotate: 'truc1',
        boundDecisionDocumentNumbers: [1234],
        categoriesToOmit: ['machin1'],
        chamberName: 'chamber1',
        juridiction: 'Ccass1',
        occultationBlock: undefined,
        session: '',
        solution: '',
      } as any,
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        additionalTermsToAnnotate: 'truc2',
        boundDecisionDocumentNumbers: [1235],
        categoriesToOmit: ['machin2'],
        chamberName: 'chamber2',
        juridiction: 'Ccass2',
        occultationBlock: undefined,
        session: '',
        solution: '',
      } as any,
    }),
    documentModule.generator.generate({
      decisionMetadata: {
        additionalTermsToAnnotate: 'truc3',
        boundDecisionDocumentNumbers: [1236],
        categoriesToOmit: ['machin3'],
        chamberName: 'chamber3',
        juridiction: 'Ccass3',
        occultationBlock: undefined,
        session: '',
        solution: '',
      } as any,
    }),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], [
      'decisionMetadata.occultationBlock',
      'decisionMetadata.session',
      'decisionMetadata.solution',
    ]),
    omit(documentsWithNewModel[1], [
      'decisionMetadata.occultationBlock',
      'decisionMetadata.session',
      'decisionMetadata.solution',
    ]),
    omit(documentsWithNewModel[2], [
      'decisionMetadata.occultationBlock',
      'decisionMetadata.session',
      'decisionMetadata.solution',
    ]),
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
