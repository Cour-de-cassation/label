import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentRoute } from './updateDocumentRoute';

describe('updateDocumentRoute', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document route', async () => {
    const document = documentModule.generator.generate({ route: 'simple' });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentRoute(
      document._id,
      'automatic',
    );

    expect(updatedDocument.route).toEqual('automatic');
  });
});
