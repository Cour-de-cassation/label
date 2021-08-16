import { extractReadableChamberName } from './extractReadableChamberName';

describe('extractReadableChamberName', () => {
  it('should return "Chambre sociale" ', () => {
    const chamberId = 'SOC';

    const readableChamberName = extractReadableChamberName({ chamberId });

    expect(readableChamberName).toBe('Chambre sociale');
  });

  it('should return "Chambre civile II" ', () => {
    const chamberId = 'CIV.2';

    const readableChamberName = extractReadableChamberName({ chamberId });

    expect(readableChamberName).toBe('Chambre civile II');
  });
});
