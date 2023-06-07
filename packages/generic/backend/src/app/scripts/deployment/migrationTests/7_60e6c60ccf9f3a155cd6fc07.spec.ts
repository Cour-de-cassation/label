import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/7_60e6c60ccf9f3a155cd6fc07';

xdescribe('add criticity in document model', () => {
  const documentsWithNewModel = [
    documentModule.generator.generate({
      criticity: 1,
    } as any),
    documentModule.generator.generate({
      criticity: 1,
    } as any),
    documentModule.generator.generate({
      criticity: 1,
    } as any),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], 'criticity'),
    omit(documentsWithNewModel[1], 'criticity'),
    omit(documentsWithNewModel[2], 'criticity'),
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
