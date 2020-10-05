import { annotationModule, documentModule } from '@label/core';
import { buildDocumentRepository } from '../../document';
import { buildAnnotationRepository } from '../repository';
import { annotationService } from './annotationService';
import { ObjectId, ObjectID } from 'mongodb';

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
});
