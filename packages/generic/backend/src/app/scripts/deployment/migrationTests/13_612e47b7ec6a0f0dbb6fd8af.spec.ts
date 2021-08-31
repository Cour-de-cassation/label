import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/13_612e47b7ec6a0f0dbb6fd8af';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add appealNumber to decisionMetadata', () => {
  const documentWithOldModel = documentModule.generator.generate({
    text: 'Pourvoi n° K 08-16.486 de telle décision',
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
  });
  const documentWithNewModel = documentModule.generator.generate({
    ...documentWithOldModel,
    decisionMetadata: {
      ...documentWithOldModel.decisionMetadata,
      appealNumber: '08-16.486',
    },
  });

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insert(documentWithOldModel);

    await up();

    const documentAfterUpdateModel = await documentRepository.findById(
      documentWithOldModel._id,
    );
    expect(documentAfterUpdateModel).toEqual(documentWithNewModel);
  });

  it('should test down', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insert(documentWithNewModel);
    await down();

    const documentAfterUpdateModel = await documentRepository.findById(
      documentWithNewModel._id,
    );
    expect(documentAfterUpdateModel).toEqual(documentWithOldModel);
  });
});
