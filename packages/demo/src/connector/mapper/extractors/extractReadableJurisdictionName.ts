export { extractReadableJurisdictionName };

function extractReadableJurisdictionName(jurisdictionName?: string) {
  if (!jurisdictionName) {
    return '';
  }
  if (jurisdictionName.toLowerCase() === 'cour de cassation') {
    return 'Cour de cassation';
  }
  return jurisdictionName.trim();
}
