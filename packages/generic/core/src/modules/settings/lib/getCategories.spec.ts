import { buildSettings } from './buildSettings';
import { getCategories } from './getCategories';

describe('getCategories', () => {
  const settings = buildSettings({
    prenom: { order: 1, text: 'Prénom', status: 'hidden' },
    nom: { order: 2, text: 'Nom', status: 'alwaysVisible' },
    adresse: { order: 3, text: 'Adresse', status: 'annotable' },
  });
  it('should get all the alwaysVisible and annotable categories', () => {
    const categories = getCategories(settings, ['alwaysVisible', 'annotable']);

    expect(categories).toEqual(['nom', 'adresse']);
  });

  it('should get all the hidden and annotable categories', () => {
    const categories = getCategories(settings, ['hidden', 'annotable']);

    expect(categories).toEqual(['prenom', 'adresse']);
  });

  it('should get all the hidden and alwaysVisible categories', () => {
    const categories = getCategories(settings, ['hidden', 'alwaysVisible']);

    expect(categories).toEqual(['prenom', 'nom']);
  });
});
