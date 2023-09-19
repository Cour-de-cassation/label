import { treatmentGenerator } from '../generator';
import { assertTreatmentsSourcesFollowRightOrder } from './assertTreatmentsSourcesFollowRightOrder';

describe('assertTreatmentsSourcesFollowRightOrder', () => {
  it('return true if treatments without supplementary annotations are consistent', () => {
    const treatments = (
      [
        { source: 'NLPTagger' },
        { source: 'NLPPostProcess' },
        { source: 'NLP' },
        { source: 'postProcess' },
        { source: 'annotator' },
        { source: 'admin' },
      ] as const
    ).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('return true if treatments with supplementary annotations are consistent', () => {
    const treatments = (
      [
        { source: 'NLPTagger', order: 0 },
        { source: 'NLPPostProcess', order: 1 },
        { source: 'NLP', order: 2 },
        { source: 'supplementaryAnnotations', order: 3 },
        { source: 'postProcess', order: 4 },
        { source: 'admin', order: 5 },
      ] as const
    ).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('return true if the treatments are not yet completed', () => {
    const treatments = (
      [
        { source: 'NLPTagger', order: 0 },
        { source: 'NLPPostProcess', order: 1 },
        { source: 'NLP', order: 2 },
        { source: 'postProcess', order: 3 },
      ] as const
    ).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('throw if the treatments are doubled', () => {
    const treatments = (
      [
        { source: 'NLPTagger', order: 0 },
        { source: 'NLPPostProcess', order: 1 },
        { source: 'NLP', order: 2 },
        { source: 'postProcess', order: 3 },
        { source: 'NLPTagger', order: 4 },
        { source: 'NLPPostProcess', order: 5 },
        { source: 'NLP', order: 6 },
        { source: 'postProcess', order: 7 },
      ] as const
    ).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall).toThrowError(
      Error(
        'Treatment sources do not follow the pattern: [NLPTagger, NLPPostProcess, NLP, postProcess, NLPTagger, NLPPostProcess, NLP, postProcess]',
      ),
    );
  });
});
