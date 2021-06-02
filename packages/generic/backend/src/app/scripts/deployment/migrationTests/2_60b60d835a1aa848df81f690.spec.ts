import { omit } from 'lodash';
import { documentModule, documentType } from '@label/core';
import { buildDocumentRepository } from '../../../../modules/document';
import { up, down } from '../migrations/2_60b60d835a1aa848df81f690';

describe('add categoriesToOmit and additionalTermsToAnnotate in document model', () => {
  const documentsWithNewModel = [
    documentModule.generator.generate({}),
    documentModule.generator.generate({}),
    documentModule.generator.generate({}),
  ];
  const documentsWithOldModel = [
    omit(documentsWithNewModel[0], [
      'decisionMetadata.categoriesToOmit',
      'decisionMetadata.additionalTermsToAnnotate',
    ]),
    omit(documentsWithNewModel[1], [
      'decisionMetadata.categoriesToOmit',
      'decisionMetadata.additionalTermsToAnnotate',
    ]),
    omit(documentsWithNewModel[2], [
      'decisionMetadata.categoriesToOmit',
      'decisionMetadata.additionalTermsToAnnotate',
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
