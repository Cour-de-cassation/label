import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/20_615725b9eb1b4e6ad35108f1';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('change priority value in document model', () => {
  const documentsWithNewModel = [
    documentModule.generator.generate({
      priority: 0,
      source: 'jurica',
    }),
    documentModule.generator.generate({
      priority: 2,
      source: 'jurinet',
    }),
    documentModule.generator.generate({
      priority: 4,
      source: 'jurinet',
    }),
  ];
  const documentsWithOldModel = [
    {
      ...documentsWithNewModel[0],
      priority: 'low',
    },
    {
      ...documentsWithNewModel[1],
      priority: 'medium',
    },
    {
      ...documentsWithNewModel[2],
      priority: 'high',
    },
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
