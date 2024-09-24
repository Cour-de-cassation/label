import { documentModule } from '@label/core';
import { fetchDocumentWithoutAnnotationsNotIn } from './fetchDocumentWithoutAnnotationsNotIn';
import { buildDocumentRepository } from '../../repository';

describe('fetchDocumentWithoutAnnotationsNotIn', () => {
  const documentRepository = buildDocumentRepository();

  it('should fetch all the to annotate in priority order', async () => {
    const documentPriority4 = documentModule.generator.generate({
      priority: 4,
      status: 'loaded',
    });
    const documentPriority3 = documentModule.generator.generate({
      priority: 3,
      status: 'loaded',
    });
    const documentPriority2 = documentModule.generator.generate({
      priority: 2,
      status: 'loaded',
    });
    const documentPriority1 = documentModule.generator.generate({
      priority: 1,
      status: 'loaded',
    });
    const documentPriority0 = documentModule.generator.generate({
      priority: 0,
      status: 'loaded',
    });

    documentRepository.insert(documentPriority0);
    documentRepository.insert(documentPriority1);
    documentRepository.insert(documentPriority2);
    documentRepository.insert(documentPriority3);
    documentRepository.insert(documentPriority4);

    expect(await fetchDocumentWithoutAnnotationsNotIn([])).toEqual(
      documentPriority4,
    );

    expect(
      await fetchDocumentWithoutAnnotationsNotIn([documentPriority4._id]),
    ).toEqual(documentPriority3);

    expect(
      await fetchDocumentWithoutAnnotationsNotIn([
        documentPriority4._id,
        documentPriority3._id,
      ]),
    ).toEqual(documentPriority2);

    expect(
      await fetchDocumentWithoutAnnotationsNotIn([
        documentPriority4._id,
        documentPriority3._id,
        documentPriority2._id,
      ]),
    ).toEqual(documentPriority1);

    expect(
      await fetchDocumentWithoutAnnotationsNotIn([
        documentPriority4._id,
        documentPriority3._id,
        documentPriority2._id,
        documentPriority1._id,
      ]),
    ).toEqual(documentPriority0);
  });
});
