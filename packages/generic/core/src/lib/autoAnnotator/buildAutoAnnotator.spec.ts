import { annotationModule } from '../../modules/annotation';
import { settingsModule } from '../../modules/settings';
import { buildAutoAnnotator } from './buildAutoAnnotator';

describe('buildAutoAnnotator', () => {
  describe('annotate', () => {
    it('should auto link the annotations', () => {
      const annotations = [
        { text: 'TEXT_1', category: 'CATEGORY_1' },
        { text: 'TEXT_2', category: 'CATEGORY_1' },
      ].map(annotationModule.generator.generate);
      const settings = settingsModule.lib.buildSettings({
        CATEGORY_1: {},
        CATEGORY_2: {},
      });
      const autoAnnotator = buildAutoAnnotator(settings);

      const autoAnnotatedAnnotations = autoAnnotator.annotate(annotations);

      expect(annotationModule.lib.sortAnnotations(autoAnnotatedAnnotations)).toEqual(
        annotationModule.lib.sortAnnotations([
          {
            ...annotations[0],
            category: 'CATEGORY_1',
            entityId: annotationModule.lib.entityIdHandler.compute('CATEGORY_1', 'TEXT_2'),
          },
          annotations[1],
        ]),
      );
    });
  });
});
