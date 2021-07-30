import { dateBuilder, documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { fetchDocumentsReadyToExport } from './fetchDocumentsReadyToExport';

describe('fetchDocumentsReadyToExport', () => {
  const documentRepository = buildDocumentRepository();

  it('should fetch all the documents done more than the given days ago', async () => {
    const days = 10;
    const documents = ([
      { status: 'done', updateDate: dateBuilder.daysAgo(13) },
      { status: 'pending' },
      { status: 'done', updateDate: dateBuilder.daysAgo(20) },
      { status: 'done', updateDate: dateBuilder.daysAgo(8) },
    ] as const).map(documentModule.generator.generate);
    await Promise.all(documents.map(documentRepository.insert));

    const documentsReadyToExport = await fetchDocumentsReadyToExport(days);

    expect(documentsReadyToExport.sort()).toEqual(
      [documents[0], documents[2]].sort(),
    );
  });
});
