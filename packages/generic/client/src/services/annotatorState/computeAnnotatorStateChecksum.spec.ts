import { annotationModule, settingsModule, documentModule } from '@label/core';
import { range } from 'lodash';
import { computeAnnotatorStateChecksum } from './computeAnnotatorStateChecksum';

describe('computeAnnotatorStateChecksum', () => {
  const document = documentModule.generator.generate();
  const settings = settingsModule.lib.buildSettings({ prenom: {}, nom: {} });

  it('should return the same checksum every time for the same array', () => {
    const annotations = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
      }),
    );
    const annotatorState = {
      document,
      settings,
      annotations: annotations,
      mandatoryReplacementTerms: undefined,
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState);

    expect(annotatorStateChecksum1).toEqual(annotatorStateChecksum2);
  });

  it('should return the same checksum for reversed annotations', () => {
    const annotations1 = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({ category: 'prenom', start: index * 10, text: 'TRUC' }),
    );
    const annotations2 = [...annotations1].reverse();
    const annotatorState1 = {
      document,
      settings,
      annotations: annotations1,
      mandatoryReplacementTerms: undefined,
    };
    const annotatorState2 = {
      document,
      settings,
      annotations: annotations2,
      mandatoryReplacementTerms: undefined,
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState1);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState2);

    expect(annotatorStateChecksum1).toEqual(annotatorStateChecksum2);
  });

  it('should return a different checksum for different categories of annotations', () => {
    const annotations1 = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
      }),
    );
    const annotations2 = [...annotations1].map((annotation, index) => ({
      ...annotation,
      category: index > 5 ? 'prenom' : 'nom',
    }));
    const annotatorState1 = {
      document,
      settings,
      annotations: annotations1,
      mandatoryReplacementTerms: undefined,
    };
    const annotatorState2 = {
      document,
      settings,
      annotations: annotations2,
      mandatoryReplacementTerms: undefined,
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState1);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState2);

    expect(annotatorStateChecksum1).not.toEqual(annotatorStateChecksum2);
  });

  it('should return a different checksum for missing annotations', () => {
    const annotations1 = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
      }),
    );
    const annotations2 = annotations1.filter((_, index) => index >= 5);
    const annotatorState1 = {
      document,
      settings,
      annotations: annotations1,
      mandatoryReplacementTerms: undefined,
    };
    const annotatorState2 = {
      document,
      settings,
      annotations: annotations2,
      mandatoryReplacementTerms: undefined,
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState1);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState2);

    expect(annotatorStateChecksum1).not.toEqual(annotatorStateChecksum2);
  });

  it('should return the same checksum every time for the same array', () => {
    const annotations = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
      }),
    );
    const annotatorState = {
      document,
      settings,
      annotations: annotations,
      mandatoryReplacementTerms: undefined,
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState);

    expect(annotatorStateChecksum1).toEqual(annotatorStateChecksum2);
  });
});
