export { normalizeString };

function normalizeString(text: string) {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[ç]/g, 'c')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[ñ]/g, 'n')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûüũ]/g, 'u')
    .replace(/[ýŷÿ]/g, 'y');
}
