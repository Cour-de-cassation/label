import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/10_61026de3599c2d33728fc317';

describe('add reviewStatus in document model', () => {
  const documentsWithNewModel = [
    documentModule.generator.generate({
      reviewStatus: 'none',
    }),
    documentModule.generator.generate({
      reviewStatus: 'none',
    }),
    documentModule.generator.generate({
      reviewStatus: 'none',
    }),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], 'reviewStatus'),
    omit(documentsWithNewModel[1], 'reviewStatus'),
    omit(documentsWithNewModel[2], 'reviewStatus'),
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
