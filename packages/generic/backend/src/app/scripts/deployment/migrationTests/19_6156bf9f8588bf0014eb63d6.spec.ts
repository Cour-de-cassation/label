import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/19_6156bf9f8588bf0014eb63d6';

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
  };
  const documentWithNewModel = documentModule.generator.generate({
    decisionMetadata: {
      ...decisionMetadata,
      categoriesToOmit: ['adresse'].sort(),
    },
  });
  const documentWithOldModel = {
    ...documentWithNewModel,
    decisionMetadata: {
      ...documentWithNewModel.decisionMetadata,
      categoriesToOmit: ['adresse', 'etablissement'],
    },
  };

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insert(documentWithOldModel);

    await up();

    const documentAfterUpdateModel = await documentRepository.findById(
      documentWithOldModel._id,
    );
    expect({
      ...documentAfterUpdateModel,
      decisionMetadata: {
        ...documentAfterUpdateModel.decisionMetadata,
        categoriesToOmit: documentAfterUpdateModel.decisionMetadata.categoriesToOmit.sort(),
      },
    }).toEqual({
      ...documentWithNewModel,
      decisionMetadata: {
        ...documentWithNewModel.decisionMetadata,
        categoriesToOmit: documentWithNewModel.decisionMetadata.categoriesToOmit.sort(),
      },
    });
  });

  it('should test down', async () => {
    const documentRepository = buildDocumentRepository();
    await documentRepository.insert(documentWithNewModel);

    await down();

    const documentAfterUpdateModel = await documentRepository.findById(
      documentWithNewModel._id,
    );
    expect({
      ...documentAfterUpdateModel,
      decisionMetadata: {
        ...documentAfterUpdateModel.decisionMetadata,
        categoriesToOmit: documentAfterUpdateModel.decisionMetadata.categoriesToOmit.sort(),
      },
    }).toEqual({
      ...documentWithOldModel,
      decisionMetadata: {
        ...documentWithOldModel.decisionMetadata,
        categoriesToOmit: documentWithOldModel.decisionMetadata.categoriesToOmit.sort(),
      },
    });
  });
});
