import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentChecklist } from './updateDocumentChecklist';

describe('updateDocumentChecklist', () => {
  const documentRepository = buildDocumentRepository();

  const checklist = [
    {
      checkType: `My checkType`,
      message: 'My check message',
      short_message: 'Short message',
      entities: [
        {
          text: 'Julie',
          start: 2,
          category: 'personnePhysique',
          source: 'postprocess',
          score: 1.0,
          entityId: 'personnePhysique_julie',
          end: 7,
        },
      ],
      sentences: [
        {
          start: 1,
          end: 3,
        },
      ],
      metadata_text: ['metadata'],
    },
  ];

  it('should update document checklist', async () => {
    const document = documentModule.generator.generate();
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentChecklist(
      document._id,
      checklist,
    );

    expect(updatedDocument.checklist).toEqual(checklist);
  });
});
