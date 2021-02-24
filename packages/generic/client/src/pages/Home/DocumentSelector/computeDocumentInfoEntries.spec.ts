import { annotationModule, annotationLinkHandler } from '@label/core';
import { computeDocumentInfoEntries } from './computeDocumentInfoEntries';

describe('computeDocumentInfoEntries', () => {
  it('should return the computed document infoentries', () => {
    const annotations = [
      { category: 'firstName', text: 'Nicolas' },
      { category: 'firstName', text: 'Nicolas' },
      { category: 'firstName', text: 'nicolas' },
      { category: 'firstName', text: 'Romain' },
      { category: 'firstName', text: 'Romain' },
      { category: 'firstName', text: 'romain' },
      { category: 'firstName', text: 'Romain' },
      { category: 'firstName', text: 'Benoit' },
    ].map(annotationModule.generator.generate);
    const linkedAnnotations = annotationLinkHandler.link(
      annotations[0],
      annotations[2],
      annotationLinkHandler.link(annotations[3], annotations[5], annotations),
    );

    const documentInfoEntries = computeDocumentInfoEntries(linkedAnnotations);

    expect(documentInfoEntries).toEqual({
      annotations: 8,
      linkedEntities: 2,
      entities: 3,
    });
  });
});
