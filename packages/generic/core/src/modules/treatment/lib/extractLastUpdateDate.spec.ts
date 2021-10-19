import { treatmentGenerator } from '../generator';
import { extractLastUpdateDate } from './extractLastUpdateDate';

describe('extractLastUpdateDate', () => {
  it('should return the last update date', () => {
    const treatments = [{ lastUpdateDate: 123 }, { lastUpdateDate: 789 }, { lastUpdateDate: 456 }].map(
      treatmentGenerator.generate,
    );

    const lastUpdateDate = extractLastUpdateDate(treatments);

    expect(lastUpdateDate).toBe(789);
  });
});
