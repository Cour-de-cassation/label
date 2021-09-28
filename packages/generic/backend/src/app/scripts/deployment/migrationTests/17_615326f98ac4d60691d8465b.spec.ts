import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/17_615326f98ac4d60691d8465b';
import { extractDateFromTitle } from '../migrations/17_615326f98ac4d60691d8465b';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('add date to decisionMetadata', () => {
  const documentWithOldModel = documentModule.generator.generate({
    title: 'Décision n°1294962 · pourvoi n°08-19.120 · CIV.1 · 12/04/2016',
    decisionMetadata: {
      appealNumber: '2321',
      additionalTermsToAnnotate: 'truc1',
      boundDecisionDocumentNumbers: [1234],
      categoriesToOmit: ['machin1'],
      chamberName: 'chamber1',
      jurisdiction: 'Ccass1',
      occultationBlock: undefined,
      session: '',
      solution: '',
    } as any,
  });

  const documentWithNewModel = documentModule.generator.generate({
    ...documentWithOldModel,
    decisionMetadata: {
      ...documentWithOldModel.decisionMetadata,
      date: 1460472934310,
    },
  });

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insert(documentWithOldModel);

    await up();

    const documentAfterUpdateModel = await documentRepository.findById(
      documentWithOldModel._id,
    );
    const decisionDateAfterUpdateModel =
      documentAfterUpdateModel.decisionMetadata.date;
    const decisionDateNewModel = documentWithNewModel.decisionMetadata.date;
    if (!decisionDateAfterUpdateModel || !decisionDateNewModel) {
      throw new Error('Error : decisionDate not defined');
    }
    const formattedNewDate = new Date();
    const formattedAfterUpdateDate = new Date();
    formattedAfterUpdateDate.setTime(decisionDateAfterUpdateModel);
    formattedNewDate.setTime(decisionDateNewModel);
    expect(formattedAfterUpdateDate.getMonth()).toEqual(
      formattedNewDate.getMonth(),
    );
    expect(formattedAfterUpdateDate.getDate()).toEqual(
      formattedNewDate.getDate(),
    );
    expect(formattedAfterUpdateDate.getFullYear()).toEqual(
      formattedNewDate.getFullYear(),
    );
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

describe('extractDateFromTitle', () => {
  it('should extract the date from the title', () => {
    const title =
      'Décision n°1294962 · pourvoi n°08-19.120 · CIV.1 · 12/04/2016';
    const date = extractDateFromTitle(title);

    expect(date?.getDate()).toEqual(12);
    expect(date?.getMonth()).toEqual(3);
    expect(date?.getFullYear()).toEqual(2016);
  });
});
