export { extractAdditionalAnnotationTerms };

const DELIMITATOR_CHARACTER = '/';

function extractAdditionalAnnotationTerms(additionalTermsToAnnotate: string) {
  return additionalTermsToAnnotate.split(DELIMITATOR_CHARACTER).map((annotationTerm) => annotationTerm.trim());
}
