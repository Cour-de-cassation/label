import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/15_6151991ad004c2d67b76a019';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('replace juridiction with jurisdiction', () => {
  const documentWithOldModel = documentModule.generator.generate({
    decisionMetadata: {
      additionalTermsToAnnotate: 'truc1',
      appealNumber: '123',
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
      additionalTermsToAnnotate: 'truc1',
      appealNumber: '123',
      boundDecisionDocumentNumbers: [1234],
      categoriesToOmit: ['machin1'],
      chamberName: 'chamber1',
      jurisdiction: 'Ccass1',
      occultationBlock: undefined,
      session: '',
      solution: '',
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
