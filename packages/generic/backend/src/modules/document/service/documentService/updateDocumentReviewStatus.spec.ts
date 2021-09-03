import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentReviewStatus } from './updateDocumentReviewStatus';

describe('updateDocumentReviewStatus', () => {
  const documentRepository = buildDocumentRepository();

  it('should update hasBeenAmended in document review status', async () => {
    const document = documentModule.generator.generate({
      reviewStatus: { hasBeenAmended: false, viewerNames: ['Benoit'] },
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentReviewStatus(document._id, {
      hasBeenAmended: true,
    });

    expect(updatedDocument.reviewStatus).toEqual({
      hasBeenAmended: true,
      viewerNames: ['Benoit'],
    });
  });

  it('should update viewerNames in document review status if viewerToAdd not present', async () => {
    const document = documentModule.generator.generate({
      reviewStatus: { hasBeenAmended: false, viewerNames: ['Benoit'] },
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentReviewStatus(document._id, {
      viewerNameToAdd: 'Nicolas',
    });

    expect(updatedDocument.reviewStatus).toEqual({
      hasBeenAmended: false,
      viewerNames: ['Benoit', 'Nicolas'],
    });
  });

  it('should not update viewerNames in document review status if viewerToAdd present', async () => {
    const document = documentModule.generator.generate({
      reviewStatus: {
        hasBeenAmended: false,
        viewerNames: ['Benoit', 'Nicolas'],
      },
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentReviewStatus(document._id, {
      viewerNameToAdd: 'Nicolas',
    });

    expect(updatedDocument.reviewStatus).toEqual({
      hasBeenAmended: false,
      viewerNames: ['Benoit', 'Nicolas'],
    });
  });
});
