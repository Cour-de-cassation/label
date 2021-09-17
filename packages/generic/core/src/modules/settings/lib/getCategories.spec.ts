import { buildSettings } from './buildSettings';
import { getCategories } from './getCategories';

describe('getCategories', () => {
  describe('filter by status', () => {
    const settings = buildSettings({
      prenom: { order: 1, text: 'Prénom', status: 'hidden', canBeAnnotatedBy: 'human' },
      nom: { order: 2, text: 'Nom', status: 'alwaysVisible', canBeAnnotatedBy: 'human' },
      adresse: { order: 3, text: 'Adresse', status: 'annotable', canBeAnnotatedBy: 'human' },
    });

    it('should get all the alwaysVisible and annotable categories', () => {
      const categories = getCategories(settings, { status: ['alwaysVisible', 'annotable'], canBeAnnotatedBy: 'human' });

      expect(categories).toEqual(['nom', 'adresse']);
    });

    it('should get all the hidden and annotable categories', () => {
      const categories = getCategories(settings, { status: ['hidden', 'annotable'], canBeAnnotatedBy: 'human' });

      expect(categories).toEqual(['prenom', 'adresse']);
    });
  });
  describe('filter by annotatibility', () => {
    const settings = buildSettings({
      prenom: { order: 1, text: 'Prénom', status: 'annotable', canBeAnnotatedBy: 'human' },
      nom: { order: 2, text: 'Nom', status: 'annotable', canBeAnnotatedBy: 'both' },
      adresse: { order: 3, text: 'Adresse', status: 'annotable', canBeAnnotatedBy: 'NLP' },
    });

    it('should get all the annotable and human categories', () => {
      const categories = getCategories(settings, { status: ['annotable'], canBeAnnotatedBy: 'human' });

      expect(categories).toEqual(['prenom', 'nom']);
    });

    it('should get all the annotable and NLP categories', () => {
      const categories = getCategories(settings, { status: ['annotable'], canBeAnnotatedBy: 'NLP' });

      expect(categories).toEqual(['nom', 'adresse']);
    });
  });
});
