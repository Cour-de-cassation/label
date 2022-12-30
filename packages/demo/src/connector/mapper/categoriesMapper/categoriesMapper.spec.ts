import { categoriesMapper } from './categoriesMapper';

describe('categoriesMapper', () => {
  it('should handle personnePhysique', () => {
    const sderCategories = ['personnePhysiquePrenom', 'personnePhysiqueNom'];

    const labelCategories = categoriesMapper.mapSderCategoriesToLabelCategories(
      sderCategories,
    );

    expect(labelCategories).toEqual(['personnePhysique']);
  });

  it('should handle professionnel', () => {
    const sderCategories = ['professionnelPrenom', 'professionnelNom'];

    const labelCategories = categoriesMapper.mapSderCategoriesToLabelCategories(
      sderCategories,
    );

    expect(labelCategories).toEqual(['professionnelMagistratGreffier']);
  });

  it('should handle personneMorale', () => {
    const sderCategories = ['personneMorale'];

    const labelCategories = categoriesMapper.mapSderCategoriesToLabelCategories(
      sderCategories,
    );

    expect(labelCategories).toEqual(['personneMorale', 'numeroSiretSiren']);
  });

  it('should prevent doublons for personneMorale', () => {
    const sderCategories = ['personneMorale', 'numeroSiretSiren'];

    const labelCategories = categoriesMapper.mapSderCategoriesToLabelCategories(
      sderCategories,
    );

    expect(labelCategories).toEqual(['personneMorale', 'numeroSiretSiren']);
  });

  it('should not do anything', () => {
    const sderCategories = ['adresse'];

    const labelCategories = categoriesMapper.mapSderCategoriesToLabelCategories(
      sderCategories,
    );

    expect(labelCategories).toEqual(['adresse']);
  });
});
