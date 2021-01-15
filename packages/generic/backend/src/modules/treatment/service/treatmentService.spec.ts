import {
  annotationModule,
  annotationsDiffModule,
  idModule,
  treatmentModule,
} from '@label/core';
import { buildTreatmentRepository } from '../repository';
import { treatmentService } from './treatmentService';

describe('treatmentService', () => {
  describe('fetchAnnotationsOfDocument', () => {
    const treatmentRepository = buildTreatmentRepository();

    it('should fetch the annotations from the treatments of the given document id', async () => {
      const annotations = [
        { text: '0' },
        { text: '1' },
        { text: '2' },
        { text: '3' },
        { text: '4' },
      ].map(annotationModule.generator.generate);
      const documentId = idModule.lib.buildId();
      const treatments = [
        {
          annotationsDiff: annotationsDiffModule.generator.generate({
            before: [],
            after: [annotations[0], annotations[1]],
          }),
          documentId,
          order: 0,
        },
        {
          annotationsDiff: annotationsDiffModule.generator.generate({
            before: [annotations[0]],
            after: [annotations[2]],
          }),
          documentId,
          order: 1,
        },
        {
          annotationsDiff: annotationsDiffModule.generator.generate({
            before: [annotations[1]],
            after: [annotations[3], annotations[4]],
          }),
          documentId,
          order: 2,
        },
      ].map(treatmentModule.generator.generate);
      await Promise.all(treatments.map(treatmentRepository.insert));

      const fetchedAnnotations = await treatmentService.fetchAnnotationsOfDocument(
        documentId,
      );

      expect(fetchedAnnotations).toEqual(
        annotationsDiffModule.lib.buildAnnotationsDiff(
          [],
          [annotations[2], annotations[3], annotations[4]],
        ).after,
      );
    });
  });
});
