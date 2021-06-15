import { extractAdditionalAnnotationTerms } from './extractAdditionalAnnotationTerms';

describe('extractAdditionalAnnotationTerms', () => {
  it('should extract the additional annotation terms', () => {
    const additionalTermsToAnnotate = 'One term / the second term';

    const additionalAnnotationTerms = extractAdditionalAnnotationTerms(additionalTermsToAnnotate);

    expect(additionalAnnotationTerms).toEqual(['One term', 'the second term']);
  });
});
