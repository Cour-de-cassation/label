import { treatmentGenerator } from '../generator';
import { assertTreatmentsSourcesFollowRightOrder } from './assertTreatmentsSourcesFollowRightOrder';

describe('assertTreatmentsSourcesFollowRightOrder', () => {
  it('return true if treatments without supplementary annotations are consistent', () => {
    const treatments = ([
      { source: 'NLP' },
      { source: 'postProcess' },
      { source: 'annotator' },
      { source: 'admin' },
    ] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('return true if treatments with supplementary annotations are consistent', () => {
    const treatments = ([
      { source: 'NLP', order: 0 },
      { source: 'supplementaryAnnotations', order: 1 },
      { source: 'postProcess', order: 2 },
      { source: 'admin', order: 3 },
    ] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('return true if the treatments are not yet completed', () => {
    const treatments = ([
      { source: 'NLP', order: 0 },
      { source: 'postProcess', order: 1 },
    ] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('throw if the treatments are doubled', () => {
    const treatments = ([
      { source: 'NLP', order: 0 },
      { source: 'postProcess', order: 1 },
      { source: 'NLP', order: 2 },
      { source: 'postProcess', order: 3 },
    ] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall).toThrowError(
      Error('Treatment sources do not follow the pattern: [NLP, postProcess, NLP, postProcess]'),
    );
  });
});
