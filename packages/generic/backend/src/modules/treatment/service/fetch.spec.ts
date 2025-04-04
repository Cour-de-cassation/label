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
          source: 'NLP' as const,
        },
        {
          annotationsDiff: annotationsDiffModule.generator.generate({
            before: [annotations[0]],
            after: [annotations[2]],
          }),
          documentId,
          order: 1,
          source: 'postProcess' as const,
        },
        {
          annotationsDiff: annotationsDiffModule.generator.generate({
            before: [annotations[1]],
            after: [annotations[3], annotations[4]],
          }),
          documentId,
          order: 2,
          source: 'admin' as const,
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
          source: 'NLP' as const,
        },
        {
          documentId: documentId1,
          source: 'postProcess' as const,
        },
        {
          documentId: documentId2,
          source: 'admin' as const,
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
          source: 'NLP' as const,
        },
        {
          documentId: documentId1,
          source: 'postProcess' as const,
        },
        {
          documentId: documentId2,
          source: 'admin' as const,
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
          source: 'NLP' as const,
        },
        {
          documentId: documentId1,
          order: 2,
          source: 'postProcess' as const,
        },
        {
          documentId: documentId2,
          order: 1,
          source: 'admin' as const,
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
    it('should return the annotation diff details', async () => {
      const documentText =
        'The developer who knows all design patterns is Romain Glé.\nNicolas is a designer who speaks several languages.\nAs a data scientist, Benoit knows everything about pizzas';
      const document = documentModule.generator.generate({
        text: documentText,
      });
      const annotations = [
        {
          category: 'FIRST_NAME',
          start: 47,
          text: 'Romain Glé',
          source: 'test',
        },
        { category: 'FIRST_NAME', start: 47, text: 'Romain', source: 'test' },
        { category: 'LAST_NAME', start: 54, text: 'Glé', source: 'test' },
        { category: 'FIRST_NAME', start: 60, text: 'Nicolas', source: 'test2' },
        { category: 'FIRST_NAME', start: 134, text: 'Benoit', source: 'test2' },
      ].map(annotationModule.generator.generate);
      const previousTreatments = [
        { order: 0, source: 'NLP' as const },
        { order: 1, source: 'postProcess' as const },
      ].map(treatmentModule.generator.generate);
      const humanTreatment = treatmentModule.generator.generate({
        documentId: document._id,
        source: 'annotator',
        order: 2,
        annotationsDiff: annotationsDiffModule.lib.computeAnnotationsDiff(
          [annotations[0], annotations[4]],
          [annotations[1], annotations[2], annotations[3]],
        ),
      });
      await documentRepository.insert(document);
      await treatmentRepository.insertMany([
        ...previousTreatments,
        humanTreatment,
      ]);

      const annotationsDiffDetails = await fetchAnnotationsDiffDetailsForDocument(
        document._id,
      );

      expect(annotationsDiffDetails).toEqual({
        addedAnnotations: [
          {
            addedAnnotation: {
              category: 'FIRST_NAME',
              score: 1,
              entityId: 'FIRST_NAME_nicolas',
              start: 60,
              text: 'Nicolas',
              source: 'test2',
            },
            text: 'Nicolas is a designer who speaks ',
            textStart: 59,
          },
        ],
        categoryChangedAnnotations: [],
        deletedAnnotations: [
          {
            deletedAnnotation: {
              category: 'FIRST_NAME',
              score: 1,
              entityId: 'FIRST_NAME_benoit',
              start: 134,
              text: 'Benoit',
              source: 'test2',
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
              score: 1,
              entityId: 'FIRST_NAME_romain',
              start: 47,
              text: 'Romain',
              source: 'test',
            },
            annotationBefore: {
              category: 'FIRST_NAME',
              score: 1,
              entityId: 'FIRST_NAME_romain gle',
              start: 47,
              text: 'Romain Glé',
              source: 'test',
            },
            text: ' all design patterns is Romain Glé.',
            textStart: 23,
          },
        ],
      });
    });
  });
});
