import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentNlpVersions } from './updateDocumentNlpVersions';
describe('updateDocumentNlpVersions', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document nlpVersions', async () => {
    const document = documentModule.generator.generate();
    await documentRepository.insert(document);

    const nlpVersionsMock = {
      juriSpacyTokenizer: {
        version: 'VERSION',
        date: 'DATE',
      },
      juritools: {
        version: 'VERSION',
        date: 'DATE',
      },
      pseudonymisationApi: {
        version: 'VERSION',
        date: 'DATE',
      },
      model: {
        name: 'MODEL',
      },
    };

    const updatedDocument = await updateDocumentNlpVersions(
      document._id,
      nlpVersionsMock,
    );

    expect(updatedDocument).toEqual(nlpVersionsMock);
  });
});
