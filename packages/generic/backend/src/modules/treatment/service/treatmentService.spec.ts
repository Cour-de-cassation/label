import { range } from 'lodash';
import {
  annotationModule,
  annotationsDiffModule,
  assignationModule,
  idModule,
  treatmentModule,
} from '@label/core';
import {
  assignationService,
  buildAssignationRepository,
} from '../../assignation';
import { buildTreatmentRepository } from '../repository';
import { treatmentService } from './treatmentService';

describe('treatmentService', () => {
  const treatmentRepository = buildTreatmentRepository();

  describe('fetchAnnotationsOfDocument', () => {
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
  describe('fetchTreatedDocumentIds', () => {
    it('should fetch the annotations from the treatments of the given document id', async () => {
      const documentId1 = idModule.lib.buildId();
      const documentId2 = idModule.lib.buildId();
      const treatments = [
        {
          documentId: documentId1,
        },
        {
          documentId: documentId1,
        },
        {
          documentId: documentId2,
        },
      ].map(treatmentModule.generator.generate);
      await Promise.all(treatments.map(treatmentRepository.insert));

      const treatedDocumentIds = await treatmentService.fetchTreatedDocumentIds();

      expect(treatedDocumentIds.sort()).toEqual(
        [documentId1, documentId2].sort(),
      );
    });
  });

  describe('fetchTreatmentsByAssignationId', () => {
    it('should return treatments mapped by assignationId', async () => {
      const assignationRepository = buildAssignationRepository();
      const treatmentRepository = buildTreatmentRepository();
      const [treatment1, treatment2] = range(2).map(() =>
        treatmentModule.generator.generate(),
      );
      const [assignation1, assignation2] = [
        treatment1,
        treatment2,
      ].map((treatment) =>
        assignationModule.generator.generate({ treatmentId: treatment._id }),
      );
      await assignationRepository.insert(assignation1);
      await assignationRepository.insert(assignation2);
      await treatmentRepository.insert(treatment1);
      await treatmentRepository.insert(treatment2);
      const assignationsById = await assignationService.fetchAllAssignationsById();

      const treatmentsByAssignationId = await treatmentService.fetchTreatmentsByAssignationId(
        assignationsById,
      );
      expect(
        idModule.lib.convertToString(
          treatmentsByAssignationId[
            idModule.lib.convertToString(assignation1._id)
          ]._id,
        ),
      ).toEqual(idModule.lib.convertToString(treatment1._id));
      expect(
        idModule.lib.convertToString(
          treatmentsByAssignationId[
            idModule.lib.convertToString(assignation2._id)
          ]._id,
        ),
      ).toEqual(idModule.lib.convertToString(treatment2._id));
    });
  });
});
