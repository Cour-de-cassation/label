import { additionalAnnotationCategoryHandler } from './additionalAnnotationCategoryHandler';
import { buildSettings } from './buildSettings';
import { computeFilteredSettings } from './computeFilteredSettings';
import { motivationCategoryHandler } from './motivationCategoryHandler';

describe('computeFilteredSettings', () => {
  const additionalAnnotationCategory = additionalAnnotationCategoryHandler.getCategoryName();
  const motivationCategory = motivationCategoryHandler.getCategoryName();
  const settings = buildSettings({
    prenom: { order: 1, text: 'Prénom', status: 'hidden' },
    professionnelMagistratGreffier: { order: 2, text: 'Magistrat et membre du greffe', status: 'visible' },
    professionnelAvocat: { order: 3, text: 'Avocat', status: 'alwaysVisible' },
    [additionalAnnotationCategory]: { order: 4, text: 'Occultation supplémentaire', status: 'hidden' },
    [motivationCategory]: { order: 5, text: 'Motivations de la décision', status: 'hidden' },
  });
  it('should compute filtered settings for an omitted hidden category', () => {
    const categoriesToOmit = ['prenom'];
    const additionalTermsToAnnotate = '';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = undefined;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );
    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('annotable');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for an omitted visible category', () => {
    const categoriesToOmit = ['professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = '';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = undefined;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for an omitted alwaysVisible category', () => {
    const categoriesToOmit = ['professionnelAvocat'];
    const additionalTermsToAnnotate = '';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = undefined;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('annotable');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('annotable');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for additional annotations before sendind to nlp api (parsing not done yet)', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = undefined;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('annotable');
  });

  it('should compute filtered settings for additional annotations when parsing failed', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = true;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('annotable');
  });

  it('should compute filtered settings for additional annotations when parsing succeed but no additional terms to annotate after parsing', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';
    const computedAdditionalTerms = { additionalTermsToAnnotate: [], additionalTermsToUnAnnotate: ['toUnanotate'] };
    const additionalTermsParsingFailed = false;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('hidden');
  });

  it('should compute filtered settings for additional annotations when parsing succeed AND there is additional terms to annotate after parsing', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';
    const computedAdditionalTerms = {
      additionalTermsToAnnotate: ['toAnnotate', 'another'],
      additionalTermsToUnAnnotate: ['toUnanotate'],
    };
    const additionalTermsParsingFailed = false;
    const motivationOccultation = undefined;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings[additionalAnnotationCategory].status).toBe('annotable');
  });

  it('should compute filtered settings for motivation when motivationOccultation is true', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = false;
    const motivationOccultation = true;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings['motivations'].status).toBe('annotable');
  });

  it('should compute filtered settings for motivation when motivationOccultation is false', () => {
    const categoriesToOmit = ['prenom', 'professionnelAvocat', 'professionnelMagistratGreffier'];
    const additionalTermsToAnnotate = 'thing';
    const computedAdditionalTerms = undefined;
    const additionalTermsParsingFailed = false;
    const motivationOccultation = false;

    const filteredSettings = computeFilteredSettings(
      settings,
      categoriesToOmit,
      additionalTermsToAnnotate,
      computedAdditionalTerms,
      additionalTermsParsingFailed,
      motivationOccultation,
    );

    expect(filteredSettings['prenom'].status).toBe('hidden');
    expect(filteredSettings['professionnelMagistratGreffier'].status).toBe('visible');
    expect(filteredSettings['professionnelAvocat'].status).toBe('alwaysVisible');
    expect(filteredSettings['motivations'].status).toBe('hidden');
  });
});
