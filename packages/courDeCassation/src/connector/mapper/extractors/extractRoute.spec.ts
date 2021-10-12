import { decisionModule } from 'sder';
import { extractRoute } from './extractRoute';

describe('extractRoute', () => {
  it('should return exhaustive if NA and CRIM', () => {
    const decision = decisionModule.lib.generateDecision({
      chamberId: 'CR',
      solution: 'Non-admission',
    });

    const route = extractRoute(decision);

    expect(route).toBe('exhaustive');
  });

  it('should return automatic if NA and not CRIM', () => {
    const decision = decisionModule.lib.generateDecision({
      chamberId: 'CIV.1',
      solution: 'Non-admission',
    });

    const route = extractRoute(decision);

    expect(route).toBe('automatic');
  });
});
