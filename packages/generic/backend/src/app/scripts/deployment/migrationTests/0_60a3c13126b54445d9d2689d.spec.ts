import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/0_60a3c13126b54445d9d2689d';

describe('replace document markedAsPublished with toBePublished / published.spec', () => {
  const documentsWithNewModel = [
    documentModule.generator.generate({
      publicationCategory: ['P'],
      status: 'toBePublished',
    }),
    documentModule.generator.generate({
      publicationCategory: ['P'],
      status: 'done',
    }),
    documentModule.generator.generate({ status: 'done' }),
  ];
  const documentsWithOldModel = [
    { ...documentsWithNewModel[0], status: 'done', markedAsPublished: false },
    { ...documentsWithNewModel[1], markedAsPublished: true },
    { ...documentsWithNewModel[2], markedAsPublished: false },
  ];

  it('should test up', async () => {
    const documentRepository = buildDocumentRepository();
    await Promise.all(
      (documentsWithOldModel as any as documentType[]).map(
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
