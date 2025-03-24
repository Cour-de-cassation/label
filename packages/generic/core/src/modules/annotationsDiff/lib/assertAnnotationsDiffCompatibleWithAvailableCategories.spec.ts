import { settingsModule } from '../../settings';
import { annotationModule } from '../../annotation';
import { annotationsDiffGenerator } from '../generator';
import { assertAnnotationsDiffCompatibleWithAvailableCategories } from './assertAnnotationsDiffCompatibleWithAvailableCategories';

describe('assertAnnotationsDiffCompatibleWithAvailableCategories', () => {
  it('should return true', () => {
    const afterAnnotations = [{ category: 'prenom', start: 0, text: 'Benoit', score: 1, source: 'agent' }].map(
      annotationModule.lib.buildAnnotation,
    );
    const annotationsDiff = annotationsDiffGenerator.generate({ after: afterAnnotations });
    const settings = settingsModule.lib.buildSettings({ prenom: {} });
    const availableCategories = Object.keys(settings);

    expect(assertAnnotationsDiffCompatibleWithAvailableCategories(annotationsDiff, availableCategories)).toBeTruthy();
  });

  it('should throw', () => {
    const beforeAnnotations = [{ category: 'prenom', start: 0, text: 'Benoit', score: 1, source: 'agent' }].map(
      annotationModule.lib.buildAnnotation,
    );
    const afterAnnotations = [
      { category: 'nom', start: 0, text: 'Benoit', score: 1, source: 'agent' },
      { category: 'prenom', start: 10, text: 'Benoit', score: 1, source: 'agent' },
    ].map(annotationModule.lib.buildAnnotation);
    const annotationsDiff = annotationsDiffGenerator.generate({ before: beforeAnnotations, after: afterAnnotations });
    const settings = settingsModule.lib.buildSettings({ prenom: {} });
    const availableCategories = Object.keys(settings);

    const functionCall = () =>
      assertAnnotationsDiffCompatibleWithAvailableCategories(annotationsDiff, availableCategories);

    expect(functionCall).toThrowError(
      '(nom / Benoit (nom_benoit) / 0) category is not in availableCategories: [prenom]',
    );
  });
});
