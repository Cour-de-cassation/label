import { additionalAnnotationCategoryHandler } from './additionalAnnotationCategoryHandler';
import { buildSettings } from './buildSettings';
import { computeFilteredSettings } from './computeFilteredSettings';

describe('computeFilteredSettings', () => {
  const additionalAnnotationCategory = additionalAnnotationCategoryHandler.getCategoryName();
  const settings = buildSettings({
    prenom: { order: 1, text: 'Prénom', status: 'hidden' },
    professionnelMagistratGreffier: { order: 2, text: 'Magistrat et membre du greffe', status: 'visible' },
    professionnelAvocat: { order: 3, text: 'Avocat', status: 'alwaysVisible' },
    [additionalAnnotationCategory]: { order: 4, text: 'Occultation supplémentaire', status: 'hidden' },
  });
  it('should compute filtered settings for an omitted hidden category', () => {
    const categoriesToOmit = ['prenom'];
    const additionalTermsToAnnotate = '';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);
    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('annotable');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for an omitted visible category', () => {
    const categoriesToOmit = ['professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = '';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for an omitted alwaysVisible category', () => {
    const categoriesToOmit = ['professionnelAvocat'];
    const additionalTermsToAnnotate = '';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('annotable');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for additional annotations', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit, additionalTermsToAnnotate);

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('annotable');
  });
});
