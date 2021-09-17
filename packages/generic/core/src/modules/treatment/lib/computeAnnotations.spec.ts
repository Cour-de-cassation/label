import { annotationModule } from '../../annotation';
import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { treatmentGenerator } from '../generator';
import { computeAnnotations, computeAnnotationsDiff } from './computeAnnotations';

describe('computeAnnotations', () => {
  const annotations = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }].map(
    annotationModule.generator.generate,
  );
  const documentId = idModule.lib.buildId();

  it('should compute the annotations set from treatments', () => {
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
        source: 'annotator' as const,
      },
    ].map(treatmentGenerator.generate);

    const annotationsFromTreatments = computeAnnotations(treatments);

    expect(annotationModule.lib.sortAnnotations(annotationsFromTreatments)).toEqual(
      annotationModule.lib.sortAnnotations([annotations[2], annotations[3], annotations[4]]),
    );
  });

  it('should throw if the treatment are not on the same document', () => {
    const treatments = [
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [],
          after: [annotations[0], annotations[1]],
        }),
        documentId: idModule.lib.buildId(),
        order: 0,
        source: 'NLP' as const,
      },
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [annotations[0]],
          after: [annotations[2]],
        }),
        documentId: idModule.lib.buildId(),
        order: 1,
        source: 'postProcess' as const,
      },
    ].map(treatmentGenerator.generate);

    expect(() => computeAnnotations(treatments)).toThrow(
      `Can not compute annotations from inconsistent treatments : [${idModule.lib.convertToString(
        treatments[0]._id,
      )}, ${idModule.lib.convertToString(treatments[1]._id)}]`,
    );
  });

  it('should throw if the first treatment is empty at the beginning', () => {
    const treatments = [
      {
        annotationsDiff: annotationsDiffModule.generator.generate({
          before: [annotations[3]],
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
    ].map(treatmentGenerator.generate);

    expect(() => computeAnnotations(treatments)).toThrow(
      `Can not compute annotations from inconsistent treatments : [${idModule.lib.convertToString(
        treatments[0]._id,
      )}, ${idModule.lib.convertToString(treatments[1]._id)}]`,
    );
  });

  it('should throw if there are missing treatments', () => {
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
        order: 2,
        source: 'postProcess' as const,
      },
    ].map(treatmentGenerator.generate);

    expect(() => computeAnnotations(treatments)).toThrow(
      `Can not compute annotations from inconsistent treatments : [${idModule.lib.convertToString(
        treatments[0]._id,
      )}, ${idModule.lib.convertToString(treatments[1]._id)}]`,
    );
  });
});

describe('computeAnnotationsDiff', () => {
  const annotations = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }].map(
    annotationModule.generator.generate,
  );
  const documentId = idModule.lib.buildId();

  it('should compute the annotations set from treatments', () => {
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
        source: 'annotator' as const,
      },
    ].map(treatmentGenerator.generate);

    const annotationDiffs = computeAnnotationsDiff(treatments);

    expect(annotationDiffs).toEqual({ before: [], after: [annotations[2], annotations[3], annotations[4]] });
  });
});
