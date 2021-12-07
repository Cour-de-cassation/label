import { annotationModule, documentModule } from '@label/core';
import { computeAdditionalAnnotations } from './computeAdditionalAnnotations';

describe('computeAdditionalAnnotations', () => {
  it('should compute the additional annotations', () => {
    const documentText =
      "Romain, Nicolas and Benoit are entrepreneurs for the Entrepreneurs d'Intérêt Général programme";
    const additionalTermsToAnnotate = 'entrepreneurs';
    const previousAnnotations = [
      ...[
        { text: 'Romain', start: 0 },
        { text: 'Nicolas', start: 8 },
        { text: 'Benoit', start: 20 },
      ].map(({ text, start }) =>
        annotationModule.lib.buildAnnotation({
          text,
          start,
          category: 'custom',
        }),
      ),
      annotationModule.lib.buildAnnotation({
        text: "Entrepreneurs d'Intérêt Général",
        start: 53,
        category: 'personneMorale',
      }),
    ];
    const document = documentModule.generator.generate({
      text: documentText,
      decisionMetadata: {
        additionalTermsToAnnotate,
        appealNumber: '',
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: [],
        chamberName: '',
        criminalCaseCode: '',
        civilCaseCode: '',
        civilMatterCode: '',
        date: new Date().getTime(),
        jurisdiction: '',
        occultationBlock: undefined,
        parties: [],
        session: '',
        solution: '',
        NACCode: '',
      },
    });

    const additionalAnnotations = computeAdditionalAnnotations(
      document,
      previousAnnotations,
      'custom',
    );

    expect(additionalAnnotations.sort()).toEqual([
      annotationModule.lib.buildAnnotation({
        text: 'entrepreneurs',
        start: 31,
        category: 'custom',
      }),
    ]);
  });
});
