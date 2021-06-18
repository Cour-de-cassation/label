import { buildSettings } from './buildSettings';
import { computeFilteredSettings } from './computeFilteredSettings';

describe('computeFilteredSettings', () => {
  const settings = buildSettings({
    prenom: { order: 1, text: 'Prénom', status: 'hidden' },
    nom: { order: 2, text: 'Nom', status: 'visible' },
    adresse: { order: 3, text: 'Adresse', status: 'annotable' },
  });
  it('should compute filtered settings for an omitted hidden category', () => {
    const categoriesToOmit = ['prenom'];

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit);
    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['nom'].status).toBe('annotable');
    expect(filteredSettings['adresse'].status).toBe('annotable');
  });

  it('should compute filtered settings for an omitted visible category', () => {
    const categoriesToOmit = ['nom'];

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit);

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['nom'].status).toBe('visible');
    expect(filteredSettings['adresse'].status).toBe('annotable');
  });

  it('should compute filtered settings for an omitted annotable category', () => {
    const categoriesToOmit = ['adresse'];

    const filteredSettings = computeFilteredSettings(settings, categoriesToOmit);

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['nom'].status).toBe('annotable');
    expect(filteredSettings['adresse'].status).toBe('annotable');
  });
});
