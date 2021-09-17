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
      { source: 'NLP' },
      { source: 'supplementaryAnnotations' },
      { source: 'postProcess' },
      { source: 'admin' },
    ] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('return true if the treatments are not yet completed', () => {
    const treatments = ([{ source: 'NLP' }, { source: 'postProcess' }] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall()).toBe(true);
  });

  it('throw if the treatments are doubled', () => {
    const treatments = ([
      { source: 'NLP' },
      { source: 'postProcess' },
      { source: 'NLP' },
      { source: 'postProcess' },
    ] as const).map(treatmentGenerator.generate);

    const functionCall = () => assertTreatmentsSourcesFollowRightOrder(treatments);

    expect(functionCall).toThrowError(
      Error('Treatment sources do not follow the pattern: [NLP, postProcess, NLP, postProcess]'),
    );
  });
});
