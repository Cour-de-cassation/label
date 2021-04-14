import { documentModule } from '@label/core';
import { dateBuilder } from '../../utils';
import { buildDocumentRepository } from '../../modules/document';
import { freePendingDocuments } from './freePendingDocuments';

describe('freePendingDocuments', () => {
  it('should free all the document that are pending from more than the given minutes', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = ([
      { status: 'pending', updateDate: dateBuilder.minutesAgo(16) },
      { status: 'pending', updateDate: dateBuilder.minutesAgo(7) },
      { status: 'pending', updateDate: dateBuilder.minutesAgo(30) },
      { status: 'free' },
      { status: 'saved' },
    ] as const).map(documentModule.generator.generate);
    await Promise.all(documents.map(documentRepository.insert));

    await freePendingDocuments(15);

    const updatedDocument0 = await documentRepository.findById(
      documents[0]._id,
    );
    const updatedDocument1 = await documentRepository.findById(
      documents[1]._id,
    );
    const updatedDocument2 = await documentRepository.findById(
      documents[2]._id,
    );
    const updatedDocument3 = await documentRepository.findById(
      documents[3]._id,
    );
    const updatedDocument4 = await documentRepository.findById(
      documents[4]._id,
    );
    expect(updatedDocument0).toEqual({
      ...documents[0],
      status: 'free',
      updateDate: updatedDocument0.updateDate,
    });
    expect(updatedDocument1).toEqual(documents[1]);
    expect(updatedDocument2).toEqual({
      ...documents[2],
      status: 'free',
      updateDate: updatedDocument2.updateDate,
    });
    expect(updatedDocument3).toEqual(documents[3]);
    expect(updatedDocument4).toEqual(documents[4]);
  });
});
