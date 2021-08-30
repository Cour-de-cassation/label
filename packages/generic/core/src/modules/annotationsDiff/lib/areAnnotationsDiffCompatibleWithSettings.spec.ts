import { settingsModule } from '../../../modules/settings';
import { annotationModule } from '../../../modules/annotation';
import { annotationsDiffGenerator } from '../generator';
import { areAnnotationsDiffCompatibleWithSettings } from './areAnnotationsDiffCompatibleWithSettings';

describe('areAnnotationsDiffCompatibleWithSettings', () => {
  it('should return true', () => {
    const afterAnnotations = [{ category: 'prenom', start: 0, text: 'Benoit' }].map(
      annotationModule.lib.buildAnnotation,
    );
    const annotationsDiff = annotationsDiffGenerator.generate({ after: afterAnnotations });
    const settings = settingsModule.lib.buildSettings({ prenom: {} });

    expect(areAnnotationsDiffCompatibleWithSettings(annotationsDiff, settings)).toBeTruthy();
  });

  it('should return false', () => {
    const beforeAnnotations = [{ category: 'prenom', start: 0, text: 'Benoit' }].map(
      annotationModule.lib.buildAnnotation,
    );
    const afterAnnotations = [
      { category: 'nom', start: 0, text: 'Benoit' },
      { category: 'prenom', start: 10, text: 'Benoit' },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffGenerator.generate({ before: beforeAnnotations, after: afterAnnotations });
    const settings = settingsModule.lib.buildSettings({ prenom: {} });

    expect(areAnnotationsDiffCompatibleWithSettings(annotationsDiff, settings)).toBeFalsy();
  });
});
