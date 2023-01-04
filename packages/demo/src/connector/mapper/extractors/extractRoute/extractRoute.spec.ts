import { extractRoute } from '.';

describe('extractRoute', () => {
  it('should return default', async () => {
    const route = extractRoute();

    expect(route).toBe('default');
  });
});
