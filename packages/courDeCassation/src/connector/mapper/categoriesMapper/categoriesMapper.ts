export { categoriesMapper };

const categoriesMapper = {
  mapSderCategoriesToLabelCategories(
    sderCategoriesToOmit?: string[],
  ): string[] {
    if (!sderCategoriesToOmit) {
      return [];
    }

    let categoriesToOmit = [...sderCategoriesToOmit];

    if (
      categoriesToOmit.includes('personnePhysiqueNom') ||
      categoriesToOmit.includes('personnePhysiquePrenom')
    ) {
      categoriesToOmit = [
        ...categoriesToOmit.filter(
          (category) =>
            category !== 'personnePhysiqueNom' &&
            category !== 'personnePhysiquePrenom',
        ),
        'personnePhysique',
      ];
    }

    if (
      categoriesToOmit.includes('professionnelNom') ||
      categoriesToOmit.includes('professionnelPrenom')
    ) {
      categoriesToOmit = [
        ...categoriesToOmit.filter(
          (category) =>
            category !== 'professionnelNom' &&
            category !== 'professionnelPrenom',
        ),
        'professionnelMagistratGreffier',
      ];
    }

    if (
      categoriesToOmit.includes('personneMorale') &&
      !categoriesToOmit.includes('numeroSiretSiren')
    ) {
      categoriesToOmit = [...categoriesToOmit, 'numeroSiretSiren'];
    }

    return categoriesToOmit;
  },
};
