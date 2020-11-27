import { annotationModule } from '@label/core';
import { computeDocumentInfoEntries } from './computeDocumentInfoEntries';

describe('computeDocumentInfoEntries', () => {
  it('should return the computed document infoentries', () => {
    const annotations = [
      { category: 'firstName', text: 'Nicolas' },
      { category: 'firstName', text: 'Nicolas' },
      { category: 'firstName', text: 'Nicolas' },
      { category: 'firstName', text: 'Romain' },
      { category: 'firstName', text: 'Romain' },
      { category: 'firstName', text: 'Romain' },
      { category: 'firstName', text: 'Benoit' },
    ].map(annotationModule.generator.generate);

    const documentInfoEntries = computeDocumentInfoEntries(annotations);

    expect(documentInfoEntries).toEqual({
      annotations: 7,
      linkedEntities: 2,
      entities: 3,
    });
  });
});
