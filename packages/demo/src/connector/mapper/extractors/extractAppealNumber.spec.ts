import { extractAppealNumber } from './extractAppealNumber';

describe('extractAppealNumber', () => {
  it('should extract appeal number from text', () => {
    const text = 'Pourvoi n° K 08-16.486 de telle décision';

    const appealNumber = extractAppealNumber(text);

    expect(appealNumber).toBe('08-16.486');
  });

  it('should extract no appeal number', () => {
    const text = 'Pas de pourvoi';

    const appealNumber = extractAppealNumber(text);

    expect(appealNumber).toBe(undefined);
  });
});
