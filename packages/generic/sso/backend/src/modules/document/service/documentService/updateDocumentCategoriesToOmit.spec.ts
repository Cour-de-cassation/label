import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentCategoriesToOmit } from './updateDocumentCategoriesToOmit';

describe('updateDocumentCategoriesToOmit', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document categoriesToOmit', async () => {
    const document = documentModule.generator.generate({
      decisionMetadata: documentModule.decisionMetadataGenerator.generate({
        categoriesToOmit: ['categorie1', 'categorie2'],
      }),
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentCategoriesToOmit(document._id, [
      'categorie3',
      'category4',
    ]);

    expect(updatedDocument.decisionMetadata.categoriesToOmit).toEqual([
      'categorie3',
      'category4',
    ]);
  });
});
