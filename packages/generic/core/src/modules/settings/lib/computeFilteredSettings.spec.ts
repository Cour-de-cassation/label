import { additionalAnnotationCategoryHandler } from './additionalAnnotationCategoryHandler';
import { buildSettings } from './buildSettings';
import { computeFilteredSettings } from './computeFilteredSettings';

describe('computeFilteredSettings', () => {
  const additionalAnnotationCategory = additionalAnnotationCategoryHandler.getCategoryName();
  const settings = buildSettings({
    prenom: { order: 1, text: 'Prénom', status: 'hidden' },
    nom: { order: 2, text: 'Nom', status: 'alwaysVisible' },
    adresse: { order: 3, text: 'Adresse', status: 'annotable' },
    [additionalAnnotationCategory]: { order: 4, text: 'Occultation supplémentaire', status: 'hidden' },
  });
  xit('should compute filtered settings for an omitted hidden category', () => {
    const categoriesToOmit = ['prenom'];
    const additionalTermsToAnnotate = '';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);
    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['nom'].status).toBe('alwaysVisible');
    expect(filteredSettings['adresse'].status).toBe('annotable');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  xit('should compute filtered settings for an omitted visible category', () => {
    const categoriesToOmit = ['nom'];
    const additionalTermsToAnnotate = '';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['nom'].status).toBe('alwaysVisible');
    expect(filteredSettings['adresse'].status).toBe('annotable');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  xit('should compute filtered settings for an omitted annotable category', () => {
    const categoriesToOmit = ['adresse'];
    const additionalTermsToAnnotate = '';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['nom'].status).toBe('alwaysVisible');
    expect(filteredSettings['adresse'].status).toBe('annotable');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  xit('should compute filtered settings for additional annotations', () => {
    const categoriesToOmit = ['prenom', 'adresse', 'nom'];
    const additionalTermsToAnnotate = 'thing';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['nom'].status).toBe('alwaysVisible');
    expect(filteredSettings['adresse'].status).toBe('annotable');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('annotable');
  });
});
