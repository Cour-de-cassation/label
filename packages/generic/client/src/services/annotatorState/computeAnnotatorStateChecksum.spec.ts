import { annotationModule, settingsModule, documentModule, replacementTermType } from '@label/core';
import { range } from 'lodash';
import { computeAnnotatorStateChecksum } from './computeAnnotatorStateChecksum';

describe('computeAnnotatorStateChecksum', () => {
  const checklist = documentModule.checklistGenerator.generate(2);
  const document = documentModule.generator.generate();
  const settings = settingsModule.lib.buildSettings({ prenom: {}, nom: {} });

  it('should return the same checksum every time for the same array', () => {
    const annotations = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
        score: 1,
        source: 'agent',
      }),
    );
    const annotatorState = {
      checklist,
      document,
      settings,
      annotations: annotations,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState);

    expect(annotatorStateChecksum1).toEqual(annotatorStateChecksum2);
  });

  it('should return the same checksum for reversed annotations', () => {
    const checklist = documentModule.checklistGenerator.generate(2);
    const annotations1 = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
        score: 1,
        source: 'agent',
      }),
    );
    const annotations2 = [...annotations1].reverse();
    const annotatorState1 = {
      checklist,
      document,
      settings,
      annotations: annotations1,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };
    const annotatorState2 = {
      checklist,
      document,
      settings,
      annotations: annotations2,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState1);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState2);

    expect(annotatorStateChecksum1).toEqual(annotatorStateChecksum2);
  });

  it('should return a different checksum for different categories of annotations', () => {
    const checklist = documentModule.checklistGenerator.generate(2);
    const annotations1 = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
        score: 1,
        source: 'agent',
      }),
    );
    const annotations2 = [...annotations1].map((annotation, index) => ({
      ...annotation,
      category: index > 5 ? 'prenom' : 'nom',
    }));
    const annotatorState1 = {
      checklist,
      document,
      settings,
      annotations: annotations1,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };
    const annotatorState2 = {
      checklist,
      document,
      settings,
      annotations: annotations2,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState1);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState2);

    expect(annotatorStateChecksum1).not.toEqual(annotatorStateChecksum2);
  });

  it('should return a different checksum for missing annotations', () => {
    const checklist = documentModule.checklistGenerator.generate(2);
    const annotations1 = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
        score: 1,
        source: 'agent',
      }),
    );
    const annotations2 = annotations1.filter((_, index) => index >= 5);
    const annotatorState1 = {
      checklist,
      document,
      settings,
      annotations: annotations1,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };
    const annotatorState2 = {
      checklist,
      document,
      settings,
      annotations: annotations2,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState1);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState2);

    expect(annotatorStateChecksum1).not.toEqual(annotatorStateChecksum2);
  });

  it('should return the same checksum every time for the same array', () => {
    const checklist = documentModule.checklistGenerator.generate(2);
    const annotations = range(10).map((index) =>
      annotationModule.lib.buildAnnotation({
        category: 'prenom',
        start: index * 10,
        text: 'TRUC',
        score: 1,
        source: 'agent',
      }),
    );
    const annotatorState = {
      checklist,
      document,
      settings,
      annotations: annotations,
      mandatoryReplacementTerms: [] as replacementTermType[],
    };

    const annotatorStateChecksum1 = computeAnnotatorStateChecksum(annotatorState);
    const annotatorStateChecksum2 = computeAnnotatorStateChecksum(annotatorState);

    expect(annotatorStateChecksum1).toEqual(annotatorStateChecksum2);
  });
});
