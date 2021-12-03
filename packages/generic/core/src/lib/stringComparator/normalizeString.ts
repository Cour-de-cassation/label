export { normalizeString };

function normalizeString(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[àâ]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[ç]/g, 'c')
    .replace(/[ïî]/g, 'i')
    .replace(/[ô]/g, 'o')
    .replace(/[ûùü]/g, 'u')
    .replace(/[ÿ]/g, 'y');
}
