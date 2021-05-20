import { treatmentGenerator } from '../generator';
import { getLastTreatment } from './getLastTreatment';

describe('getLastTreatment', () => {
  it('should extract the last treatment', () => {
    const treatments = [0, 2, 1].map((order) => treatmentGenerator.generate({ order }));

    const lastTreatment = getLastTreatment(treatments);

    expect(lastTreatment).toEqual(treatments[1]);
  });
});
