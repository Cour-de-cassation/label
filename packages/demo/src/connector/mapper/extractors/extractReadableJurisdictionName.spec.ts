import { extractReadableJurisdictionName } from './extractReadableJurisdictionName';

describe('extractReadableJurisdictionName', () => {
  it('should return "Cour de cassation" ', () => {
    const jurisdictionName = 'Cour de cassation';

    const readableJurisdictionName = extractReadableJurisdictionName(
      jurisdictionName,
    );

    expect(readableJurisdictionName).toBe('Cour de cassation');
  });

  it('should return "cour d\'appel de Rouen" ', () => {
    const jurisdictionName = "cour d'appel de Rouen";

    const readableJurisdictionName = extractReadableJurisdictionName(
      jurisdictionName,
    );

    expect(readableJurisdictionName).toBe("cour d'appel de Rouen");
  });
});
