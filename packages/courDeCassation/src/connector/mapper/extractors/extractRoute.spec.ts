import { decisionModule } from 'sder';
import { extractRoute } from './extractRoute';

describe('extractRoute', () => {
  it('should return automatic if NA', () => {
    const decision = decisionModule.lib.generateDecision({
      solution: 'Non-admission',
    });

    const route = extractRoute(decision);

    expect(route).toBe('automatic');
  });
});
