import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentLoss } from './updateDocumentLoss';

describe('updateDocumentLoss', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document loss', async () => {
    const document = documentModule.generator.generate({ loss: 0 });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentLoss(document._id, 0.5);

    expect(updatedDocument.loss).toEqual(0.5);
  });
});
