import { annotationModule } from '../../../modules/annotation';
import { settingsModule } from '../../../modules/settings';
import { buildEntityIdMapper } from './buildEntityIdMapper';
import { isCapitalLetterCharCode } from './isCapitalLetterCharCode';

describe('buildEntityIdMapper', () => {
  const settings = settingsModule.lib.buildSettings({
    prenom: { anonymization: '[%c]' },
    nom: { anonymization: '[%c]' },
    adresse: { anonymization: '[adresse %d]' },
  });
  const annotations = [
    { category: 'nom', start: 0, text: 'gle' },
    { category: 'nom', start: 5, text: 'gle' },
    { category: 'prenom', start: 10, text: 'romain' },
    { category: 'prenom', start: 20, text: 'benoit' },
    { category: 'adresse', start: 30, text: '10 rue' },
    { category: 'adresse', start: 40, text: '20 cour' },
  ].map(annotationModule.lib.buildAnnotation);
  const seed = 123;
  const entityIds = annotations.map((annotation) => annotation.entityId);

  it('should build an entityId mapper', () => {
    const entityIdMapper = buildEntityIdMapper(settings, entityIds, seed);

    expect(isCapitalLetterCharCode(entityIdMapper[annotations[3].entityId].charCodeAt(1))).toBeTruthy();
    expect(isCapitalLetterCharCode(entityIdMapper[annotations[0].entityId].charCodeAt(1))).toBeTruthy();
    expect(isCapitalLetterCharCode(entityIdMapper[annotations[2].entityId].charCodeAt(1))).toBeTruthy();
    expect(entityIdMapper[annotations[3].entityId]).not.toBe(entityIdMapper[annotations[0].entityId]);
    expect(entityIdMapper[annotations[3].entityId]).not.toBe(entityIdMapper[annotations[2].entityId]);
    expect(entityIdMapper[annotations[2].entityId]).not.toBe(entityIdMapper[annotations[0].entityId]);
    expect(entityIdMapper[annotations[4].entityId]).toEqual('[adresse 1]');
    expect(entityIdMapper[annotations[5].entityId]).toEqual('[adresse 2]');
  });
});
