import { sortBy } from 'lodash';
import { annotationModule, documentModule, idModule } from '@label/core';
import { buildDocumentRepository } from '../../document';
import { buildAnnotationRepository } from '../repository';
import { annotationService } from './annotationService';

describe('annotationService', () => {
  describe('fetchAnnotationsOfDocument', () => {
    const documentRepository = buildDocumentRepository();
    const annotationRepository = buildAnnotationRepository();

    it('should fetch the annotations linked to the given document id', async () => {
      const document = documentModule.generator.generate();
      const annotations = [
        annotationModule.generator.generate({ documentId: document._id }),
        annotationModule.generator.generate({ documentId: document._id }),
      ];
      await documentRepository.insert(document);
      await Promise.all(annotations.map(annotationRepository.insert));

      const fetchedAnnotations = await annotationService.fetchAnnotationsOfDocument(
        JSON.parse(JSON.stringify(document._id)),
      );

      expect(fetchedAnnotations).toEqual(annotations);
    });
  });

  describe('updateAnnotations', () => {
    it('should set the new annotations for the given documentId', async () => {
      const annotationRepository = buildAnnotationRepository();
      const documentId = idModule.lib.buildId();
      const annotations = [
        { documentId: documentId },
        { documentId: documentId },
        {},
      ].map(annotationModule.generator.generate);
      await Promise.all(annotations.map(annotationRepository.insert));
      const fetchedAnnotations = [
        {
          category: 'NEW_CATEGORY_1',
          entityId: 'NEW_ENTITY_ID_1',
          source: 'label',
          _id: annotations[0]._id,
          start: 0,
          text: 'NEW_TEXT_1',
        },
        {
          category: 'NEW_CATEGORY_2',
          entityId: 'NEW_ENTITY_ID_2',
          source: 'label',
          _id: annotations[1]._id,
          start: 0,
          text: 'NEW_TEXT_2',
        },
      ];

      await annotationService.updateAnnotations(documentId, fetchedAnnotations);

      const annotationsAfterCall = await annotationRepository.findAll();
      const newAnnotations = [
        ...fetchedAnnotations.map((fetchedAnnotation) => ({
          ...fetchedAnnotation,
          documentId,
        })),
        annotations[2],
      ];
      expect(sortBy(annotationsAfterCall, 'text')).toEqual(
        sortBy(newAnnotations, 'text'),
      );
    });
  });
});
