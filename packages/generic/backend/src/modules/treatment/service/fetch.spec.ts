import {
  annotationModule,
  annotationsDiffModule,
  documentModule,
  idModule,
  treatmentModule,
} from '@label/core';
import { buildDocumentRepository } from '../../../modules/document';
import { buildTreatmentRepository } from '../repository';
import {
  fetchAnnotationsDiffDetailsForDocument,
  fetchAnnotationsOfDocument,
  fetchTreatedDocumentIds,
  fetchTreatmentsByDocumentId,
  fetchTreatmentsByDocumentIds,
} from './fetch';

describe('fetch', () => {
  const treatmentRepository = buildTreatmentRepository();
  const documentRepository = buildDocumentRepository();

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

      const fetchedAnnotations = await fetchAnnotationsOfDocument(documentId);

      expect(annotationModule.lib.sortAnnotations(fetchedAnnotations)).toEqual(
        annotationsDiffModule.lib.buildAnnotationsDiff(
          [],
          annotationModule.lib.sortAnnotations([
            annotations[2],
            annotations[3],
            annotations[4],
          ]),
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

      const treatedDocumentIds = await fetchTreatedDocumentIds();

      expect(treatedDocumentIds.sort()).toEqual(
        [documentId1, documentId2].sort(),
      );
    });
  });

  describe('fetchTreatmentsByDocumentId', () => {
    it('should fetch the treatments for the given document id', async () => {
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

      const documentTreatments = await fetchTreatmentsByDocumentId(documentId1);

      expect(documentTreatments.sort()).toEqual(
        [treatments[0], treatments[1]].sort(),
      );
    });
  });

  describe('fetchTreatmentsByDocumentIds', () => {
    it('should fetch the treatments for the given document ids', async () => {
      const documentId1 = idModule.lib.buildId();
      const documentId2 = idModule.lib.buildId();
      const treatments = [
        {
          documentId: documentId1,
          order: 3,
        },
        {
          documentId: documentId1,
          order: 2,
        },
        {
          documentId: documentId2,
          order: 1,
        },
      ].map(treatmentModule.generator.generate);
      await Promise.all(treatments.map(treatmentRepository.insert));

      const documentTreatments = await fetchTreatmentsByDocumentIds([
        documentId1,
        documentId2,
      ]);

      expect(documentTreatments).toEqual({
        [idModule.lib.convertToString(documentId1)]: [
          treatments[1],
          treatments[0],
        ],
        [idModule.lib.convertToString(documentId2)]: [treatments[2]],
      });
    });
  });

  describe('fetchAnnotationsDiffDetailsForDocument', () => {
    it.only('should return the annotation diff details', async () => {
      const documentText =
        'The developer who knows all design patterns is Romain Glé.\nNicolas is a designer who speaks several languages.\nAs a data scientist, Benoit knows everything about pizzas';
      const document = documentModule.generator.generate({
        text: documentText,
      });
      const annotations = [
        { category: 'FIRST_NAME', start: 47, text: 'Romain Glé' },
        { category: 'FIRST_NAME', start: 47, text: 'Romain' },
        { category: 'LAST_NAME', start: 54, text: 'Glé' },
        { category: 'FIRST_NAME', start: 60, text: 'Nicolas' },
        { category: 'FIRST_NAME', start: 134, text: 'Benoit' },
      ].map(annotationModule.generator.generate);
      const treatment = treatmentModule.generator.generate({
        documentId: document._id,
        source: 'annotator',
        annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
          [annotations[0], annotations[4]],
          [annotations[1], annotations[2], annotations[3]],
        ),
      });
      await documentRepository.insert(document);
      await treatmentRepository.insert(treatment);

      const annotationsDiffDetails = await fetchAnnotationsDiffDetailsForDocument(
        document._id,
      );

      expect(annotationsDiffDetails).toEqual({
        addedAnnotations: [
          {
            addedAnnotation: {
              category: 'FIRST_NAME',
              entityId: 'FIRST_NAME_Nicolas',
              start: 60,
              text: 'Nicolas',
            },
            text: 'Nicolas is a designer who speaks ',
            textStart: 59,
          },
        ],
        categoryChangedAnnotations: [
          {
            annotationAfter: {
              category: 'LAST_NAME',
              entityId: 'LAST_NAME_Glé',
              start: 54,
              text: 'Glé',
            },
            annotationBefore: {
              category: 'FIRST_NAME',
              entityId: 'FIRST_NAME_Romain Glé',
              start: 47,
              text: 'Romain Glé',
            },
            text: ' all design patterns is Romain Glé.',
            textStart: 23,
          },
        ],
        deletedAnnotations: [
          {
            deletedAnnotation: {
              category: 'FIRST_NAME',
              entityId: 'FIRST_NAME_Benoit',
              start: 134,
              text: 'Benoit',
            },
            text: 'As a data scientist, Benoit knows everything about piz',
            textStart: 111,
          },
        ],
        resizedBiggerAnnotations: [],
        resizedSmallerAnnotations: [
          {
            annotationAfter: {
              category: 'FIRST_NAME',
              entityId: 'FIRST_NAME_Romain',
              start: 47,
              text: 'Romain',
            },
            annotationBefore: {
              category: 'FIRST_NAME',
              entityId: 'FIRST_NAME_Romain Glé',
              start: 47,
              text: 'Romain Glé',
            },
            text: ' all design patterns is Romain Glé.',
            textStart: 23,
          },
        ],
      });
    });
  });
});
