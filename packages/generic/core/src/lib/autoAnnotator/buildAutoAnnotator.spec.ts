import { annotationModule } from '../../modules/annotation';
import { settingsModule } from '../../modules/settings';
import { buildAutoAnnotator } from './buildAutoAnnotator';

describe('buildAutoAnnotator', () => {
  describe('annotate', () => {
    it('should change the category of the annotations if they could be from another one', () => {
      const annotations = [
        { text: 'TEXT_1', category: 'CATEGORY_1' },
        { text: 'TEXT_1', category: 'CATEGORY_1' },
        { text: 'TEXT_1', category: 'CATEGORY_2' },
      ].map(annotationModule.generator.generate);
      const settings = settingsModule.lib.buildSettings({
        CATEGORY_1: {
          couldBe: 'CATEGORY_2',
        },
        CATEGORY_2: {},
      });
      const autoAnnotator = buildAutoAnnotator(settings);

      const autoAnnotatedAnnotations = autoAnnotator.annotate(annotations);

      expect(annotationModule.lib.sortAnnotations(autoAnnotatedAnnotations)).toEqual(
        annotationModule.lib.sortAnnotations([
          {
            ...annotations[0],
            category: 'CATEGORY_2',
            entityId: annotationModule.lib.entityIdHandler.compute('CATEGORY_2', 'TEXT_1'),
          },
          {
            ...annotations[1],
            category: 'CATEGORY_2',
            entityId: annotationModule.lib.entityIdHandler.compute('CATEGORY_2', 'TEXT_1'),
          },
          annotations[2],
        ]),
      );
    });

    it('should not change the category of the annotations if none could be from another one', () => {
      const annotations = [
        { text: 'TEXT_1', category: 'CATEGORY_1' },
        { text: 'TEXT_1', category: 'CATEGORY_1' },
        { text: 'TEXT_3', category: 'CATEGORY_2' },
      ].map(annotationModule.generator.generate);
      const settings = settingsModule.lib.buildSettings({
        CATEGORY_1: {
          couldBe: 'CATEGORY_2',
        },
        CATEGORY_2: {},
      });
      const autoAnnotator = buildAutoAnnotator(settings);

      const autoAnnotatedAnnotations = autoAnnotator.annotate(annotations);

      expect(annotationModule.lib.sortAnnotations(autoAnnotatedAnnotations)).toEqual(
        annotationModule.lib.sortAnnotations(annotations),
      );
    });

    it('should auto link the annotations', () => {
      const annotations = [
        { text: 'TEXT_1', category: 'CATEGORY_1' },
        { text: 'TEXT_2', category: 'CATEGORY_1' },
      ].map(annotationModule.generator.generate);
      const settings = settingsModule.lib.buildSettings({
        CATEGORY_1: {
          couldBe: 'CATEGORY_2',
        },
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

    it('should apply an auto annotation (general case)', () => {
      const annotations = [
        { text: 'lala', category: 'CATEGORY_1' },
        { text: 'lolo', category: 'CATEGORY_1' },
        { text: 'làlà', category: 'CATEGORY_1' },
        { text: 'lâla', category: 'CATEGORY_2' },
      ].map(annotationModule.generator.generate);
      const settings = settingsModule.lib.buildSettings({
        CATEGORY_1: {
          couldBe: 'CATEGORY_2',
        },
        CATEGORY_2: {},
      });
      const autoAnnotator = buildAutoAnnotator(settings);

      const autoAnnotatedAnnotations = autoAnnotator.annotate(annotations);

      expect(annotationModule.lib.sortAnnotations(autoAnnotatedAnnotations)).toEqual(
        annotationModule.lib.sortAnnotations([
          {
            ...annotations[0],
            category: 'CATEGORY_2',
            entityId: annotationModule.lib.entityIdHandler.compute('CATEGORY_2', 'lâla'),
          },
          annotations[1],
          {
            ...annotations[2],
            category: 'CATEGORY_2',
            entityId: annotationModule.lib.entityIdHandler.compute('CATEGORY_2', 'lâla'),
          },
          annotations[3],
        ]),
      );
    });
  });
});
